import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import { AuthContext } from "../../context/AuthContext";
import { fetchByOwner } from "../../api/courses";
import { createVideo } from "../../api/videos";

export default function VideoForm() {
  const { profile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const presetTitle = searchParams.get("title") || "";
  const presetCourseId = searchParams.get("course") || "";

  const [form, setForm] = useState({
    course: "",
    title: "",
    description: "",
  });

  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;

    fetchByOwner(profile.username)
      .then((data) => {
        setCourses(data);
        setForm((f) => ({
          ...f,
          course: presetCourseId,
          title: presetTitle,
        }));
      })
      .catch(() => setError("Could not load courses"));
  }, [profile, presetCourseId, presetTitle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      title: form.title,
      description: form.description,
    };
    createVideo(payload)
      .then((video) => {
        navigate(`/videos/${video.id}`);
      })
      .catch(() => {
        setSaving(false);
        setError("Failed to create video.");
      });
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <aside className="col-md-3">
          <Sidebar />
        </aside>
        <section className="col-md-9">
          <h4 className="mb-3">Create Video</h4>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Course</label>
              <input
                className="form-control"
                type="text"
                value={
                  courses.find((c) => c.id.toString() === form.course)?.title || ""
                }
                disabled
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Video Title</label>
              <input
                className="form-control"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description (optional)</label>
              <textarea
                className="form-control"
                name="description"
                rows="3"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <button className="btn btn-primary" disabled={saving}>
              {saving ? "Creating..." : "Create Video"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

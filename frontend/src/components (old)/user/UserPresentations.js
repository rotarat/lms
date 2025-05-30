import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { AuthContext } from "../../context/AuthContext";
import {
  fetchPresentationsByOwner,
  deletePresentation,
} from "../../api/presentations";

export default function UserPresentations() {
  const { profile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [list, setList]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!profile) return;
    setLoading(true);
    fetchPresentationsByOwner(profile.username)
      .then((data) => {
        setList(data);
        setError(null);
      })
      .catch((e) => setError(e.response?.data || "Failed to load"))
      .finally(() => setLoading(false));
  }, [profile]);

  const handleDelete = async (id) => {
    if (!window.confirm("Really delete this presentation?")) return;
    try {
      await deletePresentation(id);
      setList((ps) => ps.filter((p) => p.id !== id));
    } catch {
      alert("Delete failed, please try again.");
    }
  };

  const handleEdit = (id) => {
    navigate(`/presentations/${id}/edit`);
  };

  const handleAddNew = () => {
    navigate("/presentations/create");
  };

  const handleCreateVideo = (title, course) => {
    navigate(`/videos/create?title=${title}&course=${course}`);
  };

  if (!profile) return <p>Loading…</p>;
  if (loading)   return <p>Loading your presentations…</p>;
  if (error)     return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <div className="row">
        <aside className="col-md-3"><Sidebar /></aside>
        <section className="col-md-9">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">My Presentations</h4>
            <button className="btn btn-primary" onClick={handleAddNew}>
              Add New
            </button>
          </div>

          {list.length === 0 ? (
            <p>You have no presentations yet.</p>
          ) : (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Title</th>
                  <th style={{ width: 240 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.id}>
                    <td>{p.title}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => handleCreateVideo(p.title, p.course)}
                      >
                        Create Video 
                      </button>
                      <button
                        className="btn btn-sm btn-secondary me-2"
                        onClick={() => handleEdit(p.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}

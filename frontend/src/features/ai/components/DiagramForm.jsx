import { useState } from 'react';

const DiagramForm = ({ onSubmit }) => {
  const [action, setAction] = useState('diagram'); // default to “diagram”
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(text, file, action);
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
      {/* ─────────── Bootstrap select for “action” ─────────── */}
      <div>
        <label htmlFor="actionSelect" className="form-label">
          Select Action
        </label>
        <select
          id="actionSelect"
          className="form-select"
          value={action}
          onChange={(e) => {
            setAction(e.target.value);
            // reset inputs when switching
            setText('');
            setFile(null);
          }}
        >
          <option value="diagram">Generate Diagram</option>
          <option value="explanation">Explain Diagram</option>
        </select>
      </div>

      {/* ─────────── Textarea (only enabled for “diagram”) ─────────── */}
      <textarea
        className="form-control"
        placeholder="Enter your diagram description..."
        rows="4"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={action !== 'diagram'}
      />

      {/* ─────────── File input (only enabled for “explanation”) ─────────── */}
      <input
        type="file"
        className="form-control"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        disabled={action !== 'explanation'}
      />

      <button className="btn btn-primary" type="submit">
        Submit
      </button>
    </form>
  );
};

export default DiagramForm;

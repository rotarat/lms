import { useState } from 'react';
import { LoadingButton } from '../../../shared/components/LoadingButton';

const DiagramForm = ({ onSubmit, onFileSelect, loading }) => {
  const [action, setAction] = useState('diagram');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!loading) {
      onSubmit(text, file, action);
    }
  };

  const handleFileChange = (e) => {
    const picked = e.target.files[0] || null;
    setFile(picked);
    // Notify parent immediately so it can set previewUrl
    onFileSelect(picked);
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
      {/* Action selector */}
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
            setText('');
            setFile(null);
            onFileSelect(null); // clear preview when switching modes
          }}
          disabled={loading}
        >
          <option value="diagram">Generate Diagram</option>
          <option value="explanation">Explain Diagram</option>
        </select>
      </div>

      {/* Text input (diagram mode) */}
      <textarea
        className="form-control"
        placeholder="Enter your diagram description..."
        rows="4"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={action !== 'diagram' || loading}
      />

      {/* File input (explanation mode) */}
      <input
        type="file"
        className="form-control"
        accept="image/*"
        onChange={handleFileChange}
        disabled={action !== 'explanation' || loading}
      />

      {/* Submit button (LoadingButton) */}
      <LoadingButton
        type="submit"
        loading={loading}
        className="w-100"
      >
        Submit
      </LoadingButton>
    </form>
  );
};

export default DiagramForm;

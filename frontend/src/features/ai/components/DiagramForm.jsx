import { useState } from 'react';

const DiagramForm = ({ onSubmit }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(text, file);
  };

  return (
    <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
      <textarea
        className="form-control"
        placeholder="Enter your diagram description..."
        rows="4"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        type="file"
        className="form-control"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button className="btn btn-primary" type="submit">Submit</button>
    </form>
  );
};

export default DiagramForm;

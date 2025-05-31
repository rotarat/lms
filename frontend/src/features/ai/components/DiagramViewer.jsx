const DiagramViewer = ({ imageUrl, onDownload }) => {
  if (!imageUrl) return null;

  return (
    <div className="text-center mb-3">
      <img
        src={imageUrl}
        alt="Generated diagram"
        className="img-fluid border"
        style={{ maxHeight: '400px' }}
      />
      <div className="mt-2">
        <button className="btn btn-success" onClick={onDownload}>Download Diagram</button>
      </div>
    </div>
  );
};

export default DiagramViewer;

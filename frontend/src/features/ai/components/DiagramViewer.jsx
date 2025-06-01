const DiagramViewer = ({ imageUrl }) => {
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
        <a href={imageUrl} download>
          <button className="btn btn-success">Download Diagram</button>
        </a>
      </div>
    </div>
  );
};

export default DiagramViewer;

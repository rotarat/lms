const DiagramViewer = ({ action, imageSrc }) => {
  if (!imageSrc) return null;

  return (
    <div className="text-center mb-3">
      <img
        src={imageSrc}
        alt="Diagram"
        className="img-fluid w-100 border"
        style={{ marginBottom: '1rem' }}
      />
      {/* Only show “Download” when we’re in “Generate Diagram” mode */}
      {action === 'diagram' && (
        <div>
          <a href={imageSrc} download="diagram.png">
            <button className="btn btn-success">Download Diagram</button>
          </a>
        </div>
      )}
    </div>
  );
};

export default DiagramViewer;

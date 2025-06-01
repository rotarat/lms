const DiagramExplanation = ({ explanation }) => {
  if (!explanation) return null;

  return (
    <div className="card mt-3">
      <div className="card-header">Explanation</div>
      <div className="card-body">
        <p style={{ whiteSpace: 'pre-wrap' }}>{explanation}</p>
      </div>
    </div>
  );
};

export default DiagramExplanation;

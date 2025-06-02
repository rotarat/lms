import { useState, useEffect } from 'react';
import DiagramForm from '../components/DiagramForm';
import DiagramViewer from '../components/DiagramViewer';
import DiagramExplanation from '../components/DiagramExplanation';
import { useDiagram } from '../hooks/useDiagram';

const DiagramContainer = () => {
  const { submitDiagram } = useDiagram();

  const [imageUrl, setImageUrl] = useState(null);     // backend-generated diagram URL
  const [previewUrl, setPreviewUrl] = useState(null); // preview of uploaded file
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState('');
  const [action, setAction] = useState('diagram');    // "diagram" or "explanation"
  const [loading, setLoading] = useState(false);

  // Clean up object URLs when the component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleSubmit = async (inputText, imageFile, actionType) => {
    setError('');
    setExplanation('');
    setAction(actionType);
    setImageUrl(null);

    // If “Explain Diagram,” create a preview immediately
    if (actionType === 'explanation' && imageFile) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(imageFile));
    }

    setLoading(true);
    try {
      const result = await submitDiagram(inputText, imageFile, actionType);

      if (result.error) {
        setError(result.error);
      } else if (actionType === 'diagram') {
        // In “Generate Diagram” mode, show generated image and explanation
        setImageUrl(result.imageUrl);
        setExplanation(result.explanation || '');
        // Discard any old preview
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
        }
      } else {
        // In “Explain Diagram” mode, only the explanation is returned
        setExplanation(result.explanation || '');
        // Keep previewUrl so the user sees the uploaded image
        setImageUrl(null);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row">
      {/* Left column: DiagramViewer followed by DiagramForm */}
      <div className="col-md-6">
        {/* Pass both action and the appropriate URL (imageUrl vs. previewUrl) */}
        <DiagramViewer
          action={action}
          imageSrc={action === 'diagram' ? imageUrl : previewUrl}
        />

        <DiagramForm
          onFileSelect={(file) => {
            // Immediately create/clear a preview as soon as the user picks a file
            if (file) {
              if (previewUrl) URL.revokeObjectURL(previewUrl);
              setPreviewUrl(URL.createObjectURL(file));
            } else {
              if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
              }
            }
          }}
          onSubmit={handleSubmit}
          loading={loading}
        />
        {error && <div className="alert alert-danger mt-2">{error}</div>}
      </div>

      {/* Right column: Explanation */}
      <div className="col-md-6">
        <DiagramExplanation explanation={explanation} />
      </div>
    </div>
  );
};

export default DiagramContainer;

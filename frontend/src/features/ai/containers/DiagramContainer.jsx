import { useState } from 'react';
import DiagramForm from '../components/DiagramForm';
import DiagramViewer from '../components/DiagramViewer';
import DiagramExplanation from '../components/DiagramExplanation';
import { useDiagram } from '../hooks/useDiagram';

const DiagramContainer = () => {
  const { submitDiagram } = useDiagram();
  const [imageUrl, setImageUrl] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (inputText, imageFile, action) => {
    setError('');
    setImageUrl(null);
    setExplanation('');

    const result = await submitDiagram(inputText, imageFile, action);
    if (result.error) {
      setError(result.error);
      return;
    }

    if (action === 'diagram') {
      // create() returned { imageUrl, explanation }
      setImageUrl(result.imageUrl);
      setExplanation(result.explanation || '');
    } else {
      // action === 'explanation'
      setExplanation(result.explanation);
    }
  };

  return (
    <div className="row">
      <div className="col-md-4">
        {/* Pass `action` through from DiagramForm */}
        <DiagramForm onSubmit={handleSubmit} />
        {error && <div className="alert alert-danger mt-2">{error}</div>}
      </div>
      <div className="col-md-8">
        <DiagramViewer imageUrl={imageUrl} />
        <DiagramExplanation explanation={explanation} />
      </div>
    </div>
  );
};

export default DiagramContainer;

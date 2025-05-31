import { useState } from 'react';
import DiagramForm from '../components/DiagramForm';
import DiagramViewer from '../components/DiagramViewer';
import DiagramExplanation from '../components/DiagramExplanation';
import { useDiagram } from '../hooks/useDiagram';

const DiagramContainer = () => {
  const { submitDiagram, downloadDiagram } = useDiagram();
  const [imageUrl, setImageUrl] = useState(null);
  const [explanation, setExplanation] = useState('');

  const handleSubmit = async (inputText, imageFile) => {
    const result = await submitDiagram(inputText, imageFile);
    if (result?.imageUrl) {
      setImageUrl(result.imageUrl);
      setExplanation(result.explanation || '');
    }
  };

  const handleDownload = () => {
    if (imageUrl) {
      const name = imageUrl.split('/').pop();
      downloadDiagram(name);
    }
  };

  return (
    <div className="row">
      <div className="col-md-4">
        <DiagramForm onSubmit={handleSubmit} />
      </div>
      <div className="col-md-8">
        <DiagramViewer imageUrl={imageUrl} onDownload={handleDownload} />
        <DiagramExplanation explanation={explanation} />
      </div>
    </div>
  );
};

export default DiagramContainer;

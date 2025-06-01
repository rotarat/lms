import { submitDiagram as submit } from '../../../shared/api/ai/diagram';

export const useDiagram = () => {
  const submitDiagram =async (text, imageFile, action) => {
    const formData = new FormData();
    formData.append('text', text);
    formData.append('action', action);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return await submit(formData)
  }

  return { submitDiagram };
};

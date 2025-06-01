import {submitDiagram} from '../../../shared/api/ai'

export const useDiagram = () => {
  const submitDiagram =async (text, imageFile, action) => {
    const formData = new FormData();
    formData.append('text', text);
    formData.append('action', action);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return await submitDiagram(formData)
  }

  return { submitDiagram };
};

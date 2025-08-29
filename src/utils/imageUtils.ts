
export const compressImageToBase64 = (file: File, maxWidth: number = 300, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calcular nuevas dimensiones manteniendo la proporción
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;

      // Configurar el canvas
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Dibujar la imagen redimensionada
      ctx?.drawImage(img, 0, 0, newWidth, newHeight);

      // Convertir a base64 con compresión
      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedBase64);
    };

    img.onerror = () => {
      reject(new Error('Error al cargar la imagen'));
    };

    // Crear URL de la imagen
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    reader.readAsDataURL(file);
  });
};

export const saveImageToLocalStorage = (key: string, base64Image: string): void => {
  try {
    localStorage.setItem(key, base64Image);
  } catch (error) {
    console.error('Error saving image to localStorage:', error);
  }
};

export const getImageFromLocalStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('Error getting image from localStorage:', error);
    return null;
  }
};

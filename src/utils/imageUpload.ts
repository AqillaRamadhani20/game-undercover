/**
 * Image processing utility for player profile pictures
 * Automatically resizes and compresses user-uploaded photos to compact Base64 JPEG
 * to ensure fast rendering and avoid exceeding localStorage quotas.
 */
export async function processImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File yang dipilih harus berupa gambar (JPG/PNG/WEBP).'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIMENSION = 240; // 240x240 px is ideal for crisp avatar circles
        let width = img.width;
        let height = img.height;

        // Crop to square from center
        const size = Math.min(width, height);
        const startX = (width - size) / 2;
        const startY = (height - size) / 2;

        canvas.width = MAX_DIMENSION;
        canvas.height = MAX_DIMENSION;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw cropped center square
        ctx.drawImage(
          img,
          startX,
          startY,
          size,
          size,
          0,
          0,
          MAX_DIMENSION,
          MAX_DIMENSION
        );

        // Convert to lightweight JPEG data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve(dataUrl);
      };

      img.onerror = () => reject(new Error('Gagal memproses gambar.'));
      img.src = event.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
    reader.readAsDataURL(file);
  });
}

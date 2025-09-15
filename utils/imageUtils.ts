/**
 * Converts a hex color string to an RGB object.
 */
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : null;
};

/**
 * Applies a color tint to a base64 image, preserving shadows and highlights.
 * @param base64Image The source image in base64 format.
 * @param hexColor The target color in hex format (e.g., '#FF0000').
 * @returns A promise that resolves with the colorized image as a base64 data URL.
 */
export const colorizeImage = (base64Image: string, hexColor: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const targetRgb = hexToRgb(hexColor);
        if (!targetRgb) {
            return reject(new Error('Invalid hex color format.'));
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return reject(new Error('Could not get canvas context.'));
        }

        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            try {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    
                    // Calculate luminance (grayscale value)
                    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

                    // Apply tint
                    data[i] = targetRgb.r * luminance;
                    data[i + 1] = targetRgb.g * luminance;
                    data[i + 2] = targetRgb.b * luminance;
                    // Keep original alpha: data[i + 3]
                }
                
                ctx.putImageData(imageData, 0, 0);
                resolve(canvas.toDataURL('image/png'));
            } catch (error) {
                // This can fail due to CORS if the image is not properly configured
                reject(new Error(`Failed to process image data: ${error}`));
            }
        };
        img.onerror = (error) => {
            reject(new Error(`Failed to load image: ${error}`));
        };

        img.src = base64Image;
    });
};

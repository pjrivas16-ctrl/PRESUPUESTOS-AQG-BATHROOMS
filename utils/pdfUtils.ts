
/**
 * Processes a base64 data URL image to ensure it is valid and ready for jsPDF.
 * It validates the format, loads the image to check for corruption, and returns
 * details required by jsPDF's addImage function.
 *
 * @param dataUrl The base64 data URL of the image.
 * @returns A promise that resolves with an object containing the image data, format, width, and height.
 * @throws An error if the image format is unsupported or if the image fails to load.
 */
export const processImageForPdf = (
    dataUrl: string
): Promise<{
    imageData: string;
    format: 'PNG' | 'JPEG';
    width: number;
    height: number;
}> => {
    return new Promise((resolve, reject) => {
        if (!dataUrl.startsWith('data:image/')) {
            return reject(new Error('El logo proporcionado no es un archivo de imagen válido.'));
        }

        const mimeTypeMatch = dataUrl.match(/^data:image\/([a-zA-Z+]+);base64,/);
        if (!mimeTypeMatch || !mimeTypeMatch[1]) {
            return reject(new Error('No se pudo determinar el formato del logo. Asegúrate de que sea PNG o JPG.'));
        }

        const mimeType = mimeTypeMatch[1].toUpperCase();
        let format: 'PNG' | 'JPEG';

        if (mimeType === 'PNG') {
            format = 'PNG';
        } else if (mimeType === 'JPEG' || mimeType === 'JPG') {
            format = 'JPEG';
        } else {
            return reject(new Error(`Formato de logo no soportado: ${mimeType}. Por favor, usa un archivo PNG o JPEG.`));
        }

        const img = new Image();
        img.onload = () => {
            resolve({
                imageData: dataUrl,
                format,
                width: img.naturalWidth,
                height: img.naturalHeight,
            });
        };
        img.onerror = () => {
            reject(new Error('No se pudo cargar la imagen del logo. El archivo podría estar dañado o en un formato incorrecto.'));
        };

        img.src = dataUrl;
    });
};
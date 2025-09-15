import React, { useRef, useState } from 'react';

interface LogoUploaderProps {
    logo?: string | null;
    onLogoChange: (logo: string | null) => void;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ logo, onLogoChange }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setError(null);
        
        // Basic validation
        if (!file.type.startsWith('image/')) {
            setError('Por favor, selecciona un archivo de imagen.');
            return;
        }
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            setError('El archivo es demasiado grande (máx 2MB).');
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            onLogoChange(reader.result as string);
        };
        reader.onerror = () => {
            setError('No se pudo leer el archivo.');
        };
        reader.readAsDataURL(file);

        // Reset input value to allow re-uploading the same file
        event.target.value = '';
    };

    const handleRemoveLogo = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); // Prevent triggering the file input
        onLogoChange(null);
    };

    return (
        <div className="mb-6">
            <label className="text-sm text-slate-300 mb-2 block font-medium">
                Tu Logotipo (para PDFs)
            </label>
            <div 
                className="relative group w-full h-20 bg-slate-700/50 rounded-lg border-2 border-dashed border-slate-600 flex items-center justify-center cursor-pointer hover:border-slate-400 transition-colors"
                onClick={() => inputRef.current?.click()}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && inputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Cargar logotipo"
            >
                <input 
                    type="file" 
                    ref={inputRef} 
                    hidden 
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg"
                />
                {logo ? (
                    <>
                        <img 
                            src={logo} 
                            alt="Logotipo del cliente"
                            className="max-h-full max-w-full object-contain p-2" 
                        />
                        <button 
                            onClick={handleRemoveLogo}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 focus:opacity-100"
                            aria-label="Eliminar logotipo"
                        >
                            <span className="text-xs font-bold leading-none">&times;</span>
                        </button>
                    </>
                ) : (
                    <div className="text-center">
                        <span className="text-slate-400 text-sm">Sube tu logotipo</span>
                         <span className="text-slate-500 text-xs block">Max 2MB</span>
                    </div>
                )}
            </div>
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default LogoUploader;
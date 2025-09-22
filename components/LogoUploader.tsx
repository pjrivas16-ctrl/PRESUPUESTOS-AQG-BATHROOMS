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

        event.target.value = '';
    };

    const handleRemoveLogo = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation(); 
        onLogoChange(null);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                Logotipo de la Empresa
            </label>
            <div 
                className="relative group w-full h-24 bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-teal-400 transition-colors"
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
                    <div className="text-center text-slate-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <span className="text-sm mt-1 block">Sube tu logotipo</span>
                         <span className="text-xs block">PNG o JPG (Máx 2MB)</span>
                    </div>
                )}
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};

export default LogoUploader;
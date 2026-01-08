import React, { useState } from 'react';

interface GatewayPageProps {
    onAuthorized: () => void;
}

const GatewayPage: React.FC<GatewayPageProps> = ({ onAuthorized }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'AQGforever') {
            onAuthorized();
        } else {
            setError(true);
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 p-4 font-sans">
            <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-slate-200 animate-fade-in text-center">
                <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-teal-500 text-white rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                        <span className="text-4xl font-black">AQG</span>
                    </div>
                </div>
                
                <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-2">
                    Acceso Exclusivo
                </h1>
                <p className="text-slate-500 mb-8 text-sm">
                    Esta es una herramienta privada para la Red Comercial de AQG Bathrooms. Por favor, introduce la clave de acceso general.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (error) setError(false);
                            }}
                            placeholder="Introduce la contraseña"
                            className={`w-full p-4 bg-slate-50 border-2 rounded-xl text-center font-bold tracking-widest focus:outline-none focus:ring-2 transition-all ${
                                error 
                                    ? 'border-red-300 focus:ring-red-200 text-red-600 animate-shake' 
                                    : 'border-slate-200 focus:ring-teal-200 focus:border-teal-500'
                            }`}
                            autoFocus
                        />
                        {error && (
                            <p className="mt-2 text-xs font-bold text-red-500">
                                Contraseña incorrecta. Inténtalo de nuevo.
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full px-8 py-4 font-bold text-white bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                        Entrar a la Plataforma
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                        AQG Bathrooms &copy; {new Date().getFullYear()} - Área Comercial
                    </p>
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-5px); }
                    75% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.2s ease-in-out 0s 2;
                }
            `}} />
        </div>
    );
};

export default GatewayPage;
import React, { useState } from 'react';

interface LoginPageProps {
    onLogin: (email: string, password: string) => Promise<void>;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Por favor, completa todos los campos.');
            return;
        }

        setIsLoading(true);
        try {
            await onLogin(email, password);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ha ocurrido un error inesperado.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl animate-fade-in">
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">Acceso Privado</h2>
            <p className="text-center text-slate-500 mb-8">Introduce tus credenciales para acceder a tu espacio comercial de AQG</p>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
            <form onSubmit={handleLoginSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-teal-500 transition" required />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">Contraseña</label>
                     <div className="relative">
                        <input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 pr-10 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-teal-500 transition" required />
                         <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-slate-700 focus:outline-none" aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.953 9.953 0 00-4.512 1.074l-1.78-1.781zM10 12a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /><path d="M10 17a9.953 9.953 0 01-4.512-1.074l-1.78-1.781a1 1 0 011.414-1.414l1.697 1.697A6.02 6.02 0 0110 15a6.002 6.002 0 01-3.203-1.032 1 1 0 01.13-1.41L4.835 9.42a1 1 0 011.414-1.414l1.414 1.414a2.01 2.01 0 012.828 0l.114.114a1 1 0 01-1.414 1.414l-.114-.114a.01.01 0 00-.014 0l-2.122 2.122a1 1 0 01-1.414 0z" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                            )}
                        </button>
                    </div>
                </div>

                <div>
                    <button type="submit" disabled={isLoading} className="w-full mt-2 px-8 py-3 font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:bg-teal-400 transition-colors">
                        {isLoading ? 'Accediendo...' : 'Acceder'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginPage;
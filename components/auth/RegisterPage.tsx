import React, { useState } from 'react';
import type { StoredUser } from '../../types';

interface RegisterPageProps {
    onRegister: (user: Omit<StoredUser, 'logo'>) => Promise<void>;
    onNavigateToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister, onNavigateToLogin }) => {
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [preparedBy, setPreparedBy] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!companyName || !email || !password || !confirmPassword) {
            setError('Por favor, completa todos los campos obligatorios.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        setIsLoading(true);
        try {
            await onRegister({
                companyName,
                email,
                password,
                preparedBy: preparedBy || undefined,
            });
            // On success, parent component will handle login and view change
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ha ocurrido un error inesperado durante el registro.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleRegister = () => {
        // This is a placeholder for future implementation.
        alert("La opción de registrarse con Google estará disponible próximamente.");
    };

    return (
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl animate-fade-in">
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">Crear una Cuenta</h2>
            <p className="text-center text-slate-500 mb-8">Regístrate para empezar a crear presupuestos.</p>
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 mb-2">Nombre de la Empresa <span className="text-red-500">*</span></label>
                    <input id="companyName" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm" required />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">Email <span className="text-red-500">*</span></label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm" required />
                </div>
                <div>
                    <label htmlFor="preparedBy" className="block text-sm font-medium text-slate-700 mb-2">Persona de Contacto (Opcional)</label>
                    <input id="preparedBy" type="text" value={preparedBy} onChange={(e) => setPreparedBy(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm" />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">Contraseña <span className="text-red-500">*</span></label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm" required />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">Confirmar Contraseña <span className="text-red-500">*</span></label>
                    <input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm" required />
                </div>

                <div className="pt-4">
                    <button type="submit" disabled={isLoading} className="w-full px-8 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors">
                        {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                    </button>
                </div>
            </form>
             <div className="relative my-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">o continuar con</span>
                </div>
            </div>
            <div>
                 <button onClick={handleGoogleRegister} type="button" className="w-full flex justify-center items-center gap-3 px-8 py-3 font-semibold text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors">
                     <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.222 0-9.618-3.317-11.28-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.028 36.313 44 31.147 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>
                    Registrarse con Google
                </button>
            </div>
            <p className="text-center text-sm text-slate-500 mt-8">
                ¿Ya tienes una cuenta?{' '}
                <button onClick={onNavigateToLogin} className="font-semibold text-indigo-600 hover:underline">
                    Iniciar Sesión
                </button>
            </p>
        </div>
    );
};

export default RegisterPage;

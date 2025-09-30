import React, { useState } from 'react';
import type { StoredUser } from '../../types';

interface RegisterPageProps {
    onRegister: (user: Omit<StoredUser, 'promotion'>) => Promise<void>;
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
            // On success, parent component (App.tsx) will handle login and view change
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
                    <label htmlFor="preparedBy" className="block text-sm font-medium text-slate-700 mb-2">Tu Nombre (Opcional)</label>
                    <input id="preparedBy" type="text" value={preparedBy} onChange={(e) => setPreparedBy(e.target.value)} placeholder="Aparecerá en los PDFs" className="w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm" />
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
                    <button type="submit" disabled={isLoading} className="w-full px-8 py-3 font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:bg-teal-400 transition-colors">
                        {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                    </button>
                </div>
            </form>
            <p className="text-center text-sm text-slate-500 mt-8">
                ¿Ya tienes una cuenta?{' '}
                <button onClick={onNavigateToLogin} className="font-semibold text-teal-600 hover:underline">
                    Iniciar Sesión
                </button>
            </p>
        </div>
    );
};

export default RegisterPage;

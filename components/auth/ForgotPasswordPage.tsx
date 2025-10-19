import React, { useState } from 'react';

interface ForgotPasswordPageProps {
    onPasswordUpdated: () => void;
    onNavigateToLogin: () => void;
    onUpdatePassword: (email: string, newPassword: string) => Promise<void>;
    onCheckUserExists: (email: string) => Promise<boolean>;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onPasswordUpdated, onNavigateToLogin, onUpdatePassword, onCheckUserExists }) => {
    const [step, setStep] = useState(1); // 1 for email, 2 for new password
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const userExists = await onCheckUserExists(email);
        
        setIsLoading(false);
        if (userExists) {
            setSuccess('Email verificado. Por favor, introduce tu nueva contraseña.');
            setStep(2);
        } else {
            setError('No existe ninguna cuenta registrada con este email.');
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setIsLoading(true);
        try {
            await onUpdatePassword(email, password);
            setSuccess('¡Contraseña actualizada con éxito! Ya puedes iniciar sesión.');
            setTimeout(() => {
                onPasswordUpdated();
            }, 2000);
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
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">Recuperar Contraseña</h2>
            {step === 1 ? (
                <>
                    <p className="text-center text-slate-500 mb-8">Introduce tu email para restablecer tu contraseña.</p>
                    {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
                    <form onSubmit={handleEmailSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email-forgot" className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                            <input id="email-forgot" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-teal-500 transition" required />
                        </div>
                        <div>
                            <button type="submit" disabled={isLoading} className="w-full mt-2 px-8 py-3 font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:bg-teal-400 transition-colors">
                                {isLoading ? 'Verificando...' : 'Verificar Email'}
                            </button>
                        </div>
                    </form>
                </>
            ) : (
                 <>
                    <p className="text-center text-slate-500 mb-8">Establece una nueva contraseña para tu cuenta.</p>
                    {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4 text-sm">{error}</p>}
                    {success && !error && <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4 text-sm">{success}</p>}
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                         <div>
                            <label htmlFor="password-forgot" className="block text-sm font-medium text-slate-700 mb-2">Nueva Contraseña</label>
                            <input id="password-forgot" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm" required />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword-forgot" className="block text-sm font-medium text-slate-700 mb-2">Confirmar Nueva Contraseña</label>
                            <input id="confirmPassword-forgot" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-3 bg-white border border-slate-300 rounded-md shadow-sm" required />
                        </div>
                        <div className="pt-2">
                            <button type="submit" disabled={isLoading || !!success} className="w-full px-8 py-3 font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-700 disabled:bg-teal-400 transition-colors">
                                {isLoading ? 'Actualizando...' : 'Cambiar Contraseña'}
                            </button>
                        </div>
                    </form>
                 </>
            )}
             <p className="text-center text-sm text-slate-500 mt-8">
                ¿Recuerdas tu contraseña?{' '}
                <button onClick={onNavigateToLogin} className="font-semibold text-teal-600 hover:underline">
                    Iniciar Sesión
                </button>
            </p>
        </div>
    );
};

export default ForgotPasswordPage;
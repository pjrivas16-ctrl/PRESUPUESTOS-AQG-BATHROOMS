import React, { useState } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import type { StoredUser } from '../../types';
import { updateUser, findUserByEmail } from '../../utils/authUtils';

interface AuthPageProps {
    onLogin: (email: string, password: string) => Promise<void>;
    onRegister: (user: Omit<StoredUser, 'promotion'>) => Promise<void>;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister }) => {
    const [view, setView] = useState<'login' | 'register' | 'forgotPassword'>('login');

    const handleUpdatePassword = (email: string, newPassword: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            const updatedUser = updateUser(email, { password: newPassword });
            if (updatedUser) {
                resolve();
            } else {
                reject(new Error('No se pudo actualizar la contraseña.'));
            }
        });
    };
    
    const handleCheckUserExists = (email: string): Promise<boolean> => {
        return new Promise((resolve) => {
            setTimeout(() => { // Simulate network delay
                const user = findUserByEmail(email);
                resolve(!!user);
            }, 500);
        });
    };

    switch (view) {
        case 'register':
            return <RegisterPage onRegister={onRegister} onNavigateToLogin={() => setView('login')} />;
        case 'forgotPassword':
            return <ForgotPasswordPage 
                onPasswordUpdated={() => setView('login')} 
                onNavigateToLogin={() => setView('login')} 
                onUpdatePassword={handleUpdatePassword}
                onCheckUserExists={handleCheckUserExists}
            />;
        case 'login':
        default:
            return <LoginPage onLogin={onLogin} onNavigateToRegister={() => setView('register')} onNavigateToForgotPassword={() => setView('forgotPassword')} />;
    }
};

export default AuthPage;
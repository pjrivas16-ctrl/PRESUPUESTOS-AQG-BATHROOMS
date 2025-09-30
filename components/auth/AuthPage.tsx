import React, { useState } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ForgotPasswordPage from './ForgotPasswordPage';
import type { StoredUser } from '../../types';

interface AuthPageProps {
    onLogin: (email: string, password: string) => Promise<void>;
    onRegister: (user: Omit<StoredUser, 'promotion'>) => Promise<void>;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister }) => {
    const [view, setView] = useState<'login' | 'register' | 'forgotPassword'>('login');

    const handleUpdatePassword = (email: string, newPassword: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            const users = JSON.parse(localStorage.getItem('users') || '[]') as StoredUser[];
            const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

            if (userIndex > -1) {
                users[userIndex].password = newPassword;
                localStorage.setItem('users', JSON.stringify(users));
                resolve();
            } else {
                reject(new Error('No se ha encontrado el usuario.'));
            }
        });
    };

    switch (view) {
        case 'register':
            return <RegisterPage onRegister={onRegister} onNavigateToLogin={() => setView('login')} />;
        case 'forgotPassword':
            return <ForgotPasswordPage onPasswordUpdated={() => setView('login')} onNavigateToLogin={() => setView('login')} onUpdatePassword={handleUpdatePassword} />;
        case 'login':
        default:
            return <LoginPage onLogin={onLogin} onNavigateToRegister={() => setView('register')} onNavigateToForgotPassword={() => setView('forgotPassword')} />;
    }
};

export default AuthPage;
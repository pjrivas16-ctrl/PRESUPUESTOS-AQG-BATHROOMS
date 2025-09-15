import React, { useState } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import type { StoredUser } from '../../types';

interface AuthPageProps {
    onLogin: (email: string, password: string, rememberMe: boolean) => Promise<void>;
    onRegister: (user: Omit<StoredUser, 'logo'>) => Promise<void>;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister }) => {
    const [view, setView] = useState<'login' | 'register'>('login');

    if (view === 'register') {
        return <RegisterPage onRegister={onRegister} onNavigateToLogin={() => setView('login')} />;
    }

    return <LoginPage onLogin={onLogin} onNavigateToRegister={() => setView('register')} />;
};

export default AuthPage;

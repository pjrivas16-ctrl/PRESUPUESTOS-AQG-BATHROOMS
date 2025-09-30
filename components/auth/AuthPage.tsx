import React, { useState } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import type { StoredUser } from '../../types';

interface AuthPageProps {
    onLogin: (email: string, password: string) => Promise<void>;
    onRegister: (user: Omit<StoredUser, 'promotion'>) => Promise<void>;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister }) => {
    const [isRegistering, setIsRegistering] = useState(false);

    if (isRegistering) {
        return <RegisterPage onRegister={onRegister} onNavigateToLogin={() => setIsRegistering(false)} />;
    }

    return <LoginPage onLogin={onLogin} onNavigateToRegister={() => setIsRegistering(true)} />;
};

export default AuthPage;

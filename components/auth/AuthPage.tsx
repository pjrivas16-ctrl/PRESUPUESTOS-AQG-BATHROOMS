import React from 'react';
import LoginPage from './LoginPage';
import type { StoredUser } from '../../types';

interface AuthPageProps {
    onLogin: (email: string, password: string) => Promise<void>;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
    return <LoginPage onLogin={onLogin} />;
};

export default AuthPage;
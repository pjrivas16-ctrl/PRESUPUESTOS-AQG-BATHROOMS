import type { StoredUser } from '../types';

const USERS_STORAGE_KEY = 'users';

export const getUsers = (): StoredUser[] => {
    try {
        const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
        return usersJson ? JSON.parse(usersJson) : [];
    } catch (e) {
        console.error("Failed to parse users from localStorage", e);
        return [];
    }
};

export const saveUsers = (users: StoredUser[]): boolean => {
    try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        return true;
    } catch (e) {
        console.error("Failed to save users to localStorage", e);
        return false;
    }
};

export const findUserByEmail = (email: string): StoredUser | undefined => {
    const users = getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const addUser = (newUser: Omit<StoredUser, 'promotion'>): StoredUser => {
    const users = getUsers();
    const lowercasedEmail = newUser.email.toLowerCase();
    
    if (users.some(u => u.email.toLowerCase() === lowercasedEmail)) {
        throw new Error('Ya existe una cuenta registrada con este email.');
    }

    const userToStore: StoredUser = { ...newUser, email: lowercasedEmail };
    const updatedUsers = [...users, userToStore];
    const success = saveUsers(updatedUsers);
    if (!success) {
        throw new Error('No se pudo guardar el nuevo usuario.');
    }
    return userToStore;
};

export const updateUser = (email: string, updates: Partial<Omit<StoredUser, 'email'>>): StoredUser | undefined => {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

    if (userIndex === -1) {
        console.error(`User with email ${email} not found for update.`);
        return undefined;
    }
    
    const updatedUser = { ...users[userIndex], ...updates };
    
    const updatedUsers = [...users];
    updatedUsers[userIndex] = updatedUser;

    const success = saveUsers(updatedUsers);
    if (!success) {
        return undefined;
    }
    return updatedUser;
};

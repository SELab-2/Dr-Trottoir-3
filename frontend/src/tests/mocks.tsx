import {jest} from '@jest/globals';

export const mockSetWindowLocation = (url: string) => {
    Object.defineProperty(window, 'location', {
        value: {
            href: url,
        },
        writable: true,
    });
};

export const mockSignIn = jest.fn((provider, credentials) => {
    if (credentials.username === 'admin' && credentials.password === 'password') {
        // In case of success, redirect to home page
        return new Promise<void>(() => mockSetWindowLocation('/'));
    } else {
        // Otherwise stay on login page
        return new Promise<void>(() => mockSetWindowLocation('/login'));
    }
});


jest.mock('next-auth/react', () => ({
    useSession: jest.fn(),
    signIn: mockSignIn,
}));


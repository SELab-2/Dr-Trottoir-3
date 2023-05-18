import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';
import {mockSetWindowLocation, mockSignIn} from './mocks';

import {describe, expect, it, jest, beforeEach} from '@jest/globals';
import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import LoginPageElement from '@/components/elements/LoginPageElement/LoginPageElement';
import userEvent from '@testing-library/user-event';

jest.mock('next-auth/react', () => ({
    useSession: jest.fn(),
    signIn: mockSignIn,
}));

describe('Login Page tests', () => {
    beforeEach(()=> {
        mockSetWindowLocation('/login');
    });

    it('should call signIn function when the login button is clicked', () => {
        render(<LoginPageElement />);

        // Get the login button element
        const loginButton = screen.getByText('login');

        // Simulate a click event
        fireEvent.click(loginButton);

        // Assert that the signIn function has been called
        expect(mockSignIn).toHaveBeenCalled();
    });

    it('should accept when using correct credentials', async () => {
        const user = userEvent.setup();
        render(<LoginPageElement />);
        expect(window.location.href).toBe('/login');

        const loginButton = screen.getByText('login');
        const usernameInput = screen.getByLabelText('email');
        const passwordInput = screen.getByLabelText('password');

        expect(loginButton).toBeInTheDocument();
        expect(usernameInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();

        await user.type(usernameInput, 'admin');
        await user.type(passwordInput, 'password');
        expect(usernameInput.value).toBe('admin');
        expect(passwordInput.value).toBe('password');

        fireEvent.click(loginButton);

        expect(mockSignIn).toHaveBeenCalled();
        await waitFor(() => {
            expect(window.location.href).toBe('/');
        });
    });

    it('should stay on page when using incorrect credentials', async () => {
        const user = userEvent.setup();
        render(<LoginPageElement />);
        expect(window.location.href).toBe('/login');

        const loginButton = screen.getByText('login');
        const usernameInput = screen.getByLabelText('email');
        const passwordInput = screen.getByLabelText('password');

        await user.type(usernameInput, 'admin');
        await user.type(passwordInput, 'wrongPassword');
        expect(usernameInput.value).toBe('admin');
        expect(passwordInput.value).toBe('wrongPassword');

        fireEvent.click(loginButton);

        expect(mockSignIn).toHaveBeenCalled();
        await waitFor(() => {
            expect(window.location.href).toBe('/login');
        });
    });
});

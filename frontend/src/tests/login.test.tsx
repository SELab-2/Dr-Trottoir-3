import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

import {describe, expect, it} from '@jest/globals';
import {fireEvent, render} from '@testing-library/react';
import {beforeEach} from '@jest/globals';
import LoginPageElement from '@/components/elements/LoginPageElement/LoginPageElement';
import {enableFetchMocks} from 'jest-fetch-mock';

require('jest-fetch-mock').enableMocks();

describe('Login test', () => {
    beforeEach(()=> {
        enableFetchMocks();
    });
    it('Test login with empty fields', async () => {
        const {findByText} = render(<LoginPageElement/>);
        let loginButton = await findByText('login');
        expect(loginButton).toBeInTheDocument();

        fireEvent(loginButton, new MouseEvent('click'));

        loginButton = await findByText('login'); // Notice the 'await'
        expect(loginButton).toBeInTheDocument();
    });
});

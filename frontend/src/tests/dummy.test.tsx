import {render} from '@testing-library/react';
import {describe, expect, it, beforeAll, jest} from '@jest/globals';
import '@testing-library/jest-dom';
import LoginPageElement from '@/components/elements/LoginPageElement/LoginPageElement';
import * as nextRouter from 'next/router';
/*
For testing we make use of Jest, with the react-test-renderer plugin. The structure of a Jest test unit
is as follows:

describe('test collection name', () => {

    [useful functions...]

    it('unit test name, () => {
        [statements]
        expect([functionCall]).toBe([result])
    })
})

'describe' groups several logical tests together and 'it' represents a single unit test within that group.
Jest allows per describe unit to also define several functions to be called before or after each test. Examples
are: beforeAll, afterEach. The documentation can be found at:
- https://jestjs.io/docs/getting-started
- https://testing-library.com/docs/guide-disappearance/

Warning: when using 'render', make sure to use the render from '@testing-library/react', and not from other
libraries.
 */

describe('Dummy test', () => {
    function sum(a: number, b: number) {
        return a + b;
    }

    it('Dummy test using a custom sum function', () => {
        expect(sum(1, 2)).toBe(3);
    });
});

describe('Dummy async test', () => {
    function sleep(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function calculationWithAsyncExample(x: number): Promise<number> {
        await sleep(1000);
        return x + 1;
    }

    it('Dummy test with promises', async () => {
        calculationWithAsyncExample(1).then((data) => {
            expect(data).toBe(2);
        }
        );
    });
});

describe('Dummy login test', () => {
    beforeAll(() => {
        // @ts-ignore
        // eslint-disable-next-line no-import-assign
        nextRouter.useRouter = jest.fn();
    });
    it('Tests whether the login page has a login button', async ()=> {
        const {findByText} = render(<LoginPageElement/>);
        const loginButton = await findByText('login'); // Notice the 'await'
        expect(loginButton).toBeInTheDocument();
    });
});

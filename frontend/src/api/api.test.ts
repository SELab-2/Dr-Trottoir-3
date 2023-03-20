import {describe, expect, test} from '@jest/globals';

/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 * **/
function sum(a: number, b: number): number {
    return a + b;
}

describe('sum module', () => {
    test('adds 1 + 2 to equal 3', () => {
        expect(sum(1, 2)).toBe(3);
    });
});

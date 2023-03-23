import {describe, expect, test, beforeEach, afterEach} from '@jest/globals';
import {createServer, Model, Server} from 'miragejs';
import {Api, get} from './api';
import {ScheduleAssignment} from './models';

let server: Server;

beforeEach(() => {
    server = createServer({environment: 'test'});
});

afterEach(() => {
    server.shutdown();
});

describe('sum module', () => {
    test('adds 1 + 2 to equal 3', () => {
        expect(get<ScheduleAssignment[]>(Api.ScheduleAssignments)).toBe(3);
    });
});

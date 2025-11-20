import nock from 'nock';

import { Client4 } from 'mattermost-redux/client';

import {
    login,
    loginById,
} from 'actions/views/login';
import configureStore from 'store';

import TestHelper from 'packages/mattermost-redux/test/test_helper';

describe('actions/views/login', () => {
    describe('login', () => {
        test('should return successful when login is successful', async () => {
            // Arrange
            const store = configureStore();

            TestHelper.initBasic(Client4);
            nock(Client4.getBaseRoute()).
                post('/users/login').
                reply(200, { ...TestHelper.basicUser });

            // Act
            const result = await store.dispatch(login('user', 'password', ''));

            // Assert
            expect(result).toEqual({ data: true });
        });

        test('should return error when when login fails', async () => {
            // Arrange
            const store = configureStore();

            TestHelper.initBasic(Client4);
            nock(Client4.getBaseRoute()).
                post('/users/login').
                reply(500, {});

            // Act
            const result = await store.dispatch(login('user', 'password', ''));

            // Assert
            expect(Object.keys(result)[0]).toEqual('error');
        });
    });

    describe('loginById', () => {
        test('should return successful when login is successful', async () => {
            // Arrange
            const store = configureStore();

            TestHelper.initBasic(Client4);
            nock(Client4.getBaseRoute()).
                post('/users/login').
                reply(200, { ...TestHelper.basicUser });

            // Act
            const result = await store.dispatch(loginById('userId', 'password'));

            // Assert
            expect(result).toEqual({ data: true });
        });

        test('should return error when when login fails', async () => {
            // Arrange
            const store = configureStore();

            TestHelper.initBasic(Client4);
            nock(Client4.getBaseRoute()).
                post('/users/login').
                reply(500, {});

            // Act
            const result = await store.dispatch(loginById('userId', 'password'));

            // Assert
            expect(Object.keys(result)[0]).toEqual('error');
        });
    });
});

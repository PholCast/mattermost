import { GeneralTypes, UserTypes, ChannelTypes } from 'mattermost-redux/action_types';

import channelReducer from 'reducers/views/channel';

import { ActionTypes } from 'utils/constants';

describe('Reducers.channel', () => {
    const initialState = {
        postVisibility: {},
        lastChannelViewTime: {},
        loadingPosts: {},
        focusedPostId: '',
        mobileView: false,
        lastUnreadChannel: null,
        lastGetPosts: {},
        toastStatus: false,
        channelPrefetchStatus: {},
    };

    test('Initial state', () => {
        // Act
        const nextState = channelReducer(
            {},
            {},
        );

        // Assert
        expect(nextState).toEqual(initialState);
    });

    describe('channelPrefetchStatus', () => {
        test('should change status on dispatch of PREFETCH_POSTS_FOR_CHANNEL', () => {
            // Act
            const nextState = channelReducer(
                initialState,
                {
                    type: ActionTypes.PREFETCH_POSTS_FOR_CHANNEL,
                    channelId: 'channelId',
                    status: 'success',
                },
            );

            // Assert
            expect(nextState).toEqual({
                ...initialState,
                channelPrefetchStatus: {
                    channelId: 'success',
                },
            });
        });

        test('should change clear channelPrefetchStatus on dispatch of WEBSOCKET_FAILURE', () => {
            // Arrange
            const modifiedState = {
                ...initialState,
                channelPrefetchStatus: {
                    channelId: 'success',
                },
            };

            // Act
            const nextState = channelReducer(
                modifiedState,
                {
                    type: GeneralTypes.WEBSOCKET_FAILURE,
                },
            );

            // Assert
            expect(nextState).toEqual(initialState);
        });

        test('should change clear channelPrefetchStatus on dispatch of WEBSOCKET_CLOSED', () => {
            // Arrange
            const modifiedState = {
                ...initialState,
                channelPrefetchStatus: {
                    channelId: 'success',
                },
            };

            // Act
            const nextState = channelReducer(
                modifiedState,
                {
                    type: GeneralTypes.WEBSOCKET_CLOSED,
                },
            );

            // Assert
            expect(nextState).toEqual(initialState);
        });

        test('should change clear channelPrefetchStatus on dispatch of LOGOUT_SUCCESS', () => {
            // Arrange
            const modifiedState = {
                ...initialState,
                channelPrefetchStatus: {
                    channelId: 'success',
                },
            };

            // Act
            const nextState = channelReducer(
                modifiedState,
                {
                    type: UserTypes.LOGOUT_SUCCESS,
                },
            );

            // Assert
            expect(nextState).toEqual(initialState);
        });

        test('should clear lastUnreadChannel on dispatch of LEAVE_CHANNEL', () => {
            // Arrange
            const modifiedState = {
                ...initialState,
                lastUnreadChannel: {
                    channelId: '1',
                    hadMentions: true,
                },
            };

            // Act
            const nextState = channelReducer(
                modifiedState,
                {
                    type: ChannelTypes.LEAVE_CHANNEL,
                    data: { id: '1' },
                },
            );

            // Assert
            expect(nextState).toEqual(initialState);
        });

        test('should not clear lastUnreadChannel on dispatch of LEAVE_CHANNEL on another channel', () => {
            // Arrange
            const modifiedState = {
                ...initialState,
                lastUnreadChannel: {
                    channelId: '1',
                    hadMentions: true,
                },
            };

            // Act
            const nextState = channelReducer(
                modifiedState,
                {
                    type: ChannelTypes.LEAVE_CHANNEL,
                    data: { id: '2' },
                },
            );

            // Assert
            expect(nextState).toEqual(modifiedState);
        });
    });
});

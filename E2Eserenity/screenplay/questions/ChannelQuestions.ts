import { Text } from '@serenity-js/web';
import { ChannelElements } from '../ui/ChannelElements';

export const ChannelQuestions = {
    currentChannelTitle: () =>
        Text.of(ChannelElements.channelHeaderTitle())
            .describedAs('current channel title')
};

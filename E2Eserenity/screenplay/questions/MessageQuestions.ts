import { Text } from '@serenity-js/web';
import { ChatElements } from '../ui/ChatElements';

export const MessageQuestions = {
    lastMessageText: () =>
        Text.of(ChatElements.postList()) // Simplified: checking if list contains text, or getting full text
            .describedAs('text of the post list')
};

import { Task } from '@serenity-js/core';
import { Click, Enter, Wait, isVisible } from '@serenity-js/web';
import { ChatElements } from '../ui/ChatElements';

export const SendMessage = {
    withText: (text: string) =>
        Task.where(`#actor sends message: ${text}`,
            Wait.until(ChatElements.postTextbox(), isVisible()),
            Enter.theValue(text).into(ChatElements.postTextbox()),
            Click.on(ChatElements.sendMessageButton())
        )
};

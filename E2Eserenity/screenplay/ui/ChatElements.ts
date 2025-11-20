import { PageElement, By } from '@serenity-js/web';

export class ChatElements {
    static postTextbox = () =>
        PageElement.located(By.css('#post_textbox'))
            .describedAs('message input box');

    static sendMessageButton = () =>
        PageElement.located(By.css('[data-testid="SendMessageButton"]'))
            .describedAs('send message button');

    static postList = () =>
        PageElement.located(By.css('#postListContent'))
            .describedAs('post list container');

    static lastPostMessage = () =>
        PageElement.located(By.css('.post-message__text')) // This might need refinement to get the *last* one specifically
            .describedAs('last post message text');
}

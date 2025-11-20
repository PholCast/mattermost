import { PageElement, By } from '@serenity-js/web';

export class ChannelElements {
    static addChannelsButton = () =>
        PageElement.located(By.css('#addChannelsCta'))
            .describedAs('add channels button');

    static createNewChannelMenuItem = () =>
        PageElement.located(By.css('#showNewChannel-button'))
            .describedAs('create new channel menu item');

    static nameInput = () =>
        PageElement.located(By.css('#input_new-channel-modal-name'))
            .describedAs('channel name input');

    static purposeInput = () =>
        PageElement.located(By.css('#new-channel-modal-purpose'))
            .describedAs('channel purpose input');

    static publicSelector = () =>
        PageElement.located(By.css('#public-private-selector-button-O'))
            .describedAs('public channel selector');

    static privateSelector = () =>
        PageElement.located(By.css('#public-private-selector-button-P'))
            .describedAs('private channel selector');

    static createButton = () =>
        PageElement.located(By.css('.GenericModal__button.btn-primary'))
            .describedAs('create channel button');

    static channelHeaderTitle = () =>
        PageElement.located(By.css('#channelHeaderTitle'))
            .describedAs('channel header title');
}

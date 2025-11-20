import { Task, Duration } from '@serenity-js/core';
import { Click, Enter, Wait, isVisible } from '@serenity-js/web';
import { ChannelElements } from '../ui/ChannelElements';

export const CreateChannel = {
    publicly: (name: string, purpose: string) =>
        Task.where(`#actor creates public channel ${name}`,
            Click.on(ChannelElements.addChannelsButton()),
            Wait.until(ChannelElements.createNewChannelMenuItem(), isVisible()),
            Click.on(ChannelElements.createNewChannelMenuItem()),
            Wait.until(ChannelElements.nameInput(), isVisible()),
            Enter.theValue(name).into(ChannelElements.nameInput()),
            Enter.theValue(purpose).into(ChannelElements.purposeInput()),
            Click.on(ChannelElements.publicSelector()),
            Click.on(ChannelElements.createButton()),
            // Wait for modal to disappear or channel to load
            Wait.until(ChannelElements.channelHeaderTitle(), isVisible())
        )
};

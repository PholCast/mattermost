import { PageElement, By } from '@serenity-js/web';

export class Navigation {
        static teamSidebar = () =>
                PageElement.located(By.css('.team-sidebar'))
                        .describedAs('team sidebar');

        static channelSidebar = () =>
                PageElement.located(By.css('#sidebar-left'))
                        .describedAs('channel sidebar');

        static townSquareLink = () =>
                PageElement.located(By.css('a[href*="town-square"]'))
                        .describedAs('Town Square channel link');

        static mainMenuButton = () =>
                PageElement.located(By.css('#sidebarHeaderDropdownButton'))
                        .describedAs('main menu button');
}
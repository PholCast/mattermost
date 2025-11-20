import { PageElement, By } from '@serenity-js/web';

export class SignUpForm {
        static emailInput = () =>
                PageElement.located(By.css('#input_email'))
                        .describedAs('email input field');

        static usernameInput = () =>
                PageElement.located(By.css('#input_name'))
                        .describedAs('username input field');

        static passwordInput = () =>
                PageElement.located(By.css('#input_password-input'))
                        .describedAs('password input field');

        static submitButton = () =>
                PageElement.located(By.css('#saveSetting'))
                        .describedAs('create account button');

        static loginLink = () =>
                PageElement.located(By.css('a[href*="login"]'))
                        .describedAs('login link');
}
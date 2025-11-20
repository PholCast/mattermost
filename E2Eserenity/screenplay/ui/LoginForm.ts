import { PageElement, By } from '@serenity-js/web';

export class LoginForm {
        static emailInput = () =>
                PageElement.located(By.css('#input_loginId'))
                        .describedAs('email or username input field');

        static passwordInput = () =>
                PageElement.located(By.css('#input_password-input'))
                        .describedAs('password input field');

        static submitButton = () =>
                PageElement.located(By.css('#saveSetting'))
                        .describedAs('login button');

        static signUpLink = () =>
                PageElement.located(By.css('a[href*="signup"]')) // Adjusted to be more generic as specific URL might vary
                        .describedAs('sign up link');
}
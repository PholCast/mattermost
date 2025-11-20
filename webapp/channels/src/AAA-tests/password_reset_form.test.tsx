import { shallow } from 'enzyme';
import React from 'react';

import { mountWithIntl } from 'tests/helpers/intl-test-helper';

import PasswordResetForm from '../components/password_reset_form/password_reset_form';
describe('components/PasswordResetForm', () => {
    const baseProps = {
        location: {
            search: '',
        },
        siteName: 'Mattermost',
        actions: {
            resetUserPassword: jest.fn().mockResolvedValue({ data: true }),
        },
    };

    it('should match snapshot', () => {
        // Act
        const wrapper = shallow(<PasswordResetForm {...baseProps} />);

        // Assert
        expect(wrapper).toMatchSnapshot();
    });

    it('should call the resetUserPassword() action on submit', () => {
        // Arrange
        const props = {
            ...baseProps,
            location: {
                search: '?token=TOKEN',
            },
        };

        const wrapper = mountWithIntl(<PasswordResetForm {...props} />);

        // Act
        (wrapper.find('input[type="password"]').first().instance() as unknown as HTMLInputElement).value = 'PASSWORD';
        wrapper.find('form').simulate('submit', { preventDefault: () => { } });

        // Assert
        expect(props.actions.resetUserPassword).toHaveBeenCalledWith('TOKEN', 'PASSWORD');
    });
});

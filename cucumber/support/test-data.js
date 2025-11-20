// support/test-data.js
// Datos de prueba reutilizables

const testUsers = {
  validUser: {
    email: 'usuario.valido@ejemplo.com',
    password: 'Clave123',
    username: 'usuarioValido'
  },
  adminUser: {
    email: 'admin@example.com',
    password: 'admin123',
    username: 'admin'
  },
  inactiveUser: {
    email: 'inactive@example.com',
    password: 'password123',
    username: 'inactiveuser'
  },
  nonexistentUser: {
    email: 'nonexistent@example.com',
    password: 'password123',
    username: 'nonexistent'
  }
};

const testChannels = {
  publicChannel: {
    name: 'canal-publico-prueba',
    description: 'Canal público de prueba',
    type: 'public'
  },
  privateChannel: {
    name: 'canal-privado-prueba',
    description: 'Canal privado de prueba',
    type: 'private'
  }
};

const invalidInputs = {
  shortPassword: '123',
  longPassword: 'A'.repeat(1000),
  invalidEmail: 'not-an-email',
  specialCharacterUsername: 'user@#$%',
  veryLongUsername: 'a'.repeat(256),
  emptyString: '',
  specialCharacters: '!@#$%^&*()'
};

const validInputs = {
  email: 'test.user@example.com',
  username: 'testuser123',
  password: 'SecurePass123!',
  channelName: 'test-channel-123',
  channelDescription: 'This is a test channel with description'
};

module.exports = {
  testUsers,
  testChannels,
  invalidInputs,
  validInputs
};

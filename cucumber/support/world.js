// support/world.js
// Contexto compartido entre pasos (World)

const { World } = require('@cucumber/cucumber');

class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.appUrl = 'http://localhost:8065';
    this.users = {};
    this.channels = {};
  }

  // Métodos auxiliares compartidos
  addUser(username, userData) {
    this.users[username] = userData;
  }

  getUser(username) {
    return this.users[username];
  }

  addChannel(channelName, channelData) {
    this.channels[channelName] = channelData;
  }

  getChannel(channelName) {
    return this.channels[channelName];
  }
}

module.exports = CustomWorld;

const path = require('path');

module.exports = {
  moduleNameMapper: {
    '^@src/(.*)$': path.resolve(__dirname, './src/$1')
  },
  setupFiles: ['./jest.setup.js'],
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
  roots: ['<rootDir>/src']
};
const path = require('path');

module.exports = {
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1'
  },
  setupFiles: ['./jest.setup.js'],
  testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  moduleFileExtensions: ['js', 'json', 'jsx', 'node'],
  roots: ['<rootDir>/src']
};

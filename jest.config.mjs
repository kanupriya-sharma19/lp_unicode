// jest.config.js
export default {
  testEnvironment: 'node',
  transform: {},
  globals: {
    'ts-jest': {
      useESM: true,  // Only if you're using TypeScript
    },
  },
  moduleFileExtensions: ['js', 'json', 'node', 'mjs'],
};

export default {
    transform: {
      '^.+\\.js$': 'babel-jest', // Transform JavaScript files
    },
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'mjs', 'json', 'node'], // Support for different file extensions
  };
  
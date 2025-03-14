module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: './',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['src/**/*.{ts,js}', 'test/**/*.{ts,js}'],
    coverageDirectory: './coverage',
    testEnvironment: 'node',
  };
  
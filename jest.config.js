module.exports = {
  roots: ['<rootDir/src'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}'
  ],
  converageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}

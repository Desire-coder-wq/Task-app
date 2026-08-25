import createJestConfig from 'next/jest.js';

const createJestConfigWrapper = createJestConfig({
  dir: './',
});

export default createJestConfigWrapper({
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
});

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@mobx-form-state/core': '<rootDir>/packages/core/src',
    '@mobx-form-state/react': '<rootDir>/packages/react/src',
  },
};

module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testEnvironmentOptions: {
      customExportConditions: [''],
    },
    globals: {
      Request,
      Response,
      TextEncoder,
      TextDecoder
    },
  }
  
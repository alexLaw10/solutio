/* eslint-disable */
export default {
  displayName: 'dashboard',
  preset: '../jest.preset.js',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  coverageDirectory: '../coverage/dashboard',
  collectCoverageFrom: [
    'src/app/**/*.{ts,js}',
    '!src/app/**/*.spec.{ts,js}',
    '!src/app/**/*.interface.{ts,js}',
    '!src/app/**/*.module.{ts,js}',
    '!src/app/**/*.routes.{ts,js}',
    '!src/main.ts',
    '!src/test-setup.ts',
    '!src/**/index.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  transform: {
    '^.+\\.(ts|mjs|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment',
  ],
};

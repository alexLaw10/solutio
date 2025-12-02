import '@testing-library/jest-native/extend-expect';

global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});


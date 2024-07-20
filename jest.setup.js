import jest from 'jest-mock';

// 모든 console 메서드를 무시하도록 설정
global.console = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

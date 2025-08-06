// Test setup file for Jest

// Mock chalk to avoid ES module issues
jest.mock('chalk', () => {
  const mockChalk = (text: string) => text;
  (mockChalk as any).blue = (text: string) => text;
  (mockChalk as any).green = (text: string) => text;
  (mockChalk as any).red = (text: string) => text;
  (mockChalk as any).yellow = (text: string) => text;
  (mockChalk as any).cyan = (text: string) => text;
  (mockChalk as any).magenta = (text: string) => text;
  (mockChalk as any).white = (text: string) => text;
  (mockChalk as any).gray = (text: string) => text;
  (mockChalk as any).bold = (text: string) => text;
  (mockChalk as any).dim = (text: string) => text;
  (mockChalk as any).underline = (text: string) => text;
  (mockChalk as any).reset = (text: string) => text;
  
  // Support chained methods
  (mockChalk as any).bold.blue = (text: string) => text;
  (mockChalk as any).bold.cyan = (text: string) => text;
  (mockChalk as any).bold.green = (text: string) => text;
  (mockChalk as any).bold.red = (text: string) => text;
  (mockChalk as any).bold.yellow = (text: string) => text;
  (mockChalk as any).bold.white = (text: string) => text;
  
  return {
    default: mockChalk,
    ...mockChalk
  };
});

// Global test setup
beforeEach(() => {
  // Reset all mocks before each test
  jest.clearAllMocks();
});

afterEach(() => {
  // Clean up after each test
  jest.restoreAllMocks();
}); 
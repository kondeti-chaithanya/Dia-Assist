import { vi } from "vitest";

const mockAxiosInstance = {
  post: vi.fn(),
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),

  interceptors: {
    response: {
      use: vi.fn(),
    },
    request: {
      use: vi.fn(),
    },
  },
};

export default {
  create: vi.fn(() => mockAxiosInstance),
};

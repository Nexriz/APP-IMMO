import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

/*
jest.mock("next-auth", () => ({
  __esModule: true,
  default: () => ({
    handlers: {},
    auth: {},
    signIn: jest.fn(),
    signOut: jest.fn(),
  }),
}));

jest.mock("next-auth/providers/credentials", () => ({
  __esModule: true,
  Credentials: jest.fn(() => ({})), // mock du constructeur
}));
*/

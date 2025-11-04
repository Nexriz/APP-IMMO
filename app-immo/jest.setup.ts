import dotenv from 'dotenv';
import path from 'path';
import "@testing-library/jest-dom";

dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

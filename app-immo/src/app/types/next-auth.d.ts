import { Role } from '@prisma/client'; // Import de l'enumeration
import 'next-auth';

declare module 'next-auth' {
  interface User {
    Role: Role;
  }

  interface Session {
    user: {
      Role: Role;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    Role: Role; 
  }
}
/** @type {import('jest').Config} */
module.exports = {
  // 1. Environnement par défaut pour React
  testEnvironment: "jsdom",

  // 2. Fichier de Setup (inchangé)
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // 3. Alias de chemin (inchangé)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  // 4. Dire à Jest quels fichiers sont des modules ESM
  extensionsToTreatAsEsm: [".ts", ".tsx"],

  // 5. Configurer "ts-jest" manuellement
  transform: {
    // Utiliser ts-jest pour tous les fichiers .ts/.tsx
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        // Dire à ts-jest de sortir du code ESM (import/export)
        useESM: true,
        tsconfig: {
          // Et de transformer le JSX (pour React)
          jsx: "react-jsx",
        },
      },
    ],
  },
  
  // 6. Ne pas transformer node_modules (pour que Jest charge 'next-auth' nativement)
  transformIgnorePatterns: ["/node_modules/"],
};
const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  preset: "ts-jest",
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // 👈 ceci fait marcher les imports @/
  },
};
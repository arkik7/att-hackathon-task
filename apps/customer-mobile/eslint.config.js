import { config } from "@repo/eslint-config/react";
export default [
  ...config,
  { ignores: ["dist/**", ".expo/**"] },
  { settings: { react: { version: "detect" } } },
];

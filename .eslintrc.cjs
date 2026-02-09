/** @type {import('eslint').Linter.Config} */
module.exports = {
  ignorePatterns: ["dist"],
  env: {
    browser: true,
    es2020: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      rules: {
        // TypeScript handles these via the compiler
        "no-undef": "off",
        "no-unused-vars": "off",
      },
    },
  ],
};

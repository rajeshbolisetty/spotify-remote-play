import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-plugin-prettier";
import globals from "globals";

export default [
  {
    ignores: ["dist"],
  },
  { languageOptions: { globals: { ...globals.node, ...globals.mocha } } },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2021,
      sourceType: "script",
    },
    plugins: {
      prettier,
      "@typescript-eslint": typescriptEslint,
    },
    rules: {
      "no-undef": "error",
      "node/no-unpublished-require": "off",
      "no-control-regex": "warn",
      "no-unsafe-finally": "warn",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "no-useless-catch": "warn",
      "no-useless-escape": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];

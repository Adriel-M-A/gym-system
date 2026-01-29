import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default tseslint.config(
    { ignores: ["dist", "dist-electron", "node_modules", "*.config.ts", "*.config.js", "*.config.mjs"] },
    {
        extends: [js.configs.recommended, ...tseslint.configs.recommended],
        files: ["**/*.{ts,tsx}"],
        languageOptions: {
            ecmaVersion: 2020,
            globals: globals.browser,
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            }
        },
        plugins: {
            react: reactPlugin,
            "react-hooks": reactHooks,
        },
        settings: {
            react: {
                version: "detect"
            }
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react/react-in-jsx-scope": "off", // Not needed with React 17+
            "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
            "@typescript-eslint/no-explicit-any": "warn", // Start with warn to not block immediately
            "no-console": ["warn", { allow: ["warn", "error"] }],
        },
    }
);

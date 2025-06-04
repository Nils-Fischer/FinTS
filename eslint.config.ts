import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import prettier from "eslint-plugin-prettier";

export default [
    js.configs.recommended,
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                ecmaVersion: 2022,
                sourceType: "module",
            },
            globals: {
                Buffer: "readonly",
                process: "readonly",
                console: "readonly",
                setTimeout: "readonly",
                clearTimeout: "readonly",
                setInterval: "readonly",
                clearInterval: "readonly",
                global: "readonly",
                __dirname: "readonly",
                __filename: "readonly",
                module: "readonly",
                require: "readonly",
                exports: "readonly",
            },
        },
        plugins: {
            "@typescript-eslint": typescript,
            prettier: prettier,
        },
        rules: {
            ...typescript.configs.recommended.rules,
            ...prettierConfig.rules,
            "prettier/prettier": "error",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    destructuredArrayIgnorePattern: "^_",
                },
            ],
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-inferrable-types": "off",
            "no-console": "warn",
            "no-undef": "off",
            "no-empty-pattern": "off",
            "no-case-declarations": "error",
            "no-fallthrough": "error",
            "no-duplicate-case": "error",
            "no-unreachable": "error",
            "no-unused-labels": "error",
            "no-useless-escape": "error",
            "prefer-const": "error",
            "no-var": "error",
        },
    },
    {
        files: ["**/tests/**/*.ts", "**/*.test.ts"],
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "no-console": "off",
        },
    },
    {
        ignores: ["node_modules/", "dist/", "coverage/", "generated/", "cache/", "*.js", "*.d.ts"],
    },
];

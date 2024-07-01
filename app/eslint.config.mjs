import { fixupConfigRules } from "@eslint/compat";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

const config = [
    {
    ignores: ["**/dist"],
}, ...fixupConfigRules(compat.extends(
    "eslint:recommended",
    "react-app",
    "plugin:react/jsx-runtime",
    "plugin:@typescript-eslint/strict",
    "prettier",
)), {
    languageOptions: {
        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            project: true,
            tsconfigRootDir: "./",
        },
    },

    rules: {
        "@typescript-eslint/consistent-type-imports": [2, {
            fixStyle: "separate-type-imports",
        }],

        "@typescript-eslint/no-restricted-imports": [2, {
            paths: [{
                name: "react-redux",
                importNames: ["useSelector", "useStore", "useDispatch"],
                message: "Please use pre-typed versions from `src/app/hooks.ts` instead.",
            }],
        }],
    },
}, {
    files: ["**/*.{c,m,}{t,j}s", "**/*.{t,j}sx"],
}, {
    files: ["**/*{test,spec}.{t,j}s?(x)"],

    languageOptions: {
        globals: {
            ...globals.jest,
        },
    },
}];

export default config;

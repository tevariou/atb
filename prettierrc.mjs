/** @type {import("@ianvs/prettier-plugin-sort-imports").PrettierConfig} */

const config = {
    singleQuote: false,
    plugins: ["@ianvs/prettier-plugin-sort-imports"],
    importOrder: [
        '',
        '^react$',
        '^next$',
        '^next/.*$',
        '<BUILTIN_MODULES>',
        '<THIRD_PARTY_MODULES>',
        '^@docs/(.*)$',
        '^@/.*$',
        '^../(?!.*.css$).*$',
        '^./(?!.*.css$).*$',
        '\\.css$',
      ],
};

export default config;

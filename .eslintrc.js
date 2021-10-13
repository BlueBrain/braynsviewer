module.exports = {
    env: {
        browser: true
    },
    extends: ["react-app", "prettier", "eslint:recommended"],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.eslint.json",
        sourceType: "module"
    },
    plugins: [
        "eslint-plugin-prefer-arrow",
        "eslint-plugin-import",
        "eslint-plugin-no-null",
        "eslint-plugin-unicorn",
        "eslint-plugin-jsdoc",
        "@typescript-eslint"
    ],
    rules: {
        complexity: [2, {max: 20}],
        "no-unused-vars": 1
    },
    globals: {
        JSX: "readonly"
    }
}

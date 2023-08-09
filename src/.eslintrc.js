module.exports = {
    root: true,
    extends: [
        "plugin:vue/vue3-essential",
        "eslint:recommended",
        "@vue/eslint-config-typescript",
        "@vue/eslint-config-prettier",
    ],
    parserOptions: {
        ecmaVersion: "latest",
    },
    rules: {
        "no-unused-vars": ["off"], // JS disabled - TS takes over
        "@typescript-eslint/no-unused-vars": [
            "warn",
            {
                varsIgnorePattern: "_",
                argsIgnorePattern: "_",
            },
        ],
        "vue/multi-word-component-names": [
            "error",
            {
                ignores: ["dashboard", "users", "home"],
            },
        ],
        "@typescript-eslint/no-explicit-any": ["error"],
        "vue/valid-v-slot": [
            "error",
            {
                allowModifiers: true,
            },
        ],
    },
};

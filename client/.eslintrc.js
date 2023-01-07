module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier'],
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    extends: [
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        'linebreak-style': 0,
        'import/prefer-default-export': 0,
        'prettier/prettier': 0,
        'import/extensions': 0,
        'no-use-before-define': 0,
        'import/no-unresolved': 0,
        'no-shadow': 0,
        'react/jsx-filename-extension': [0, { extensions: ['.ts', '.tsx'] }],
        'jsx-a11y/no-noninteractive-element-interactions': 0,
        'react/function-component-definition': 0,
        'react/jsx-props-no-spreading': 0,
        '@typescript-eslint/no-unused-vars': 1,
    },
};

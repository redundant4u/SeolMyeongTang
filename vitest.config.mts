import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
    resolve: {
        alias: Object.fromEntries(
            ['api', 'components', 'pages', 'public', 'styles', 'types', 'utils'].map((name) => [
                name,
                fileURLToPath(new URL(`./${name}`, import.meta.url)),
            ])
        ),
    },
    plugins: [
        {
            name: 'test-svg',
            enforce: 'pre',
            transform(_, id) {
                if (id.endsWith('.svg'))
                    return {
                        code: 'import React from "react"; export default (props) => React.createElement("svg", props);',
                    };
            },
        },
    ],
    test: {
        include: ['tests/*.test.{ts,tsx}'],
        environment: 'jsdom',
        setupFiles: ['./tests/setup.ts'],
        coverage: {
            provider: 'v8',
            include: ['api/**/*.ts', 'utils/**/*.ts', 'components/**/*.tsx', 'pages/**/*.tsx'],
            exclude: ['components/Vnc/core/**', 'components/Vnc/vendor/**'],
            reporter: ['text', 'json', 'json-summary', 'html'],
            thresholds: { statements: 90, branches: 90, functions: 90, lines: 90 },
        },
    },
});

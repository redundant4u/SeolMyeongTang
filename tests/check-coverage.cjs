const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const report = JSON.parse(fs.readFileSync('coverage/coverage-final.json', 'utf8'));

for (const dir of ['api', 'components', 'pages', 'utils']) {
    for (const file of fs.readdirSync(dir, { recursive: true })) {
        const source = path.join(dir, file);
        if (!/\.tsx?$/.test(source) || /^components[\\/]Vnc[\\/](core|vendor)[\\/]/.test(source)) continue;
        assert.ok(Object.hasOwn(report, path.resolve(source)), `Missing source file in coverage: ${source}`);
    }
}

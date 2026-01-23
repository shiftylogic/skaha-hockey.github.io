const fs = require('fs-extra');
const path = require('path');

const srcDir = path.resolve(__dirname, '../../old-site/_posts');
const destDir = path.resolve(__dirname, '../src/content/posts');

console.log(`Migrating posts from ${srcDir} to ${destDir}...`);

if (!fs.existsSync(srcDir)) {
    console.error(`Source directory ${srcDir} does not exist.`);
    process.exit(1);
}

fs.ensureDirSync(destDir);
fs.copySync(srcDir, destDir);
console.log('Posts migrated successfully.');

const fs = require('fs');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

const packageJsonPath = path.resolve(__dirname, './package.json');
const packageData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

packageData.main = isDev ? 'src/background.js' :  "src/background.js";

fs.writeFileSync(packageJsonPath, JSON.stringify(packageData, null, 2));
console.log(`Set package.json main to: ${packageData.main}`);

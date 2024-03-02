const fs = require('fs');
const path = require('path');
const colors = require('colors/safe');
require('dotenv').config();
const { CHUNKS_FOLDER } = process.env;

// Get the name of the new chunk from command line arguments
const chunkName = process.argv[2];

if (!chunkName) {
  console.error('Please provide a name for the new chunk.');
  process.exit(1);
}

// Path to the chunks folder
const chunksRootPath = path.resolve(process.cwd(), CHUNKS_FOLDER);


// Create a new directory for the chunk
const chunkPath = path.join(chunksRootPath, chunkName);

if (checkIfExists(chunkPath)) {
  console.error(`Please provide ANOTHER name for the new chunk. Chunk named "${chunkName}" already exists!`);
  process.exit(1);
}

fs.mkdirSync(chunkPath);

const paths = {
  scss: path.join(chunkPath, 'index.scss'),
  html: path.join(chunkPath, 'index.html'),
  ts: path.join(chunkPath, 'index.ts'),
  md: path.join(chunkPath, 'readme.md'),
  assets: path.join(chunkPath, 'assets')
};

const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${chunkName}</title>
  </head>
  <body>
    <details class="chunksContainer" open>
      <summary class="chunksSummary">Table of Contents</summary>
      <div class="chunkAnchors">
        <%= htmlWebpackPlugin.options.tableOfContents %>
      </div>
    </details>
    <h1>${chunkName}</h1>
  </body>
</html>
`;
const scssContent = `/* Import the shared SCSS file for the table of contents  */
@import '../../shared/tableOfContents.scss';

/* ${chunkName} Styles */`;
const tsContent = `console.log('Hello from ${chunkName}');`;
const mdContent = `# ${chunkName}`;

console.log(colors.rainbow('='.repeat(40)), colors.inverse(` generate playground for "${chunkName}" `), colors.rainbow('='.repeat(40)));
fs.mkdirSync(paths.assets);
console.log('😄', colors.green.bold('created mandatory folder: 📁 assets'));
fs.writeFileSync(paths.html, htmlContent);
console.log('😄', colors.green.bold('created mandatory file 📄 index.html'));
fs.writeFileSync(paths.scss, scssContent);
console.log('😄', colors.green.bold('created mandatory file 📄 index.scss'));
fs.writeFileSync(paths.ts, tsContent);
console.log('😄', colors.green.bold('created mandatory file 📄 index.ts'));
fs.writeFileSync(paths.md, mdContent);
console.log('😄', colors.green.bold('created file 📄 readme.md'));
console.log('🥵', colors.red.bold('[IMPORTANT] do not rename, move or remove mandatory files and folder - they are expected to exist in their initial places by webpack script'));
console.log('😉', colors.green.bold('[HINT] content of mandatory files still can be any'));
console.log('😉', colors.green.bold('[HINT] you also may add other files and folders to organize your codebase conveniently'));
console.log('Initial chunk directory structure:');
const tree = generateDirectoryTree(chunkPath);
console.log(colors.blue.bold(tree));
console.log('😉', colors.green.bold('[HINT] path to chunk folder is:'), colors.blue.bold(chunkPath));
console.log(`💾 Chunk '${chunkName}' created successfully.`);

function checkIfExists(filePath) {
  try {
    // Check if the file exists
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

function generateDirectoryTree(directoryPath, indent = '', isFirstLevel = true) {
  let tree = '';
  const rootFolderName = isFirstLevel ? `📁 ${path.basename(directoryPath)}\n` : '';
  tree += rootFolderName;
  const items = fs.readdirSync(directoryPath);
  items.sort();
  items.forEach((item, index) => {
    const itemPath = path.join(directoryPath, item);
    const isDirectory = fs.statSync(itemPath).isDirectory();
    const prefix = index === items.length - 1 ? '└── ' : '├── ';
    if (isDirectory) {
      tree += `${indent}${prefix}📁 ${item}\n`;
      tree += generateDirectoryTree(itemPath, indent + (index === items.length - 1 ? '    ' : '│   '), false);
    } else {
      tree += `${indent}${prefix}📄 ${item}\n`;
    }
  });
  return tree;
}
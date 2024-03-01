const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { CHUNKS_FOLDER } = process.env;

// Get the name of the new chunk from command line arguments
const chunkName = process.argv[2];

if (!chunkName) {
  console.error('Please provide a name for the new chunk.');
  process.exit(1);
}

// Path to the chunks folder
const allChunksPath = path.resolve(process.cwd(), CHUNKS_FOLDER);


// Create a new directory for the chunk
const chunkPath = path.join(allChunksPath, chunkName);

if (checkIfExists(chunkPath)) {
  console.error(`Please provide ANOTHER name for the new chunk. Chunk named "${chunkName}" already exists!`);
  process.exit(1);
}

fs.mkdirSync(chunkPath);

// Create index.html file with default content
const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Main Tutorial Page</title>
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

fs.writeFileSync(path.join(chunkPath, 'index.html'), htmlContent);

// Create index.scss file with default content
const scssContent = `/* Import the shared SCSS file for the table of contents  */
@import '../../shared/tableOfContents.scss';

/* ${chunkName} Styles */`;
fs.writeFileSync(path.join(chunkPath, 'index.scss'), scssContent);

// Create index.ts file with default content
const tsContent = `console.log('Hello from ${chunkName}');`;

fs.writeFileSync(path.join(chunkPath, 'index.ts'), tsContent);

console.log(`Chunk '${chunkName}' created successfully.`);

function checkIfExists(filePath) {
  try {
    // Check if the file exists
    fs.accessSync(filePath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}
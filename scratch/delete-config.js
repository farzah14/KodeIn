const fs = require('fs');
const path = require('path');

const configPath = path.join(process.cwd(), 'prisma.config.ts');

if (fs.existsSync(configPath)) {
    console.log('Deleting prisma.config.ts...');
    fs.unlinkSync(configPath);
    console.log('Successfully deleted prisma.config.ts');
} else {
    console.log('prisma.config.ts does not exist');
}

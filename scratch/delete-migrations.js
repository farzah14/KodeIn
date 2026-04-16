const fs = require('fs');
const path = require('path');

const migrationsPath = path.join(process.cwd(), 'prisma', 'migrations');

if (fs.existsSync(migrationsPath)) {
    console.log('Deleting migrations directory...');
    fs.rmSync(migrationsPath, { recursive: true, force: true });
    console.log('Successfully deleted prisma/migrations');
} else {
    console.log('prisma/migrations does not exist');
}

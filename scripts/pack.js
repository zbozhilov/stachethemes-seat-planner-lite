#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');

const ROOT_DIR = path.resolve(__dirname, '..');
const BUILD_DIR = path.join(ROOT_DIR, 'build');
const PLUGIN_NAME = 'stachethemes-seat-planner-lite';

// Files and folders to include in the zip
const INCLUDE_ITEMS = [
    'assets',
    'includes',
    'languages',
    'libs',
    'stachethemes-seat-planner-lite.php',
    'readme.txt',
    'README.md',
    'changelog.txt'
];

async function pack() {
    console.log('🔍 Running PHPStan analysis...');
    
    try {
        execSync('composer phpstan', { 
            cwd: ROOT_DIR, 
            stdio: 'inherit' 
        });
    } catch (error) {
        console.error('❌ PHPStan analysis failed!');
        process.exit(1);
    }

    console.log('\n🧪 Running PHP tests...');
    
    try {
        execSync('composer test', { 
            cwd: ROOT_DIR, 
            stdio: 'inherit' 
        });
    } catch (error) {
        console.error('❌ PHP tests failed!');
        process.exit(1);
    }

    console.log('\n🧪 Running JavaScript tests...');
    
    try {
        execSync('npm run test', { 
            cwd: ROOT_DIR, 
            stdio: 'inherit' 
        });
    } catch (error) {
        console.error('❌ JavaScript tests failed!');
        process.exit(1);
    }

    console.log('\n🔨 Running production build...');
    
    try {
        execSync('npm run build', { 
            cwd: ROOT_DIR, 
            stdio: 'inherit' 
        });
    } catch (error) {
        console.error('❌ Build failed!');
        process.exit(1);
    }

    console.log('\n🌐 Generating translation file...');
    
    try {
        execSync('npm run do-pot', { 
            cwd: ROOT_DIR, 
            stdio: 'inherit' 
        });
    } catch (error) {
        console.error('❌ Translation file generation failed!');
        process.exit(1);
    }

    console.log('\n📦 Creating package...');

    // Ensure build directory exists
    if (!fs.existsSync(BUILD_DIR)) {
        fs.mkdirSync(BUILD_DIR, { recursive: true });
    }

    // Get version from main plugin file
    const mainPluginFile = fs.readFileSync(
        path.join(ROOT_DIR, 'stachethemes-seat-planner-lite.php'), 
        'utf8'
    );
    const versionMatch = mainPluginFile.match(/Version:\s*(.+)/i);
    const version = versionMatch ? versionMatch[1].trim() : 'unknown';

    const zipFileName = `${PLUGIN_NAME}-${version}.zip`;
    const zipFilePath = path.join(BUILD_DIR, zipFileName);

    // Remove existing zip if it exists
    if (fs.existsSync(zipFilePath)) {
        fs.unlinkSync(zipFilePath);
    }

    // Create zip file
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    return new Promise((resolve, reject) => {
        output.on('close', () => {
            const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
            console.log(`\n✅ Package created: ${zipFileName} (${sizeMB} MB)`);
            console.log(`📁 Location: ${zipFilePath}`);
            resolve();
        });

        archive.on('error', (err) => {
            console.error('❌ Error creating zip:', err);
            reject(err);
        });

        archive.pipe(output);

        // Add each item to the archive with the plugin folder prefix
        for (const item of INCLUDE_ITEMS) {
            const itemPath = path.join(ROOT_DIR, item);
            
            if (!fs.existsSync(itemPath)) {
                console.warn(`⚠️  Skipping missing: ${item}`);
                continue;
            }

            const stats = fs.statSync(itemPath);
            const destPath = `${PLUGIN_NAME}/${item}`;

            if (stats.isDirectory()) {
                archive.directory(itemPath, destPath);
                console.log(`  📁 Added folder: ${item}`);
            } else {
                archive.file(itemPath, { name: destPath });
                console.log(`  📄 Added file: ${item}`);
            }
        }

        archive.finalize();
    });
}

pack().catch((err) => {
    console.error(err);
    process.exit(1);
});

// backup.js
import fs from 'fs';
import archiver from 'archiver';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// create a file to stream archive data to.
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const outputName = `Backup_WorldEngine_${timestamp}.zip`;
const output = fs.createWriteStream(path.join(__dirname, outputName));
const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
});

// listen for all archive data to be written
output.on('close', function () {
    console.log('✅ BACKUP COMPLETE!');
    console.log(`📦 File created: ${outputName}`);
    console.log(`📊 Total size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);

    // PROACTIVE: Copy to USB D: if available
    try {
        const usbRoot = 'D:\\';
        if (fs.existsSync(usbRoot)) {
            const usbPath = path.join(usbRoot, outputName);
            fs.copyFileSync(path.join(__dirname, outputName), usbPath);
            console.log(`💾 USB SYNC: Successfully saved to D:\\`);
        } else {
            console.log('ℹ️  USB INFO: D:\\ Drive not detected. Skipping USB sync.');
        }
    } catch (err) {
        console.error('❌ USB ERROR: Could not save to D:\\. Check if drive is write-protected.');
    }

    console.log('👉 ACTION: Drag this file to https://drive.google.com');
});

// good practice to catch warnings (ie stat failures and other non-blocking errors)
archive.on('warning', function (err) {
    if (err.code === 'ENOENT') {
        console.warn(err);
    } else {
        throw err;
    }
});

// good practice to catch this error explicitly
archive.on('error', function (err) {
    throw err;
});

// pipe archive data to the file
archive.pipe(output);

console.log('⏳ Starting Backup... (Compressing files)');

// APPEND FILES
// 1. Add everything in current directory
archive.glob('**/*', {
    cwd: __dirname,
    ignore: [
        'node_modules/**', // 🚫 DO NOT BACKUP (Too heavy, can be re-installed)
        '.git/**',         // 🚫 DO NOT BACKUP (GitHub handles this)
        'dist/**',         // 🚫 DO NOT BACKUP (Build files)
        '*.zip',           // 🚫 Don't zip other zips
        'backup.js'        // 🚫 Don't zip this script
    ],
    dot: true // ✅ Include .env files (Important for your secrets!)
});

// finalize the archive (ie we are done appending files but streams have to finish yet)
archive.finalize();

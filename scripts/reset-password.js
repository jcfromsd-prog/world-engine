import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../src/data/users.json');
const TARGET_PASSWORD = '196519682026';

async function resetPassword() {
    console.log('🛡️  ENGINE SECURITY: Initiating Founder Password Reset...');

    try {
        if (!fs.existsSync(dbPath)) {
            console.error('❌ Error: Database file not found at', dbPath);
            return;
        }

        const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        const admin = data.users.find(u => u.email === 'founder@mybestpurpose.com');

        if (!admin) {
            console.error('❌ Error: Admin user not found in database.');
            return;
        }

        const oldPassword = admin.password;
        admin.password = TARGET_PASSWORD;

        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');

        console.log('✅ SUCCESS: Admin password has been reset.');
        console.log(`🔒 NEW KEY: ${TARGET_PASSWORD}`);
        console.log(`📂 UPDATED: ${dbPath}`);
    } catch (error) {
        console.error('❌ FATAL ERROR during password reset:', error.message);
    }
}

resetPassword();

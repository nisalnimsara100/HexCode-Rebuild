// Migration script to convert client ID-based projects to email-based structure
const { migrateToEmailBasedStructure } = require('../lib/client-projects-firebase.ts');

async function runMigration() {
  try {
    console.log('🚀 Starting migration to email-based structure...');
    await migrateToEmailBasedStructure();
    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run migration if called directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration };
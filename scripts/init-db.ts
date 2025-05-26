import { initializeDatabase } from '../utils/db';

async function main() {
  try {
    await initializeDatabase();
    console.log('Database initialization completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

main();

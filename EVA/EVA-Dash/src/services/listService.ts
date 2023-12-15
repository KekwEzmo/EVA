// listService.ts
import sqlite3 from 'sqlite3';
import { ListModel } from '../models/listModel';

const db = new sqlite3.Database('/testing.db');

export const getListDataFromDB = (): Promise<ListModel[]> => {
  const query = 'SELECT * FROM your_table_name'; // Replace with your actual table name

  return new Promise((resolve, reject) => {
    db.all(query, (err, rows: ListModel[]) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// Close the database connection when the application exits
process.on('exit', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing the database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1); // Exit the process with an error code
});

// Handle promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1); // Exit the process with an error code
});

import teamsBot from "./teamsBot";
import sqlite3 from 'sqlite3';

// Function to initialize the database
function initializeDatabase() {
    // Open the database
    const db = new sqlite3.Database('Ticket-test.db');

    // Check if the user_tickets table exists
    db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='user_tickets'", (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }

        // If the table doesn't exist, create it
        if (!row) {
            db.run(`
                CREATE TABLE user_tickets (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id TEXT,
                    title TEXT,
                    request TEXT,
                    selected_items TEXT
                )
            `, (err) => {
                if (err) {
                    console.error(err.message);
                } else {
                    console.log('Database table created: user_tickets Tst2');
                }
            });
        }
    });

    // Close the database connection
    db.close();
}

// Initialize the database when the bot starts
// initializeDatabase();
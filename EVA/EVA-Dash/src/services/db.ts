// db.ts
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('testing.db');

export default db;

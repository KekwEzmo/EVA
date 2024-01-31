import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('../lib/server/database.db');

export async function getAllEntries() {
  const statement = `SELECT * FROM tickets`;
  const result = await db.all(statement);
  return result;
}

export async function getEntryById(id: any) {
  const statement = `SELECT * FROM tickets WHERE id = ?`;
  const [row] = await db.all(statement, [id]);
  return row;
}

export async function addEntry(entry: { title: any; description: any; }) {
  const statement = `INSERT INTO tickets (title, description) VALUES (?, ?);`;
  await db.run(statement, [entry.title, entry.description]);
}

export async function updateEntry(id: any, updatedEntry: { title: any; description: any; }) {
  const statement = `UPDATE tickets SET title = ?, description = ? WHERE id = ?;`;
  await db.run(statement, [updatedEntry.title, updatedEntry.description, id]);
}

export async function deleteEntry(id: any) {
  const statement = `DELETE FROM tickets WHERE id = ?;`;
  await db.run(statement, [id]);
}
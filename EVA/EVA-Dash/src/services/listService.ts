// listService.ts
import sqlite3 from 'sqlite3';
import { ListModel } from '../models/listModel';

const db = new sqlite3.Database('path-to-your/testing.db');

export const getListDataFromDB = (): Promise<ListModel[]> => {
  const query = 'SELECT * FROM tickets'; // replace with your actual table name

  return new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

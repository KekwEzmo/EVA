import { ListModel } from "../models/listModel";
import mysql from "mysql";

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'your_mysql_host',
  user: 'your_mysql_user',
  password: 'your_mysql_password',
  database: 'your_mysql_database',
});

// Connect to the database
connection.connect();

/**
 * Retrieve data from the MySQL database for list widget
 * @returns data for list widget
 */
export const getListDataFromDatabase = (callback: (data: ListModel[]) => void): void => {
  // Query to retrieve data from the 'tickets' table (adjust table and column names as needed)
  const query = 'SELECT id, title, head, content FROM tickets';

  // Execute the query
  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching data from database:', error);
      callback([]);
    } else {
      // Transform the database results into ListModel array
      const listData: ListModel[] = results.map((result: any) => ({
        id: result.id,
        title: result.title,
        head: result.head,
        content: result.content,
      }));

      // Callback with the retrieved data
      callback(listData);
    }
  });
};

// Close the MySQL connection when done
connection.end();
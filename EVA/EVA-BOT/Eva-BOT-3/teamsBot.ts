import {
  TeamsActivityHandler,
  CardFactory,
  TurnContext,
  AdaptiveCardInvokeValue,
  AdaptiveCardInvokeResponse,
  ActionTypes,
} from "botbuilder";
import rawWelcomeCard from "./adaptiveCards/welcome.json";
import rawLearnCard from "./adaptiveCards/learn.json";
import testcard from "./adaptiveCards/test.json";
import helpcard from "./adaptiveCards/faq.json"
import card2 from "./adaptiveCards/test2.json";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { spawn } from 'child_process';
//import { POST } from "botbuilder/lib/streaming";

import { Client } from 'pg';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';



// import ticketdb from "./ticketDB"
export interface DataInterface {
  likeCount: number;
}
// #################

import sqlite3 from 'sqlite3';

interface TicketCountRow {
  count: number;
}

interface TitleExistsRow {
  count: number;
}


// //Testing DB

// function initializeDatabase1(): void {

  
//   const envPath = path.resolve(__dirname, 'env', '.env.local');
//   const result = dotenv.config({ path: envPath });
  
//   if (result.error) {
//     console.error(result.error);
//   } else {
//     console.log('Environment variables loaded successfully');
//   }

// // ... rest of your code
//   // Update the database connection configuration for the external PostgreSQL database
//   const dbConfig = {
//       user: process.env.DB_U ,
//       host: process.env.DB_H ,
//       database: process.env.DB_N,
//       password: process.env.DB_P,
//       port: 5432, // Replace with your PostgreSQL port if different
//   };
//   console.log(`DB Host: ${process.env.DB_n}`);


//   const db = new Client(dbConfig);

//   // Connect to the PostgreSQL server
//   db.connect()
//       .then(() => {
//           console.log('Connected to PostgreSQL database');
//       })
//       .catch((err) => {
//           console.error('Error connecting to PostgreSQL:', err.message);
//       })
//       .finally(() => {
//           // Close the PostgreSQL connection
//           db.end();
//       });

//   // Check if the user_tickets table exists
//   const createTableQuery = `
//       CREATE TABLE IF NOT EXISTS tickets (
//           id SERIAL PRIMARY KEY,
//           user_id TEXT NOT NULL,
//           title TEXT NOT NULL,
//           request TEXT NOT NULL,
//           selected_items TEXT NOT NULL
//       )
//   `;

//   db.query(createTableQuery)
//             .then(() => {
//                 console.log('Table user_tickets is ready');
//             })
//             .catch((err) => {
//                 console.error('Error creating user_tickets table:', err.message);
//             })
//             .finally(() => {
//                 // Close the PostgreSQL connection
//                 db.end();
//             });
//     }

    

// //

// Local SQLITE-DB

function initializeDatabase() {
  // Create a new SQLite database in memory
  const db = new sqlite3.Database('tickets.db');

  // Define the SQL query to create the tickets table
  const createTableQuery = `
      CREATE TABLE IF NOT EXISTS tickets (
          id INTEGER PRIMARY KEY,
          user_id TEXT NOT NULL,
          title TEXT NOT NULL,
          request TEXT NOT NULL,
          selected_items TEXT NOT NULL
      )
  `;

  // Execute the SQL query to create the table
  db.run(createTableQuery, (err) => {
      if (err) {
          console.error('Error creating tickets table:', err.message);
      } else {
          console.log('Table tickets is ready');
      }
  });

  // Close the database connection
  db.close((err) => {
      if (err) {
          console.error('Error closing database:', err.message);
      } else {
          console.log('Database connection closed');
      }
  });

//Start of opening API service

const uvicornProcess = spawn('uvicorn', ['teamsbot-db-API:app', '--host', '0.0.0.0', '--port', '8000', '--reload']);

uvicornProcess.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

uvicornProcess.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

uvicornProcess.on('close', (code) => {
  console.log(`uvicorn process exited with code ${code}`);
});


}

// Call the function to initialize the database
initializeDatabase();

//

// #################
export class TeamsBot extends TeamsActivityHandler {

  // record the likeCount
  likeCountObj: { likeCount: number };

  constructor() {
    super();

    this.likeCountObj = { likeCount: 0 };
    // initializeDatabase()
    this.onMessage(async (context, next) => {
      console.log("Running with Message Activity.");
      // const userId = context.activity.from.id;

      // Send a message back to the user with the user ID
      // await context.sendActivity(`Your user ID is: ${userId}`);
      // //Send values into External DB
      // if (context.activity.value) {
      //   const user_id = context.activity.from.name;
      //   const title = context.activity.value.inPutText1;
      //   const request = context.activity.value.inPutText;
      //   const selected_items = context.activity.value.tags1;

      //   const pool = new Pool({
      //     user: process.env.DB_U ,
      //     host: process.env.DB_H ,
      //     database: process.env.DB_N,
      //     password: process.env.DB_P,
      //     port: 5432,
      //   });
        
      //   // Check if the user has submitted more than four tickets
      //   const ticketCount = await this.getTicketCountForUser(user_id);
      //   if (ticketCount >= 30) {
      //     await context.sendActivity('You have reached the maximum allowed submissions.');
      //     return;
      //   }
        
      //   // Check if the title already exists for that username
      //   const titleExists = await this.checkIfTitleExistsForUser(title, user_id);
      //   if (titleExists) {
      //     await context.sendActivity('A ticket with the same title already exists.');
      //     return;
      //   }
        
      //   try {
      //     // Insert the ticket into the database
      //     const query = `
      //       INSERT INTO tickets (user_id, title, request, selected_items)
      //       VALUES ($1, $2, $3, $4)
      //     `;
        
      //     const values = [user_id, title, request, selected_items];
        
      //     await pool.query(query, values);
        
      //     console.log('New ticket inserted into the database');
      //     await context.sendActivity('Ticket submitted successfully!');
      //   } catch (error) {
      //     console.error(error.message);
      //     await context.sendActivity('Error submitting ticket.');
      //   } finally {
      //     // Release the client back to the pool
      //     // Note: This is important to prevent resource leaks
      //     // If you're using a transaction, use `client.query('COMMIT');` before releasing the client
      //     // If there's an error, use `client.query('ROLLBACK');` before releasing the client
      //     pool.end();
      //   }
      // // 

        if (context.activity.value) {
            const user_id = context.activity.from.name;
            const title = context.activity.value.inPutText1;
            const request = context.activity.value.inPutText;
            const selected_items = context.activity.value.tags1;
    
            // Initialize the SQLite database
            const db = new sqlite3.Database('tickets.db');
    
            // Check if the user has submitted more than four tickets
            const ticketCount: number = await getTicketCountForUser(db, user_id); // Specify the type as number
            if (ticketCount >= 30) {
            await context.sendActivity('You have reached the maximum allowed submissions.');
            return;
            }
    
            // Check if the title already exists for that username
            const titleExists = await checkIfTitleExistsForUser(db, title, user_id);
            if (titleExists) {
                await context.sendActivity('A ticket with the same title already exists.');
                return;
            }
    
            // Insert the ticket into the database
            const insertQuery = `
                INSERT INTO tickets (user_id, title, request, selected_items)
                VALUES (?, ?, ?, ?)
            `;
    
            db.run(insertQuery, [user_id, title, request, selected_items], function(err) {
                if (err) {
                    console.error('Error inserting ticket into database:', err.message);
                    context.sendActivity('Error submitting ticket.');
                } else {
                    console.log('New ticket inserted into the database');
                    context.sendActivity('Ticket submitted successfully!');
                }
            });

            async function getTicketCountForUser(db, user_id) {
              return new Promise<number>((resolve, reject) => { // Specify the return type as number
                  const query = `
                      SELECT COUNT(*) AS count
                      FROM tickets
                      WHERE user_id = ?
                  `;
          
                  db.get(query, [user_id], (err, row: { count: number }) => { // Explicitly type row as { count: number }
                      if (err) {
                          reject(err);
                      } else {
                          resolve(row ? row.count : 0);
                      }
                  });
              });
          }
          
            
          
          async function checkIfTitleExistsForUser(db, title, user_id) {
            return new Promise((resolve, reject) => {
                const query = `
                    SELECT 1
                    FROM tickets
                    WHERE title = ? AND user_id = ?
                `;
        
                db.get(query, [title, user_id], (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row ? true : false);
                    }
                });
            });
        }
        
            // Close the database connection
            db.close();
        }

      if(context.activity.value)
            {
              const adaptiveCard = CardFactory.adaptiveCard({
                type: 'AdaptiveCard',
                body: [
                    {
                        type: 'TextBlock',
                        size: "large",
                        text: `Problem: ${context.activity.value.inPutText1}`,
                        wrap: true,
                    },
                    {
                      type: 'TextBlock',
                      Size: "medium",
                      text: `---------------------------`,
                      wrap: true,
                  },
                    {
                      type: 'TextBlock',
                      Size: "medium",
                      text: `Beschreibung:`,
                      wrap: true,
                  },
                  {
                    type: 'TextBlock',
                    text: `${context.activity.value.inPutText}`,
                    wrap: true,
                },
                {
                  type: 'TextBlock',
                  Size: "medium",
                  text: `---------------------------`,
                  wrap: true,
              },
                {
                  type: 'TextBlock',
                  Size: "medium",
                  text: `Tags:`,
                  wrap: true,
              },
                {
                  type: 'TextBlock',
                  text: `${context.activity.value.tags1}`,
                  wrap: true,
              },
              
                ],
            });  
              //await context.sendActivity(`${context.activity.value.tags1}`);;
              // Line Obove is to send Plain text back to test if bot can read inputs!!
              await context.sendActivity({
                attachments: [adaptiveCard],
                type: 'message',
            });
            // ####
              
            // ####
            }

      let txt = context.activity.text;
      const removedMentionText = TurnContext.removeRecipientMention(context.activity);
      if (removedMentionText) {
        // Remove the line break
        txt = removedMentionText.toLowerCase().replace(/\n|\r/g, "").trim();
      }
      

      // Trigger command by IM text
      switch (txt) {
        case "welcome": {
          const card = AdaptiveCards.declareWithoutData(rawWelcomeCard).render();
          await context.sendActivity({ attachments: [CardFactory.adaptiveCard(card)] });
          break;
        }
        case "learn": {
          this.likeCountObj.likeCount = 0;
          const card = AdaptiveCards.declare<DataInterface>(rawLearnCard).render(this.likeCountObj);
          await context.sendActivity({ attachments: [CardFactory.adaptiveCard(card)] });
          break;
        }
        case "test":{
          const card = AdaptiveCards.declare<DataInterface>(testcard).render();
          await context.sendActivity({ attachments: [CardFactory.adaptiveCard(card)] });
          break;
        }
        case "help":{
          const card = AdaptiveCards.declare<DataInterface>(helpcard).render();
          await context.sendActivity({ attachments: [CardFactory.adaptiveCard(card)] });
          break;
        }
        case "test2":{
          const card = AdaptiveCards.declare<DataInterface>(card2).render();
          await context.sendActivity({ attachments: [CardFactory.adaptiveCard(card)] });
          break;
        }
        case "all": {
          // Send all cards
          const welcomeCard = AdaptiveCards.declareWithoutData(rawWelcomeCard).render();
          const learnCard = AdaptiveCards.declare<DataInterface>(rawLearnCard).render(this.likeCountObj);
          const testCard = AdaptiveCards.declare<DataInterface>(testcard).render();
      
          await context.sendActivity({
            attachments: [
              CardFactory.adaptiveCard(welcomeCard),
              CardFactory.adaptiveCard(learnCard),
              CardFactory.adaptiveCard(testCard),
            ],
          });
          break;
        }
        
        
        /**
         * case "yourCommand": {
         *   await context.sendActivity(`Add your response here!`);
         *   break;
         * }
         */
      }
      
      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });

    

    (async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      for (let cnt = 0; cnt < membersAdded.length; cnt++) {
        if (membersAdded[cnt].id) {
          const card = AdaptiveCards.declareWithoutData(rawWelcomeCard).render();
          await context.sendActivity({ attachments: [CardFactory.adaptiveCard(card)] });
          break;
        }
      }
      await next();
    });
    
    
  
  }

// // Postgresql functions, Etxernal DB


// private async getTicketCountForUser(user_id: string): Promise<number> {
//   const pool = new Pool({
//     user: process.env.DB_U ,
//     host: process.env.DB_H ,
//     database: process.env.DB_N,
//     password: process.env.DB_P,
//     port: 5432,
//   });
//   try {
//     const ticketCountQuery = `
//       SELECT COUNT(*) as count
//       FROM tickets
//       WHERE user_id = $1
//     `;

//     const result = await pool.query(ticketCountQuery, [user_id]);
//     const count = result.rows[0] ? parseInt(result.rows[0].count) : 0;
//     return count;
//   } catch (error) {
//     console.error(error.message);
//     throw error;
//   }
// }

// private async checkIfTitleExistsForUser(title: string, user_id: string): Promise<boolean> {
//   const pool = new Pool({
//     user: process.env.DB_U ,
//     host: process.env.DB_H ,
//     database: process.env.DB_N,
//     password: process.env.DB_P,
//     port: 5432,
//   });
//   try {
//     const titleExistsQuery = `
//       SELECT COUNT(*) as count
//       FROM tickets
//       WHERE user_id = $1 AND title = $2
//     `;

//     const result = await pool.query(titleExistsQuery, [user_id, title]);
//     const titleExists = result.rows[0] ? parseInt(result.rows[0].count) > 0 : false;
//     return titleExists;
//   } catch (error) {
//     console.error(error.message);
//     throw error;
//   }
// }
// //


// 
  // Invoked when an action is taken on an Adaptive Card. The Adaptive Card sends an event to the Bot and this
  // method handles that event.
  async onAdaptiveCardInvoke(
    context: TurnContext,
    invokeValue: AdaptiveCardInvokeValue
  ): Promise<AdaptiveCardInvokeResponse> {
    // The verb "userlike" is sent from the Adaptive Card defined in adaptiveCards/learn.json
    if (invokeValue.action.verb === "userlike") {
      this.likeCountObj.likeCount++;
      const card = AdaptiveCards.declare<DataInterface>(rawLearnCard).render(this.likeCountObj);
      await context.updateActivity({
        type: "message",
        id: context.activity.replyToId,
        attachments: [CardFactory.adaptiveCard(card)],
      });
      return { statusCode: 200, type: undefined, value: undefined };
    }

    if (invokeValue.action.verb === 'test') {
      await context.sendActivity('Hello, this is a test message!');
      return { statusCode: 200, type: undefined, value: undefined }
  }
    if (invokeValue.action.verb === 'test2') {
      await context.sendActivity('Dont Just Click Me >:(');
      return { statusCode: 200, type: undefined, value: undefined }
    }
    if (invokeValue.action.verb === 'faq') {
      await context.sendActivity('URL TO FAQ PAGE HERE!');
      return { statusCode: 200, type: undefined, value: undefined }
    }
    if (invokeValue.action.verb === 'ticket') {
      const card = AdaptiveCards.declare<DataInterface>(testcard).render();
      await context.sendActivity({ attachments: [CardFactory.adaptiveCard(card)] });
    }
    if (invokeValue.action.type) {
      await context.sendActivity('Here you go');
      return { statusCode: 200, type: undefined, value: undefined }
    }

    }
  }

 
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
import card2 from "./adaptiveCards/test2.json";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { POST } from "botbuilder/lib/streaming";
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
initializeDatabase();




// #################
export class TeamsBot extends TeamsActivityHandler {
  // record the likeCount
  likeCountObj: { likeCount: number };

  constructor() {
    super();

    this.likeCountObj = { likeCount: 0 };
    
    this.onMessage(async (context, next) => {
      console.log("Running with Message Activity.");
      if (context.activity.value) {
        const user_id = context.activity.from.name;
        const title = context.activity.value.inPutText1;
        const request = context.activity.value.inPutText;
        const selected_items = context.activity.value.tags1;

        

        // Check if the user has submitted more than four tickets
        const ticketCount = await this.getTicketCountForUser(user_id);
        if (ticketCount >= 4) {
            await context.sendActivity('You have reached the maximum allowed submissions.');
            return;
        }

        // Check if the title already exists for that username
        const titleExists = await this.checkIfTitleExistsForUser(title, user_id);
        if (titleExists) {
            await context.sendActivity('A ticket with the same title already exists.');
            return;
        }

        // Open the database
        const db = new sqlite3.Database('Ticket-test.db');

        // Insert the ticket into the database
        db.run(`
            INSERT INTO user_tickets (user_id, title, request, selected_items)
            VALUES (?, ?, ?, ?)
        `, [user_id, title, request, selected_items], (err) => {
            if (err) {
                console.error(err.message);
                context.sendActivity('Error submitting ticket.');
            } else {
                console.log('New ticket inserted into the database');
                context.sendActivity('Ticket submitted successfully!');
            }
        });
        
        // Close the database connection
        db.close();
    } else {
        // Handle regular messages or other activities without a value property
        // console.log('Received a message without context.activity.value');
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
    
    
    // 
  
  
  // this.onInvokeActivity.call(async (context, next) => {
  //     const invokeValue = context.activity.value;

  //     if (invokeValue && invokeValue.type === 'adaptiveCard/action' && invokeValue.action && invokeValue.action.type === 'Action.Submit') {
  //         // Handle the .submit action here
  //         const comment = invokeValue.action.data.comment;

  //         // Process the comment (add your logic here)
  //         await context.sendActivity(`Thanks for your feedback: ${comment}`);

  //         // Optionally, return a response
  //         return { statusCode: 200, type: 'message', value: { text: 'Received your feedback!' } };
  //     }

  //     // Continue to the next middleware
  //     await next();
  // });
    // 
  }
// 

private async getTicketCountForUser(user_id: string): Promise<number> {
  return new Promise<number>((resolve, reject) => {
      const db = new sqlite3.Database('Ticket-test.db');

      const ticketCountQuery = `
          SELECT COUNT(*) as count
          FROM user_tickets
          WHERE user_id = ?
      `;

      db.get(ticketCountQuery, [user_id], (err, row: TicketCountRow) => {
          if (err) {
              console.error(err.message);
              reject(err);
          } else {
              const count = row ? row.count : 0;
              resolve(count);
          }

          db.close();
      });
  });
}

private async checkIfTitleExistsForUser(title: string, user_id: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
      const db = new sqlite3.Database('Ticket-test.db');

      const titleExistsQuery = `
          SELECT COUNT(*) as count
          FROM user_tickets
          WHERE user_id = ? AND title = ?
      `;

      db.get(titleExistsQuery, [user_id, title], (err, row: TitleExistsRow) => {
          if (err) {
              console.error(err.message);
              reject(err);
          } else {
              const titleExists = row ? row.count > 0 : false;
              resolve(titleExists);
          }

          db.close();
      });
  });
}

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
    if (invokeValue.action.type) {
      await context.sendActivity('How? just how?');
      return { statusCode: 200, type: undefined, value: undefined }
    }

    }
  }



  

    //   // Check if the submitted action is from the "comment" input field
    //   // if () {
    //   //     const comment = context.sendActivity('Name: ${context.activity.value.comment}');
  
    //   //     // Respond with the user's comment
    //   //     await context.sendActivity(`You entered: ${context.activity.value.comment}, that's pretty cool!`);
  
    //   //     // Optionally, you can return a response
    //   //     return { statusCode: 200, type: undefined, value: undefined };
    //   // }
    //   this.onMessage(async (context, next) => {
    //     if(context.activity.value)
    //     {
    //         await context.sendActivity(`Name: ${context.activity.value.comment}`);;
    //     }
    //     await next();
    // });

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

export interface DataInterface {
  likeCount: number;
}

export class TeamsBot extends TeamsActivityHandler {
  // record the likeCount
  likeCountObj: { likeCount: number };

  constructor() {
    super();

    this.likeCountObj = { likeCount: 0 };

    this.onMessage(async (context, next) => {
      console.log("Running with Message Activity.");
      if(context.activity.value)
            {
                await context.sendActivity(`You Typed: ${context.activity.value.inPutText}`);;
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
      await context.sendActivity('Oh my?');
      return { statusCode: 200, type: undefined, value: undefined }
    }
    if (invokeValue.action.type) {
      await context.sendActivity('Oh my?!=?!???!!??!?!?!?!!?');
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

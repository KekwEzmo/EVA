// listWidget.tsx
import { getListDataFromDB } from '../services/listService';
import { ListModel } from '../models/listModel';
import { Button, Text } from "@fluentui/react-components";
import { List28Filled, MoreHorizontal32Regular } from "@fluentui/react-icons";
import { BaseWidget } from "@microsoft/teamsfx-react";

interface IListWidgetState {
  data: ListModel[];
}

export default class ListWidget extends BaseWidget<any, IListWidgetState> {

  async getData(): Promise<IListWidgetState> {
    const data = await getListDataFromDB();
    return { data };
  }
  header(): JSX.Element | undefined {
    return (
      <div>
        <List28Filled />
        <Text>Your Tickets</Text>
        <Button icon={<MoreHorizontal32Regular />} appearance="transparent" />
      </div>
    );
  }

  body(): JSX.Element | undefined {
    return (
      <div className="list-body">
        {this.state.data?.map((t: ListModel) => {
          return (
            <div key={`${t.id}-div`}>
              <div className="divider" />
              <Text className="title">{t.title}</Text>
              <Text className="content">{t.content}</Text>
              <Text className="head">{t.head}</Text>
            </div>
          );
        })}
      </div>
    );
  }

  footer(): JSX.Element | undefined {
    return (
<<<<<<< HEAD
      <><Button
        onClick={() => this.handleViewDetailsClick()}
        appearance="primary"
      >
        Get Ticket
      </Button><Button
        onClick={() => this.handleViewDetailsClick()}
        appearance="secondary"
      >
=======
      <>
        <Button onClick={() => this.handleViewDetailsClick()} appearance="primary">
          Create Ticket
        </Button>
        <Button onClick={() => this.handleViewDetailsClick()} appearance="secondary">
>>>>>>> 634c06b (added database access)
          More Details
        </Button>
      </>
    );
  }

  private handleViewDetailsClick(): void {
    // Replace the empty string with the URL you want to open
    window.open("https://example.com", "_blank");
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 634c06b (added database access)

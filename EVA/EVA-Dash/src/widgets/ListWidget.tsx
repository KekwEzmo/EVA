import "../styles/ListWidget.css";

import { Button, Text } from "@fluentui/react-components";
import { List28Filled, MoreHorizontal32Regular } from "@fluentui/react-icons";
import { BaseWidget } from "@microsoft/teamsfx-react";

import { ListModel } from "../models/listModel";
import { getListData } from "../services/listService";

interface IListWidgetState {
  data: ListModel[];
}

export default class ListWidget extends BaseWidget<any, IListWidgetState> {
  async getData(): Promise<IListWidgetState> {
    return { data: getListData() };
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
      <><Button
        onClick={() => this.handleViewDetailsClick()}
        appearance="primary"
      >
        Create Ticket
      </Button><Button
        onClick={() => this.handleViewDetailsClick()}
        appearance="secondary"
      >
          More Details
        </Button></>
    );
  }
  
  private handleViewDetailsClick(): void {
    window.open("https://teams.microsoft.com/_#/apps/93be207f-42f9-403c-906a-45ddd4e6f99f/sections/conversations?slug=28:74c01073-93b3-4b00-ad70-292f9d220984&intent=2&category=16&autoNavigationOnDone=true&skipInstalledSuccess=false&filterByPersonal=false&storeLaunchFromChat=false", "_blank");
  }
}
  
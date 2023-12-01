import { Button, Dropdown, Text } from "@fluentui/react-components";
import { BaseWidget } from "@microsoft/teamsfx-react";
import { ticketingModel } from "../models/ticketingModel";
import { getticketData } from "../services/ticketingService";

interface SampleWidgetState {
  data?: ticketingModel;
}

export class SampleWidget extends BaseWidget<any, SampleWidgetState> {
  override async getData(): Promise<SampleWidgetState> {
    return { data: getticketData() };
  }

  override header(): JSX.Element | undefined {
    return <Text>Ticket Creation</Text>;
  }

  override body(): JSX.Element | undefined {
    return <Dropdown placeholder="Input Title">
      {this.state.data?.titulo}</Dropdown>;     
  }

  override footer(): JSX.Element | undefined {
    return <Button>View Details</Button>;
  }
}
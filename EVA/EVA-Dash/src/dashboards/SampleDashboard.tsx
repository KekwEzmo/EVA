import { BaseDashboard } from "@microsoft/teamsfx-react";

import ChartWidget from "../widgets/ChartWidget";
import ListWidget from "../widgets/ListWidget";
import { Field, ProgressBar, ProgressBarProps } from '@fluentui/react-components';
import { SampleWidget } from "../widgets/ticketingwidgets";

export default class SampleDashboard extends BaseDashboard<any, any> {
  override layout(): JSX.Element | undefined {
    return (
      <>
        <ListWidget />
        <ChartWidget />
        <SampleWidget />

      </>
    );


  }
}

export const Default = (props: Partial<ProgressBarProps>) => {
  return (
    <Field validationMessage="Default ProgressBar" validationState="none">
      <ProgressBar {...props} value={100} />
    </Field>
  );
};


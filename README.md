# Overview of EVA

This project aims to create a Ticketing System within MS Teams using Azure Services for implementations in different Business Cases.
## Get started with EVA

> **Prerequisites**
> To run the dashboard template in your local dev machine, you will need:
>
> - [Node.js](https://nodejs.org/), supported versions: 16, 18
> - A [Microsoft 365 account for development](https://docs.microsoft.com/microsoftteams/platform/toolkit/accounts)
> - [Set up your dev environment for extending Teams apps across Microsoft 365](https://aka.ms/teamsfx-m365-apps-prerequisites)
> Please note that after you enrolled your developer tenant in Office 365 Target Release, it may take couple days for the enrollment to take effect.
> - [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit) version 5.0.0 and higher or [Teams Toolkit CLI](https://aka.ms/teamsfx-cli)

1. First, select the Teams Toolkit icon on the left in the VS Code toolbar.
2. In the Account section, sign in with your [Microsoft 365 account](https://docs.microsoft.com/microsoftteams/platform/toolkit/accounts) if you haven't already.
3. Press F5 to start debugging which launches your app in Teams using a web browser. Select `Debug (Edge)` or `Debug (Chrome)`.
4. When Teams launches in the browser, select the Add button in the dialog to install your app to Teams.


## What's included

| Folder       | Contents                                            |
| - | -|
| `.vscode`    | VSCode files for debugging                          |
| `appPackage` | Templates for the Teams application manifest        |
| `env`        | Environment files                                   |
| `infra`      | Templates for provisioning Azure resources          |
| `src`        | The source code for the dashboard Teams application |

The following files can be customized and demonstrate an example implementation to get you started.

| File                                 | Contents                                           |
| - | -|
| `src/models/chartModel.ts`           | Data model for the chart widget                    |
| `src/models/listModel.ts`            | Data model for the list widget                     |
| `src/services/chartService.ts`       | A data retrive implementation for the chart widget |
| `src/services/listService.ts`        | A data retrive implementation for the list widget  |
| `src/dashboards/SampleDashboard.tsx` | A sample dashboard layout implementation           |
| `src/styles/ChartWidget.css`         | The chart widget style file                        |
| `src/styles/ListWidget.css`          | The list widget style file                         |
| `src/widgets/ChartWidget.tsx`        | A widget implementation that can display a chart   |
| `src/widgets/ListWidget.tsx`         | A widget implementation that can display a list    |
| `src/App.css`                        | The style of application route                     |
| `src/App.tsx`                        | Application route                                  |

The following are project-related files. You generally will not need to customize these files.

| File                               | Contents                                                     |
| - | - |
| `src/index.css`                    | The style of application entry point                         |
| `src/index.tsx`                    | Application entry point                                      |
| `src/internal/addNewScopes.ts`     | Implementation of new scopes add                             |
| `src/internal/context.ts`          | TeamsFx Context                                              |
| `src/internal/login.ts`            | Implementation of login                                      |
| `src/internal/singletonContext.ts` | Implementation of the TeamsUserCredential instance singleton |


| File                                 | Contents                                           |
| - | - |
|`teamsapp.yml`|This is the main Teams Toolkit project file. The project file defines two primary things:  Properties and configuration Stage definitions.|
|`teamsapp.local.yml`|This overrides `teamsapp.yml` with actions that enable local execution and debugging.|

### Step 1: Define a data model

Define a data model based on the business scenario, we recommend that you place the data model under the `src/models` directory. Here is an example of a data model::

```typescript
//sampleModel.ts
export interface SampleModel {
  content: string;
}
```

### Step 2: Create a data retrive service

Typically, a widget requires a service to retrieve the necessary data for displaying its content. This service can either fetch static data from a predefined source or retrieve dynamic data from a backend service or API.

For instance, we will implement a service that returns static data and place it under the `src/services` directory.

Here is a sample service for retrieving static data:

```typescript
//sampleService.ts
import { SampleModel } from "../models/sampleModel";

export const getSampleData = (): SampleModel => {
  return { content: "Hello world!" };
};
```

### Step 3: Create a widget file

Create a widget file in the `src/widgets` folder. Inherit the `BaseWidget` class from `@microsoft/teamsfx-react`. The following table lists the methods that you can override to customize your widget.

| Methods     | Function  |
| - | -|
| `getData()` | This method is used to get the data for the widget. You can implement it to get data from the backend service or from the Microsoft Graph API |
| `header()`  | Customize the content of the widget header                                                                                                    |
| `body()`    | Customize the content of the widget body                                                                                                      |
| `footer()`  | Customize the content of the widget footer                                                                                                    |
| `styling()` | Customize the widget style                                                                                                                    |

> All method overrides are optional.

Here's a sample widget implementation:

```tsx
//SampleWidget.tsx
import { Button, Text } from "@fluentui/react-components";
import { BaseWidget } from "@microsoft/teamsfx-react";
import { SampleModel } from "../models/sampleModel";
import { getSampleData } from "../services/sampleService";

interface SampleWidgetState {
  data?: SampleModel;
}

export class SampleWidget extends BaseWidget<any, SampleWidgetState> {
  override async getData(): Promise<SampleWidgetState> {
    return { data: getSampleData() };
  }

  override header(): JSX.Element | undefined {
    return <Text>Sample Widget</Text>;
  }

  override body(): JSX.Element | undefined {
    return <div>{this.state.data?.content}</div>;
  }

  override footer(): JSX.Element | undefined {
    return <Button>View Details</Button>;
  }
}
```

### Step 4: Add the widget to the dashboard

Open the `src/dashboards/SampleDashboard.tsx` file and add the widget to the implementation of the `layout` method. If you want to create a new dashboard, please refer to [How to add a new dashboard](https://aka.ms/teamsfx-dashboard-new#how-to-add-a-new-dashboard).

```tsx
override layout(): JSX.Element | undefined {
  return (
    <>
      <ListWidget />
      <ChartWidget />
      <SampleWidget />
    </>
  );
}
```

Optional: If you want to arrange multiple widgets in the same column, you can refer to the following code snippet:

```css
.one-column {
  display: grid;
  gap: 20px;
  grid-template-rows: 1fr 1fr;
}
```

```jsx
override layout(): JSX.Element | undefined {
  return (
    <>
      <ListWidget />
      <div className="one-column">
        <ChartWidget />
        <SampleWidget />
      </div>
    </>
  );
}
```
- [Customize the widget](https://aka.ms/teamsfx-dashboard-new#customize-the-widget)
- [Customize the dashboard layout](https://aka.ms/teamsfx-dashboard-new#customize-the-dashboard-layout)
- [Create a data loader](https://aka.ms/teamsfx-dashboard-new#how-to-include-a-data-loader)
- [Refresh data based on the schedule](https://aka.ms/teamsfx-dashboard-new#how-to-refresh-data-as-scheduled)
- [Handle empty state](https://aka.ms/teamsfx-dashboard-new#how-to-handle-empty-state)
- [Add a new dashboard](https://aka.ms/teamsfx-dashboard-new#how-to-add-a-new-dashboard)
- [Use Microsoft Graph Toolkit as widget content](https://aka.ms/teamsfx-dashboard-new#how-to-use-microsoft-graph-toolkit-as-widget-content)
- [Embed Power BI to dashboard](https://aka.ms/teamsfx-dashboard-new#how-to-embed-power-bi-to-dashboard)
- [How to add a new Graph API call](https://aka.ms/teamsfx-dashboard-new#how-to-add-a-new-graph-api-call)
- [Enable the app for multi-tenant](https://github.com/OfficeDev/TeamsFx/wiki/Multi-tenancy-Support-for-Azure-AD-app)
- [Preview the app on mobile clients](https://github.com/OfficeDev/TeamsFx/wiki/Run-and-debug-your-Teams-application-on-iOS-or-Android-client)

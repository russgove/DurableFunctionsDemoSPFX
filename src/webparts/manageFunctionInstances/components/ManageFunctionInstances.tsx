import * as React from 'react';
import styles from './ManageFunctionInstances.module.scss';
import { IManageFunctionInstancesProps } from './IManageFunctionInstancesProps';
import { IManageFunctionInstancesState } from './IManageFunctionInstancesState';
import { escape, sortBy } from '@microsoft/sp-lodash-subset';
import {
  DetailsList, DetailsListLayoutMode, IColumn, SelectionMode, Selection,
  ColumnActionsMode
} from "office-ui-fabric-react/lib/DetailsList";
import { autobind } from "office-ui-fabric-react/lib/Utilities";
import { HttpClient, HttpClientResponse } from '@microsoft/sp-http';
import { CommandBar } from "office-ui-fabric-react/lib/CommandBar";
import { MessageBar, MessageBarType } from "office-ui-fabric-react/lib/MessageBar";
import { IContextualMenuItem } from 'office-ui-fabric-react/lib/ContextualMenu';
import { Overlay } from 'office-ui-fabric-react/lib/Overlay';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { wfInstance } from "../../../datamodel";
import { map, orderBy } from 'lodash';


export default class ManageFunctionInstances extends React.Component<IManageFunctionInstancesProps, IManageFunctionInstancesState> {
  private selection: Selection = new Selection();
  public constructor(props: IManageFunctionInstancesProps) {
    super(props);
    console.log("in Construrctor");

    this.selection.getKey = (item => { return item["InstanceId"]; });
    this.state = {

      wfInstances: [],

      showPopup: false,
      showOverlay: true,
      overlayMessage: "Loading ..."
    };
  }
  @autobind
  public fetchWorkflows(): Promise<any> {

    //let query = "$filter=tolower(ApproverEmail) eq '" + this.props.user.email.toLowerCase() + "'";
    let query = `${this.props.wfUrl}/api/GetAllStatus?code=${this.props.accessCode}`;

    return this.props.httpClient.fetch(query, HttpClient.configurations.v1, { credentials: "include", referrerPolicy: "unsafe-url" })
      .then((response: HttpClientResponse) => {
        return response.json().then((workflows) => {
          var sortrd: Array<wfInstance> = orderBy(workflows, [(data) => data.LastUpdatedTime], ['desc']);
          this.setState((current) => (
            { ...current, wfInstances: sortrd }
          )
          );
        });
      })
      .catch((err) => {
        debugger;
      })
      .catch(err => {
        console.log(err);
        alert("There was an error fetching Role Review Items");
      });
  }
  public componentDidMount(): void {

    Promise.all([

      this.fetchWorkflows()])
      .then((x) => {

        this.setState((current) => ({ ...current, showOverlay: false, overlayMessage: "" }));
      }
      );
  }
  public Terminate(id: string): boolean | void {
    debugger;
    let query = `${this.props.wfUrl}/api/TerminateInstance/${id}?code=${this.props.accessCode}`;
    this.props.httpClient.fetch(query, HttpClient.configurations.v1, {
      method: "PUT", mode: "cors", referrerPolicy: "unsafe-url"
    })
      .then((result: HttpClientResponse) => {
        if (result.status != 200) {
          alert(result.statusText);
        } else {

        }
      })
      .catch((err) => {
        debugger;
        console.log(err);
        alert("An error occurred saving the primary approver record");
      });

  }
  public PurgeHistory(id: string): boolean | void {
    debugger;
    let query = `${this.props.wfUrl}/api/PurgeHistory/${id}?code=${this.props.accessCode}`;
    this.props.httpClient.fetch(query, HttpClient.configurations.v1, {
      method: "PUT", mode: "cors", referrerPolicy: "unsafe-url"
    })
      .then((result: HttpClientResponse) => {
        if (result.status != 200) {
          alert(result.statusText);
        } else {

        }
      })
      .catch((err) => {
        debugger;
        console.log(err);
        alert("An error occurred saving the primary approver record");
      });

  }
  public TerminateSelected(ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, item?: IContextualMenuItem): boolean | void {
    debugger;
    for (var wf of this.state.wfInstances) {
      if (this.selection.isKeySelected(wf.InstanceId)) {
        this.Terminate(wf.InstanceId);
      }
    }

    this.componentDidMount();
  }
  public renderRuntimeStatus(item?: wfInstance, index?: number, column?: IColumn) {

    switch (item.RuntimeStatus) {
      case 0:
        return "Running";
      case 1:
        return "Completed";
      case 2:
        return "ContinuedAsNew ";
      case 3:
        return "Failed ";
      case 4:
        return "Canceled ";
      case 5:
        return "Terminated ";
      case 6:
        return "Pending ";
      default:
        return "?";

    }
  }
  public render(): React.ReactElement<IManageFunctionInstancesProps> {
    let itemsNonFocusable: IContextualMenuItem[] = [
      {
        key: "Terminate Selected",
        name: "Teminate Selected",
        icon: "TriggerApproval",
        onClick: this.TerminateSelected.bind(this)

      },
      {
        key: "Purge History",
        name: "Purge History",
        icon: "TriggerAuto",
        onClick: this.PurgeHistory.bind(this)


      },

      {
        key: "Undo", name: "Undo", icon: "Undo"

      },
      { // if the item has been comleted OR there are items with noo approvasl, diable
        key: "Done", name: "Task Complete", icon: "Completed",


      }

    ];

    let farItemsNonFocusable: IContextualMenuItem[] = [
      {

        key: "Save", name: "Save", icon: "Save"

      },

    ];
    return (
      <div className={styles.manageFunctionInstances}>

        <CommandBar
          isSearchBoxVisible={false}
          items={itemsNonFocusable}
          farItems={farItemsNonFocusable}

        />
        <DetailsList
          items={this.state.wfInstances}
          selectionMode={SelectionMode.multiple}
          selection={this.selection}
          key="InstanceId"
          layoutMode={DetailsListLayoutMode.justified}
          columns={[
            {
              key: "InstanceId", name: "InstanceId",
              fieldName: "InstanceId",
              minWidth: 100,
              isResizable: true,
            },

            {
              key: "Name", name: "Name",
              fieldName: "Name",
              minWidth: 100,
              isResizable: true,

            },
            {
              key: "CreatedTime", name: "CreatedTime",
              fieldName: "CreatedTime",
              minWidth: 150,
              isResizable: true,

            },

            {
              key: "LastUpdatedTime", name: "LastUpdatedTime",
              fieldName: "LastUpdatedTime",
              minWidth: 150,
              isResizable: true,


            },
            {
              key: "RuntimeStatus", name: "RuntimeStatus",
              fieldName: "RuntimeStatus",
              minWidth: 90,
              isResizable: true,
              onRender: this.renderRuntimeStatus
          
            },


          ]}
        />

        {this.state.showOverlay && (
          <Overlay >



            <br /><br /><br /><br /><br /><br /><br />

            <Spinner size={SpinnerSize.large} label={this.state.overlayMessage} ariaLive="assertive" />


          </Overlay>
        )}
      </div>
    );
  }
}

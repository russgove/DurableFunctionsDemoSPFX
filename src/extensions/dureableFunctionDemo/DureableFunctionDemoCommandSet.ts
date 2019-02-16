import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters
} from '@microsoft/sp-listview-extensibility';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'DureableFunctionDemoCommandSetStrings';
import { HttpClient, HttpClientConfiguration, IHttpClientOptions, HttpClientResponse } from '@microsoft/sp-http';

export interface IDureableFunctionDemoCommandSetProperties {
  wfInititiationUrl: string; //"http://localhost:7071/api/ApprovalStart for dev
}
const LOG_SOURCE: string = 'DureableFunctionDemoCommandSet';

export default class DureableFunctionDemoCommandSet extends BaseListViewCommandSet<IDureableFunctionDemoCommandSetProperties> {

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized DureableFunctionDemoCommandSet');
    return Promise.resolve();
  }

  @override
  public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {
    const compareOneCommand: Command = this.tryGetCommand('StartApproval');
    if (compareOneCommand) {
      // This command should be hidden unless exactly one row is selected.
      compareOneCommand.visible = event.selectedRows.length === 1;
    }
  }
  @override
  public StartApproval(event: IListViewCommandSetListViewUpdatedParameters): void {

    const requestHeaders: Headers = new Headers();
    requestHeaders.append('Content-Type', 'application/json');// if you d
    let x={"itemId":event.selectedRows[0].getValueByName("ID"),"startedByEmail":this.context.pageContext.user.email};
    let requestBody=JSON.stringify(x);
 
    this.context.httpClient.post(this.properties.wfInititiationUrl, HttpClient.configurations.v1,{
      referrerPolicy: "unsafe-url",
      body: requestBody, method: "POST", mode: "cors", headers: requestHeaders
    })
      .then((resp:HttpClientResponse) => {
   
      })
      .catch((Err) => {
       
      });
    // call the adf initiator // if i pass in the ID the adf initialtor can do the below 2 steps
    // see the ApprovalStartInfo class
    //public class ApprovalStartInfo
    //{
    //    string startedByEmail;
    //    int ItemId;
    //}
    // and create a task with the id of the adf
    // and add the adf id to the current item
  }

  @override
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {

    switch (event.itemId) {
      case 'StartApproval':
        this.StartApproval(event);
        break;
      
      default:
        throw new Error('Unknown command');
    }
  }
}

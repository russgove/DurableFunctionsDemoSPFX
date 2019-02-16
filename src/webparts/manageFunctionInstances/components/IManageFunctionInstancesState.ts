import {wfInstance} from "../../../datamodel";
export interface IManageFunctionInstancesState {
    wfInstances : Array<wfInstance>;
    showOverlay:boolean;
    overlayMessage:string;
    showPopup:boolean;
  }

  // http://localhost:7071/api/GetAllStatus
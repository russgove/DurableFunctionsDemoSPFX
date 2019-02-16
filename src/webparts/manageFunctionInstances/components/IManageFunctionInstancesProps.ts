import { HttpClient } from '@microsoft/sp-http';
export interface IManageFunctionInstancesProps {
  description: string;
  wfUrl:string;
  accessCode:string;
  httpClient:HttpClient;

  
}

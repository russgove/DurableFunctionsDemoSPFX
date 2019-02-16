import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'ManageFunctionInstancesWebPartStrings';
import ManageFunctionInstances from './components/ManageFunctionInstances';
import { IManageFunctionInstancesProps } from './components/IManageFunctionInstancesProps';

export interface IManageFunctionInstancesWebPartProps {
  description: string;
  wfUrl: string;
  accessCode:string;
}

export default class ManageFunctionInstancesWebPart extends BaseClientSideWebPart<IManageFunctionInstancesWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IManageFunctionInstancesProps > = React.createElement(
      ManageFunctionInstances,
      {
        description: this.properties.description,
        wfUrl:this.properties.wfUrl,
        accessCode:this.properties.accessCode,
        httpClient: this.context.httpClient
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

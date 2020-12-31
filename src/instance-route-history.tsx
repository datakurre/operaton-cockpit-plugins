import './instance-route-history.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import SplitPane from 'react-split-pane';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import AuditLog from './Components/AuditLog';
import BPMN from './Components/BPMN';
import BreadcrumbsPanel from './Components/BreadcrumbsPanel';
import Container from './Components/Container';
import History from './Components/History';
import Page from './Components/Page';
import Variables from './Components/Variables';
import { RouteParams, TabParams } from './types';
import { get } from './utils';

export default [
  {
    id: 'definitionTabHistoricInstances',
    pluginPoint: 'cockpit.processDefinition.runtime.tab',
    properties: {
      label: 'History',
    },
    render: (node: Element, { api, processDefinitionId }: TabParams) => {
      (async () => {
        const definition = await get(api, `/process-definition/${processDefinitionId}`);
        const instances = await get(api, '/history/process-instance', {
          processDefinitionKey: definition.key,
          // finished: true,
          sortBy: 'endTime',
          sortOrder: 'desc',
          maxResults: '100',
        });
        ReactDOM.render(
          <React.StrictMode>
            <History instances={instances} />
          </React.StrictMode>,
          node
        );
      })();
    },
  },
  {
    id: 'instanceRouteHistory',
    pluginPoint: 'cockpit.route',
    properties: {
      label: '/history',
    },

    render: (node: Element, { api }: RouteParams) => {
      const hash = window?.location?.hash ?? '';
      const match = hash.match(/\/history\/process-instance\/([^\/]*)/);
      const processInstanceId = match ? match[1] : null;
      if (processInstanceId) {
        (async () => {
          const instance = await get(api, `/history/process-instance/${processInstanceId}`);
          const [diagram, activities, variables] = await Promise.all([
            get(api, `/process-definition/${instance.processDefinitionId}/xml`),
            get(api, '/history/activity-instance', { processInstanceId }),
            get(api, '/history/variable-instance', { processInstanceId }),
          ]);
          activities.sort((a: any, b: any) => {
            a = a.endTime ? new Date(a.endTime) : new Date();
            b = b.endTime ? new Date(b.endTime) : new Date();
            if (a > b) {
              return -1;
            }
            if (a < b) {
              return 1;
            }
            return 0;
          });
          variables.sort((a: any, b: any) => {
            a = a.name;
            b = b.name;
            if (a > b) {
              return 1;
            }
            if (a < b) {
              return -1;
            }
            return 0;
          });
          ReactDOM.render(
            <React.StrictMode>
              <Page>
                <BreadcrumbsPanel
                  processDefinitionId={instance.processDefinitionId}
                  processDefinitionName={instance.processDefinitionName}
                  processInstanceId={processInstanceId}
                />
                <Container>
                  <SplitPane split="vertical" size={200}>
                    <div className="ctn-column">
                      <dl className="process-information">
                        <dt>Instance ID:</dt>
                        <dd>{instance.id}</dd>
                        <dt>Business Key:</dt>
                        <dd>{instance.businessKey || 'null'}</dd>
                        <dt>Definition Version:</dt>
                        <dd>{instance.processDefinitionVersion}</dd>
                        <dt>Definition ID:</dt>
                        <dd>{instance.processDefinitionId}</dd>
                        <dt>Definition Key:</dt>
                        <dd>{instance.processDefinitionKey}</dd>
                        <dt>Definition Name:</dt>
                        <dd>{instance.processDefinitionName}</dd>
                        <dt>Tenant ID:</dt>
                        <dd>{instance.tenantId || 'null'}</dd>
                        <dt>Super Process Instance ID:</dt>
                        <dd>{instance.superProcessInstanceId || 'null'}</dd>
                        <dt>State</dt>
                        <dd>{instance.state}</dd>
                      </dl>
                    </div>
                    <SplitPane split="horizontal" size={300}>
                      <BPMN activities={activities} diagramXML={diagram.bpmn20Xml} style={{ width: '100%' }} />
                      <Tabs className="ctn-row ctn-content-bottom ctn-tabbed" selectedTabClassName="active">
                        <TabList className="nav nav-tabs">
                          <Tab>
                            <a>Audit Log</a>
                          </Tab>
                          <Tab>
                            <a>Variables</a>
                          </Tab>
                        </TabList>
                        <TabPanel className="ctn-tabbed-content ctn-scroll">
                          <AuditLog activities={activities} />
                        </TabPanel>
                        <TabPanel className="ctn-tabbed-content ctn-scroll">
                          <Variables variables={variables} />
                        </TabPanel>
                        <TabPanel></TabPanel>
                      </Tabs>
                    </SplitPane>
                  </SplitPane>
                </Container>
              </Page>
            </React.StrictMode>,
            node
          );
        })();
      }
    },
  },
];
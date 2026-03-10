export default {
  customScripts: [
          'scripts/decisions-dashboard.js',
          'scripts/dashboard-favourites.js',
          'scripts/dashboard-integrations.js',
          'scripts/definition-historic-activities.js',
          'scripts/definition-tab-modify.js',
          'scripts/instance-auto-refresh.js',
          'scripts/instance-action-unlock.js',
          'scripts/instance-historic-activities.js',
          'scripts/instance-route-history.js',
          'scripts/instance-tab-modify.js'
     ],
     bpmnJs: {
       additionalModules: [
         'scripts/robot-module.js'
       ],
     },
     disableWelcomeMessage: true,
     previewHtml: true
};

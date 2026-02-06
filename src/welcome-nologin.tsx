/**
 * Welcome no-login plugin
 * 
 * This plugin disables the login form for Welcome by rendering nothing.
 * It is intended for use in environments where authentication is handled
 * externally (e.g., via SSO, reverse proxy).
 */
export default [
  {
    id: 'welcomeNoLogin',
    pluginPoint: 'welcome.login',
    render: (): void => {
      // Render nothing to disable login form
    },
  },
];

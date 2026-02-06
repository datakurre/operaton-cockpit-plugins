/**
 * Admin no-login plugin
 * 
 * This plugin disables the login form for Admin by rendering nothing.
 * It is intended for use in environments where authentication is handled
 * externally (e.g., via SSO, reverse proxy).
 */
export default [
  {
    id: 'adminNoLogin',
    pluginPoint: 'admin.login',
    render: (): void => {
      // Render nothing to disable login form
    },
  },
];

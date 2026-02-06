/**
 * Tasklist no-login plugin
 *
 * This plugin disables the login form for Tasklist by hiding it with CSS.
 * It is intended for use in environments where authentication is handled
 * externally (e.g., via SSO, reverse proxy, or pre-authentication).
 */

import './nologin.scss';

/**
 * No-login plugin that injects a stylesheet to hide the signin form.
 * No render function needed - the SCSS import handles everything.
 */
export default [];

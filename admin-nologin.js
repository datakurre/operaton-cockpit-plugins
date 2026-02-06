function ___$insertStylesToHeader(css) {
  if (!css) {
    return
  }
  if (typeof window === 'undefined') {
    return
  }

  const style = document.createElement('style');

  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);
  return css
}

___$insertStylesToHeader("/**\n * No-Login Plugin Styles\n * \n * This stylesheet hides the login form for environments where authentication\n * is handled externally (e.g., via SSO, reverse proxy, or pre-authentication).\n * \n * It targets the signin form used across Cockpit, Tasklist, Admin, and Welcome\n * applications by hiding the form element with name=\"signinForm\".\n */\nform[name=signinForm] {\n  display: none !important;\n}");

/**
 * Admin no-login plugin
 *
 * This plugin disables the login form for Admin by hiding it with CSS.
 * It is intended for use in environments where authentication is handled
 * externally (e.g., via SSO, reverse proxy, or pre-authentication).
 */
/**
 * No-login plugin that injects a stylesheet to hide the signin form.
 * No render function needed - the SCSS import handles everything.
 */
var adminNologin = [];

export { adminNologin as default };

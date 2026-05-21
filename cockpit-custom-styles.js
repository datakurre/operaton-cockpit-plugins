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

___$insertStylesToHeader("/**\n * Custom Cockpit Styles Plugin\n * \n * Add your custom CSS/SCSS rules here to customize the Cockpit UI.\n * This stylesheet will be injected into the Cockpit application.\n * \n * Examples:\n * - Override Bootstrap variables\n * - Customize colors, fonts, spacing\n * - Add branding elements\n * - Adjust layout or component styles\n */\n/* Example: Custom primary color */\n/* Example: Custom header styling */\n/* Example: Increase font size for better readability */\n/* Add your custom styles below */\n.col-xs-1,\n.col-xs-2,\n.col-xs-3,\n.col-xs-4,\n.col-xs-5,\n.col-xs-6,\n.col-xs-7,\n.col-xs-8,\n.col-xs-9,\n.col-xs-10,\n.col-xs-11,\n.col-xs-12 {\n  position: relative;\n  min-height: 1px;\n  padding-right: 15px;\n  padding-left: 15px;\n  float: left;\n}\n\n.col-xs-1 {\n  width: 8.33333333%;\n}\n\n.col-xs-2 {\n  width: 16.66666667%;\n}\n\n.col-xs-3 {\n  width: 25%;\n}\n\n.col-xs-4 {\n  width: 33.33333333%;\n}\n\n.col-xs-5 {\n  width: 41.66666667%;\n}\n\n.col-xs-6 {\n  width: 50%;\n}\n\n.col-xs-7 {\n  width: 58.33333333%;\n}\n\n.col-xs-8 {\n  width: 66.66666667%;\n}\n\n.col-xs-9 {\n  width: 75%;\n}\n\n.col-xs-10 {\n  width: 83.33333333%;\n}\n\n.col-xs-11 {\n  width: 91.66666667%;\n}\n\n.col-xs-12 {\n  width: 100%;\n}\n\n.col-xs-offset-0 {\n  margin-left: 0;\n}\n\n.col-xs-offset-1 {\n  margin-left: 8.33333333%;\n}\n\n.col-xs-offset-2 {\n  margin-left: 16.66666667%;\n}\n\n.col-xs-offset-3 {\n  margin-left: 25%;\n}\n\n.col-xs-offset-4 {\n  margin-left: 33.33333333%;\n}\n\n.col-xs-offset-5 {\n  margin-left: 41.66666667%;\n}\n\n.col-xs-offset-6 {\n  margin-left: 50%;\n}\n\n.col-xs-offset-7 {\n  margin-left: 58.33333333%;\n}\n\n.col-xs-offset-8 {\n  margin-left: 66.66666667%;\n}\n\n.col-xs-offset-9 {\n  margin-left: 75%;\n}\n\n.col-xs-offset-10 {\n  margin-left: 83.33333333%;\n}\n\n.col-xs-offset-11 {\n  margin-left: 91.66666667%;\n}\n\n.col-xs-offset-12 {\n  margin-left: 100%;\n}\n\n.col-xs-pull-0 {\n  right: auto;\n}\n\n.col-xs-pull-1 {\n  right: 8.33333333%;\n}\n\n.col-xs-pull-2 {\n  right: 16.66666667%;\n}\n\n.col-xs-pull-3 {\n  right: 25%;\n}\n\n.col-xs-pull-4 {\n  right: 33.33333333%;\n}\n\n.col-xs-pull-5 {\n  right: 41.66666667%;\n}\n\n.col-xs-pull-6 {\n  right: 50%;\n}\n\n.col-xs-pull-7 {\n  right: 58.33333333%;\n}\n\n.col-xs-pull-8 {\n  right: 66.66666667%;\n}\n\n.col-xs-pull-9 {\n  right: 75%;\n}\n\n.col-xs-pull-10 {\n  right: 83.33333333%;\n}\n\n.col-xs-pull-11 {\n  right: 91.66666667%;\n}\n\n.col-xs-pull-12 {\n  right: 100%;\n}\n\n.col-xs-push-0 {\n  left: auto;\n}\n\n.col-xs-push-1 {\n  left: 8.33333333%;\n}\n\n.col-xs-push-2 {\n  left: 16.66666667%;\n}\n\n.col-xs-push-3 {\n  left: 25%;\n}\n\n.col-xs-push-4 {\n  left: 33.33333333%;\n}\n\n.col-xs-push-5 {\n  left: 41.66666667%;\n}\n\n.col-xs-push-6 {\n  left: 50%;\n}\n\n.col-xs-push-7 {\n  left: 58.33333333%;\n}\n\n.col-xs-push-8 {\n  left: 66.66666667%;\n}\n\n.col-xs-push-9 {\n  left: 75%;\n}\n\n.col-xs-push-10 {\n  left: 83.33333333%;\n}\n\n.col-xs-push-11 {\n  left: 91.66666667%;\n}\n\n.col-xs-push-12 {\n  left: 100%;\n}\n\n.cam-table.process-definitions-list.search-results th:first-child, .cam-table.process-definitions-list.search-results td:first-child {\n  width: 30px;\n}\n.cam-table.process-definitions-list.search-results td:first-child {\n  text-align: center;\n}\n.cam-table.process-definitions-list.search-results th:nth-child(2), .cam-table.process-definitions-list.search-results td:nth-child(2) {\n  width: 50px;\n}\n.cam-table.process-definitions-list.search-results th:nth-child(3), .cam-table.process-definitions-list.search-results td:nth-child(3) {\n  width: 80px;\n  max-width: 11vw;\n}\n.cam-table.process-definitions-list.search-results th:last-child, .cam-table.process-definitions-list.search-results td:last-child {\n  max-width: 3vw;\n}\n\n.dashboard .inner {\n  min-height: 0 !important;\n}\n\n.dashboard section.deprecate {\n  margin-top: 0;\n}\n\n.decisions-dashboard .dashboard-view + .dashboard-view {\n  margin-top: -15px;\n}\n\n.dashboard .deprecate-dashboard-view > * {\n  width: 100%;\n}\n.dashboard .deprecate-dashboard-view > * .section-toggle {\n  display: none;\n}");

/**
 * Custom Styles Plugin
 *
 * This plugin applies custom stylesheets to the Cockpit UI without any
 * JavaScript functionality. Useful for branding, theming, or UI adjustments.
 */
/**
 * Custom styles plugin that injects a stylesheet into Cockpit.
 * No render function needed - the SCSS import handles everything.
 */
var cockpitCustomStyles = [];

export { cockpitCustomStyles as default };

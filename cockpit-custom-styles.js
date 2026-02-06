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

___$insertStylesToHeader("/**\n * Custom Cockpit Styles Plugin\n * \n * Add your custom CSS/SCSS rules here to customize the Cockpit UI.\n * This stylesheet will be injected into the Cockpit application.\n * \n * Examples:\n * - Override Bootstrap variables\n * - Customize colors, fonts, spacing\n * - Add branding elements\n * - Adjust layout or component styles\n */\n/* Example: Custom primary color */\n/* Example: Custom header styling */\n/* Example: Increase font size for better readability */\n/* Add your custom styles below */\n.cam-table.process-definitions-list.search-results th:first-child, .cam-table.process-definitions-list.search-results td:first-child {\n  width: 30px;\n}\n.cam-table.process-definitions-list.search-results td:first-child {\n  text-align: center;\n}\n.cam-table.process-definitions-list.search-results th:nth-child(2), .cam-table.process-definitions-list.search-results td:nth-child(2) {\n  width: 50px;\n}\n.cam-table.process-definitions-list.search-results th:nth-child(3), .cam-table.process-definitions-list.search-results td:nth-child(3) {\n  width: 80px;\n  max-width: 11vw;\n}\n.cam-table.process-definitions-list.search-results th:last-child, .cam-table.process-definitions-list.search-results td:last-child {\n  max-width: 3vw;\n}\n\n.dashboard section.deprecate {\n  margin-top: 0;\n}\n\n.decisions-dashboard .dashboard-view + .dashboard-view {\n  margin-top: -15px;\n}");

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

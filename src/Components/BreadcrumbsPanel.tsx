import React from 'react';

/**
 * Represents a single breadcrumb item in the navigation trail.
 */
export interface BreadcrumbItem {
  /** Display label for the breadcrumb */
  label: string;
  /** Optional href for link breadcrumbs. If omitted, renders as text. */
  href?: string;
  /** Optional suffix text to display after the label (e.g., ": instance-id : History") */
  suffix?: string;
}

/**
 * Props for BreadcrumbsPanel using flexible items array.
 */
interface BreadcrumbsPanelProps {
  /** Array of breadcrumb items to render */
  items: BreadcrumbItem[];
}

/**
 * Legacy props for process instance history view (backwards compatibility).
 */
interface LegacyBreadcrumbsPanelProps {
  processDefinitionId: string;
  processDefinitionName?: string | undefined;
  processInstanceId: string;
}

type Props = BreadcrumbsPanelProps | LegacyBreadcrumbsPanelProps;

/**
 * Type guard to check if props are legacy format.
 * @param props - The props to check
 * @returns True if props use the legacy format
 */
function isLegacyProps(props: Props): props is LegacyBreadcrumbsPanelProps {
  return 'processDefinitionId' in props;
}

/**
 * Converts legacy props to breadcrumb items array.
 * @param props - Legacy props with process definition/instance info
 * @returns Array of breadcrumb items
 */
function convertLegacyProps(props: LegacyBreadcrumbsPanelProps): BreadcrumbItem[] {
  return [
    { label: 'Dashboard', href: '#/' },
    { label: 'Processes', href: '#/processes/' },
    {
      label: props.processDefinitionName ?? props.processDefinitionId,
      href: `#/process-definition/${props.processDefinitionId}/runtime`,
      suffix: `${props.processInstanceId} : History`,
    },
  ];
}

/**
 * Breadcrumbs navigation panel component.
 *
 * Supports two usage patterns:
 *
 * 1. **Flexible items array** (recommended for new code):
 * ```tsx
 * <BreadcrumbsPanel items={[
 *   { label: 'Dashboard', href: '#/' },
 *   { label: 'Authorizations' },
 * ]} />
 * ```
 *
 * 2. **Legacy props** (for backwards compatibility with instance-route-history):
 * ```tsx
 * <BreadcrumbsPanel
 *   processDefinitionId="my-process:1"
 *   processDefinitionName="My Process"
 *   processInstanceId="instance-123"
 * />
 * ```
 */
const BreadcrumbsPanel: React.FC<Props> = props => {
  // eslint-disable-next-line react/destructuring-assignment -- Type guard requires direct props access
  const items = isLegacyProps(props) ? convertLegacyProps(props) : props.items;

  return (
    <div className="breadcrumbs-panel" cam-breadcrumbs-panel="">
      <ul className="cam-breadcrumb">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const hasHref = Boolean(item.href);
          const shouldRenderAsLink = hasHref && !isLast;

          return (
            // eslint-disable-next-line react/no-array-index-key -- Breadcrumb items are stable and have no unique ID
            <li key={index} className={isLast ? 'active' : undefined}>
              {index > 0 && (
                <>
                  {/* Non-breaking space after divider to mimic AngularJS breadcrumbs whitespace */}
                  <span className="divider">»</span>
                  {'\u00A0'}
                </>
              )}
              {shouldRenderAsLink ? (
                <a className="text" href={item.href}>
                  {item.label}
                </a>
              ) : (
                <span className="text">{item.label}</span>
              )}
              {/* Extra whitespace after first label to mimic AngularJS breadcrumbs rendering */}
              {index === 0 && '\u00A0'}
              {item.suffix && (
                <>
                  {/* Non-breaking spaces around suffix divider to mimic AngularJS breadcrumbs whitespace */}
                  {'\u00A0'}
                  <span className="divider">:</span>
                  {'\u00A0'}
                  {item.suffix}
                </>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BreadcrumbsPanel;

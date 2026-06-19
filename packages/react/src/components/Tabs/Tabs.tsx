import {
  Children,
  forwardRef,
  type HTMLAttributes,
  isValidElement,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  useRef,
  useState,
} from 'react';
import { cls, useNamespace } from '../../utils';
import { Icon } from '../Icon';
import { TabPane, type TabPaneProps } from './TabPane';

export type TabsType = 'line' | 'card' | 'border-card';

export type TabPosition = 'top' | 'right' | 'bottom' | 'left';

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Active tab name (controlled). */
  value?: string;
  /** Initial active tab name (uncontrolled). */
  defaultValue?: string;
  /** Fired when the active tab changes. */
  onChange?: (name: string) => void;
  /** Visual style of the tabs. */
  type?: TabsType;
  /** Position of the tab header relative to the content. */
  tabPosition?: TabPosition;
  /** Show a close button on every tab. */
  closable?: boolean;
  /** Show an "add tab" button. */
  addable?: boolean;
  /** Shorthand to enable both `addable` and `closable`. */
  editable?: boolean;
  /** Stretch tabs to fill the available width. */
  stretch?: boolean;
  /** Fired when a tab header is clicked (even if already active). */
  onTabClick?: (name: string) => void;
  /** Fired when a tab's close button is clicked. */
  onTabRemove?: (name: string) => void;
  /** Fired when the add button is clicked. */
  onTabAdd?: () => void;
  children?: ReactNode;
}

interface PaneMeta {
  name: string;
  label: ReactNode;
  disabled: boolean;
  closable: boolean;
  lazy: boolean;
  element: ReactElement<TabPaneProps>;
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="currentColor"
        d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
      />
    </svg>
  );
}

function AddIcon() {
  return (
    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="currentColor"
        d="M480 480V128a32 32 0 0 1 64 0v352h352a32 32 0 1 1 0 64H544v352a32 32 0 1 1-64 0V544H128a32 32 0 0 1 0-64z"
      />
    </svg>
  );
}

function isTabPane(child: ReactNode): child is ReactElement<TabPaneProps> {
  return isValidElement(child) && child.type === TabPane;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(props, ref) {
  const {
    value,
    defaultValue,
    onChange,
    type = 'line',
    tabPosition = 'top',
    closable = false,
    addable = false,
    editable = false,
    stretch = false,
    onTabClick,
    onTabRemove,
    onTabAdd,
    className,
    children,
    ...rest
  } = props;

  const ns = useNamespace('tabs');

  const panes: PaneMeta[] = [];
  Children.forEach(children, (child) => {
    if (!isTabPane(child)) {
      return;
    }
    const p = child.props;
    panes.push({
      name: p.name,
      label: p.label ?? p.name,
      disabled: p.disabled ?? false,
      closable: p.closable ?? false,
      lazy: p.lazy ?? false,
      element: child,
    });
  });

  const firstName = panes[0]?.name ?? '';
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(defaultValue ?? firstName);
  const active = isControlled ? value : internalValue;

  // Track which lazy panes have been activated so their content is mounted once.
  const mountedRef = useRef<Set<string>>(new Set());
  if (active) {
    mountedRef.current.add(active);
  }

  const showAdd = addable || editable;
  const allClosable = closable || editable;
  const isVertical = tabPosition === 'left' || tabPosition === 'right';

  // Roving tabindex: exactly one tab is in the focus order. That is the active
  // tab when it is enabled, otherwise the first enabled tab (so keyboard users
  // can still reach the tablist even if the active tab is disabled).
  const activePane = panes.find((pane) => pane.name === active && !pane.disabled);
  const rovingName = activePane?.name ?? panes.find((pane) => !pane.disabled)?.name;

  // Refs to every tab header element, keyed by pane name, for roving focus.
  const tabRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const selectTab = (name: string, disabled: boolean) => {
    if (disabled) {
      return;
    }
    onTabClick?.(name);
    if (name === active) {
      return;
    }
    if (!isControlled) {
      setInternalValue(name);
    }
    onChange?.(name);
  };

  const removeTab = (name: string) => {
    onTabRemove?.(name);
  };

  // Move focus to (and activate) a tab starting at `index`, skipping disabled
  // tabs in `step` direction and wrapping around. Bails out if all are disabled.
  const focusTabAt = (index: number, step: 1 | -1) => {
    const total = panes.length;
    if (total === 0) {
      return;
    }
    let next = ((index % total) + total) % total;
    for (let i = 0; i < total; i += 1) {
      const candidate = panes[next];
      if (candidate && !candidate.disabled) {
        tabRefs.current.get(candidate.name)?.focus();
        selectTab(candidate.name, candidate.disabled);
        return;
      }
      next = (((next + step) % total) + total) % total;
    }
  };

  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>, index: number) => {
    const prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';
    const nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
    switch (event.key) {
      case prevKey:
        event.preventDefault();
        focusTabAt(index - 1, -1);
        break;
      case nextKey:
        event.preventDefault();
        focusTabAt(index + 1, 1);
        break;
      case 'Home':
        event.preventDefault();
        focusTabAt(0, 1);
        break;
      case 'End':
        event.preventDefault();
        focusTabAt(panes.length - 1, -1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        selectTab(panes[index]?.name ?? '', panes[index]?.disabled ?? false);
        break;
      default:
        break;
    }
  };

  const classes = cls(
    ns.b(),
    ns.m(type),
    ns.m(`position-${tabPosition}`),
    ns.is('stretch', stretch),
    className,
  );

  return (
    <div ref={ref} className={classes} {...rest}>
      <div className={ns.e('header')}>
        <div
          className={ns.e('nav')}
          role="tablist"
          aria-orientation={isVertical ? 'vertical' : 'horizontal'}
        >
          {panes.map((pane, index) => {
            const isActive = pane.name === active;
            const paneClosable = type !== 'border-card' && (allClosable || pane.closable);
            return (
              <div
                key={pane.name}
                ref={(el) => {
                  if (el) {
                    tabRefs.current.set(pane.name, el);
                  } else {
                    tabRefs.current.delete(pane.name);
                  }
                }}
                role="tab"
                id={`${ns.b()}-tab-${pane.name}`}
                aria-selected={isActive}
                aria-disabled={pane.disabled || undefined}
                aria-controls={`${ns.b()}-panel-${pane.name}`}
                tabIndex={pane.name === rovingName ? 0 : -1}
                className={cls(
                  ns.e('item'),
                  ns.is('active', isActive),
                  ns.is('disabled', pane.disabled),
                  ns.is('closable', paneClosable),
                )}
                onClick={() => selectTab(pane.name, pane.disabled)}
                onKeyDown={(event) => onTabKeyDown(event, index)}
              >
                <span className={ns.e('label')}>{pane.label}</span>
                {paneClosable && (
                  <button
                    type="button"
                    className={ns.e('close')}
                    aria-label="Close tab"
                    onClick={(event) => {
                      event.stopPropagation();
                      removeTab(pane.name);
                    }}
                    onKeyDown={(event) => {
                      // Keep tab-level arrow/Home/End navigation from firing,
                      // and activate the close control on Enter/Space.
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        event.stopPropagation();
                        removeTab(pane.name);
                      }
                    }}
                  >
                    <Icon aria-hidden="true">
                      <CloseIcon />
                    </Icon>
                  </button>
                )}
              </div>
            );
          })}
          {type === 'line' && (
            <span className={ns.e('active-bar')} aria-hidden="true" />
          )}
        </div>
        {showAdd && (
          <button
            type="button"
            className={ns.e('add')}
            aria-label="Add tab"
            onClick={() => onTabAdd?.()}
          >
            <Icon>
              <AddIcon />
            </Icon>
          </button>
        )}
      </div>
      <div className={ns.e('content')}>
        {panes.map((pane) => {
          const isActive = pane.name === active;
          if (pane.lazy && !isActive && !mountedRef.current.has(pane.name)) {
            return null;
          }
          return (
            <div
              key={pane.name}
              role="tabpanel"
              id={`${ns.b()}-panel-${pane.name}`}
              aria-labelledby={`${ns.b()}-tab-${pane.name}`}
              hidden={!isActive}
              className={cls(ns.e('pane'), ns.is('active', isActive))}
            >
              {pane.element.props.children}
            </div>
          );
        })}
      </div>
    </div>
  );
});

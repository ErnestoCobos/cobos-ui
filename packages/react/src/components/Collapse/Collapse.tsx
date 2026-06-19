import {
  createContext,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { cls, useNamespace } from '../../utils';

export type CollapseName = string | number;
export type CollapseValue = CollapseName | CollapseName[];

export interface CollapseContextValue {
  /** Names of the currently open items. */
  activeNames: CollapseName[];
  /** Toggle an item's open state by name. */
  toggle: (name: CollapseName) => void;
}

export const CollapseContext = createContext<CollapseContextValue | null>(null);

/** Access the nearest Collapse context. Returns `null` outside a Collapse. */
export function useCollapseContext(): CollapseContextValue | null {
  return useContext(CollapseContext);
}

export interface CollapseProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'value' | 'defaultValue'> {
  /** Open item name(s) (controlled). */
  value?: CollapseValue;
  /** Initial open item name(s) (uncontrolled). */
  defaultValue?: CollapseValue;
  /** Fired when the set of open items changes. */
  onChange?: (value: CollapseValue) => void;
  /** Allow only one item open at a time. */
  accordion?: boolean;
  /** `CollapseItem` elements. */
  children?: ReactNode;
}

/** Normalise a value into an array of names. */
function toArray(value: CollapseValue | undefined): CollapseName[] {
  if (value === undefined || value === null) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

export const Collapse = forwardRef<HTMLDivElement, CollapseProps>(function Collapse(props, ref) {
  const {
    value,
    defaultValue,
    onChange,
    accordion = false,
    className,
    children,
    ...rest
  } = props;

  const ns = useNamespace('collapse');

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<CollapseName[]>(() => toArray(defaultValue));
  const activeNames = isControlled ? toArray(value) : internalValue;

  const emit = useCallback(
    (next: CollapseName[]) => {
      if (!isControlled) {
        setInternalValue(next);
      }
      // Accordion exposes a single name; otherwise the full array of open names.
      onChange?.(accordion ? (next[0] ?? '') : next);
    },
    [accordion, isControlled, onChange],
  );

  const toggle = useCallback(
    (name: CollapseName) => {
      const isOpen = activeNames.includes(name);
      if (accordion) {
        emit(isOpen ? [] : [name]);
        return;
      }
      emit(isOpen ? activeNames.filter((item) => item !== name) : [...activeNames, name]);
    },
    [accordion, activeNames, emit],
  );

  const context = useMemo<CollapseContextValue>(
    () => ({ activeNames, toggle }),
    [activeNames, toggle],
  );

  const classes = cls(ns.b(), ns.is('accordion', accordion), className);

  return (
    <CollapseContext.Provider value={context}>
      <div ref={ref} className={classes} {...rest}>
        {children}
      </div>
    </CollapseContext.Provider>
  );
});

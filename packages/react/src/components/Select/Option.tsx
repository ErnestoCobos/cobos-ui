import { createContext, type ReactNode, useContext } from 'react';
import { cls, useNamespace } from '../../utils';

/** A single selectable value. */
export type SelectValue = string | number;

export interface OptionProps {
  /** The value committed when this option is chosen. */
  value: SelectValue;
  /** Display label. Defaults to the text of `children`. */
  label?: string;
  /** Disable selecting this option. */
  disabled?: boolean;
  /** Custom content; falls back to `label` or `value`. */
  children?: ReactNode;
}

export interface SelectContextValue {
  /** Currently selected value(s). */
  selectedValues: SelectValue[];
  /** Whether a given value is selected. */
  isSelected: (value: SelectValue) => boolean;
  /** Commit a value (toggle in multiple mode). */
  onSelect: (value: SelectValue) => void;
  /** Multiple-selection mode. */
  multiple: boolean;
  /** Current filter query (filterable mode). */
  query: string;
  /** Value currently highlighted by keyboard navigation. */
  hoveringValue: SelectValue | null;
  /** Build the stable DOM id for an option, scoped to this Select instance. */
  optionId: (value: SelectValue) => string;
}

export const SelectContext = createContext<SelectContextValue | null>(null);

/**
 * `Option` renders only inside a `Select`. The parent reads its props to build
 * the dropdown list, so it can also be rendered directly when a context exists.
 */
export function Option(props: OptionProps) {
  const { value, label, disabled = false, children } = props;
  const ns = useNamespace('select-dropdown');
  const context = useContext(SelectContext);

  if (!context) {
    return null;
  }

  const selected = context.isSelected(value);
  const hovering = context.hoveringValue === value;

  const classes = cls(
    ns.e('item'),
    ns.is('selected', selected),
    ns.is('hovering', hovering),
    ns.is('disabled', disabled),
  );

  return (
    <li
      id={context.optionId(value)}
      role="option"
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      className={classes}
      onClick={() => {
        if (!disabled) {
          context.onSelect(value);
        }
      }}
    >
      <span>{children ?? label ?? String(value)}</span>
    </li>
  );
}

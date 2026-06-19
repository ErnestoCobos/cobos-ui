import {
  Children,
  type CSSProperties,
  forwardRef,
  isValidElement,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  useId,
  useMemo,
  useState,
} from 'react';
import { cls, useNamespace } from '../../utils';
import { type ComponentSize, useDisabled, useSize } from '../../config-provider';
import { Popper } from '../Overlay';
import { Option, type OptionProps, SelectContext, type SelectValue } from './Option';

export interface SelectProps {
  /** Controlled value. Array when `multiple`. */
  value?: SelectValue | SelectValue[];
  /** Initial value for the uncontrolled mode. */
  defaultValue?: SelectValue | SelectValue[];
  /** Fired with the next value whenever the selection changes. */
  onChange?: (value: SelectValue | SelectValue[]) => void;
  /** Allow selecting multiple values, rendered as removable tags. */
  multiple?: boolean;
  /** Disable the control. */
  disabled?: boolean;
  /** Show a clear button when there is a value. */
  clearable?: boolean;
  /** Allow typing to filter the options. */
  filterable?: boolean;
  /** Placeholder shown when nothing is selected. */
  placeholder?: string;
  /** Size. Falls back to the nearest ConfigProvider. */
  size?: ComponentSize;
  /** Show a loading hint inside the dropdown. */
  loading?: boolean;
  /** Text shown when there are no options. */
  noDataText?: string;
  /** Text shown when the query matches no options. */
  noMatchText?: string;
  /** Native `name` attribute, mirrored to a hidden input. */
  name?: string;
  /** Accessible name for the `combobox` role. */
  'aria-label'?: string;
  /** ID of the element labelling the `combobox` role. */
  'aria-labelledby'?: string;
  /** Fired when the dropdown opens or closes. */
  onVisibleChange?: (visible: boolean) => void;
  /** Fired when the clear button is pressed. */
  onClear?: () => void;
  /** Fired when a tag is removed in multiple mode. */
  onRemoveTag?: (value: SelectValue) => void;
  /** Extra class on the root element. */
  className?: string;
  /** Extra style on the root element. */
  style?: CSSProperties;
  /** `Option` elements. */
  children?: ReactNode;
}

interface OptionMeta {
  value: SelectValue;
  label: string;
  disabled: boolean;
  element: ReactElement<OptionProps>;
}

function CaretIcon() {
  return (
    <svg viewBox="0 0 1024 1024" width="1em" height="1em" aria-hidden="true">
      <path
        fill="currentColor"
        d="M831.872 340.864 512 652.672 192.128 340.864a30.592 30.592 0 0 0-42.752 0 29.12 29.12 0 0 0 0 41.6L489.664 714.24a32 32 0 0 0 44.672 0l340.288-331.776a29.12 29.12 0 0 0 0-41.6 30.592 30.592 0 0 0-42.752 0z"
      />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg viewBox="0 0 1024 1024" width="1em" height="1em" aria-hidden="true">
      <path
        fill="currentColor"
        d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm0 393.664L407.936 353.6a38.4 38.4 0 1 0-54.336 54.336L457.664 512 353.6 616.064a38.4 38.4 0 1 0 54.336 54.336L512 566.336 616.064 670.4a38.4 38.4 0 1 0 54.336-54.336L566.336 512 670.4 407.936a38.4 38.4 0 1 0-54.336-54.336L512 457.664z"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 10.586 6.707 5.293a1 1 0 0 0-1.414 1.414L10.586 12l-5.293 5.293a1 1 0 1 0 1.414 1.414L12 13.414l5.293 5.293a1 1 0 0 0 1.414-1.414L13.414 12l5.293-5.293a1 1 0 0 0-1.414-1.414L12 10.586Z"
      />
    </svg>
  );
}

function isOption(child: ReactNode): child is ReactElement<OptionProps> {
  return isValidElement(child) && child.type === Option;
}

function reactNodeToText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === 'boolean') {
    return '';
  }
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(reactNodeToText).join('');
  }
  if (isValidElement(node)) {
    return reactNodeToText((node.props as { children?: ReactNode }).children);
  }
  return '';
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(function Select(props, ref) {
  const {
    value,
    defaultValue,
    onChange,
    multiple = false,
    disabled: disabledProp,
    clearable = false,
    filterable = false,
    placeholder = 'Select',
    size: sizeProp,
    loading = false,
    noDataText = 'No data',
    noMatchText = 'No matching data',
    name,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    onVisibleChange,
    onClear,
    onRemoveTag,
    className,
    style,
    children,
  } = props;

  const ns = useNamespace('select');
  const size = useSize(sizeProp);
  const disabled = useDisabled(disabledProp);

  // Stable, instance-scoped prefix so every Option gets a unique DOM id that
  // `aria-activedescendant` on the combobox can point at, plus an id for the
  // listbox the combobox controls.
  const instanceId = useId();
  const listboxId = `${ns.b()}-${instanceId}-listbox`;
  const optionId = (val: SelectValue) =>
    `${ns.b()}-${instanceId}-option-${String(val)}`;

  const isControlled = value !== undefined;
  const [inner, setInner] = useState<SelectValue | SelectValue[] | undefined>(defaultValue);
  const current = isControlled ? value : inner;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [hovering, setHovering] = useState(false);
  const [hoveringValue, setHoveringValue] = useState<SelectValue | null>(null);

  // Read the Option children once per render to build the list.
  const options = useMemo<OptionMeta[]>(() => {
    const list: OptionMeta[] = [];
    Children.forEach(children, (child) => {
      if (!isOption(child)) {
        return;
      }
      const p = child.props;
      list.push({
        value: p.value,
        label: p.label ?? reactNodeToText(p.children) ?? String(p.value),
        disabled: p.disabled ?? false,
        element: child,
      });
    });
    return list;
  }, [children]);

  const selectedValues = useMemo<SelectValue[]>(() => {
    if (current === undefined || current === null || current === '') {
      return [];
    }
    return Array.isArray(current) ? current : [current];
  }, [current]);

  const isSelected = (val: SelectValue) => selectedValues.includes(val);

  const labelOf = (val: SelectValue): string =>
    options.find((option) => option.value === val)?.label ?? String(val);

  const hasValue = selectedValues.length > 0;

  const filtered = useMemo<OptionMeta[]>(() => {
    if (!filterable || query === '') {
      return options;
    }
    const needle = query.toLowerCase();
    return options.filter((option) => option.label.toLowerCase().includes(needle));
  }, [filterable, query, options]);

  const changeOpen = (next: boolean) => {
    if (next === open) {
      return;
    }
    setOpen(next);
    onVisibleChange?.(next);
    if (!next) {
      setQuery('');
      setHoveringValue(null);
    }
  };

  const commit = (next: SelectValue | SelectValue[]) => {
    if (!isControlled) {
      setInner(next);
    }
    onChange?.(next);
  };

  const handleSelect = (val: SelectValue) => {
    if (multiple) {
      const set = selectedValues.includes(val)
        ? selectedValues.filter((item) => item !== val)
        : [...selectedValues, val];
      commit(set);
      if (filterable) {
        setQuery('');
      }
      // Keep the dropdown open while picking multiple values.
    } else {
      commit(val);
      changeOpen(false);
    }
  };

  const handleRemoveTag = (val: SelectValue) => {
    const set = selectedValues.filter((item) => item !== val);
    commit(set);
    onRemoveTag?.(val);
  };

  const handleClear = () => {
    commit(multiple ? [] : ('' as SelectValue));
    setQuery('');
    onClear?.();
  };

  const moveHover = (delta: number) => {
    const enabled = filtered.filter((option) => !option.disabled);
    if (enabled.length === 0) {
      return;
    }
    const currentIndex = enabled.findIndex((option) => option.value === hoveringValue);
    const nextIndex =
      currentIndex === -1
        ? delta > 0
          ? 0
          : enabled.length - 1
        : (currentIndex + delta + enabled.length) % enabled.length;
    setHoveringValue(enabled[nextIndex].value);
  };

  // Highlight the first enabled option, used when ArrowDown opens the dropdown
  // so the keyboard highlight is exposed via aria-activedescendant immediately.
  const highlightFirst = () => {
    const enabled = filtered.filter((option) => !option.disabled);
    if (enabled.length > 0) {
      setHoveringValue(enabled[0].value);
    }
  };

  // Highlight the last enabled option, used when ArrowUp opens the dropdown.
  const highlightLast = () => {
    const enabled = filtered.filter((option) => !option.disabled);
    if (enabled.length > 0) {
      setHoveringValue(enabled[enabled.length - 1].value);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) {
      return;
    }
    switch (event.key) {
      case 'Enter':
      case ' ': {
        if (event.key === ' ' && filterable && open) {
          // Allow typing spaces in the filter input.
          return;
        }
        event.preventDefault();
        if (!open) {
          changeOpen(true);
        } else if (hoveringValue !== null) {
          const target = filtered.find((option) => option.value === hoveringValue);
          if (target && !target.disabled) {
            handleSelect(target.value);
          }
        }
        break;
      }
      case 'ArrowDown': {
        event.preventDefault();
        if (!open) {
          changeOpen(true);
          // Land on the first option, matching the standard combobox pattern.
          highlightFirst();
        } else {
          moveHover(1);
        }
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        if (!open) {
          changeOpen(true);
          // Land on the last option, matching the standard combobox pattern.
          highlightLast();
        } else {
          moveHover(-1);
        }
        break;
      }
      case 'Escape': {
        if (open) {
          event.preventDefault();
          changeOpen(false);
        }
        break;
      }
      default:
        break;
    }
  };

  const showClear = clearable && !disabled && hovering && hasValue;

  const rootClasses = cls(
    ns.b(),
    size !== 'default' && ns.m(size),
    ns.is('disabled', disabled),
    ns.is('opened', open),
    ns.is('filterable', filterable),
    ns.is('multiple', multiple),
    className,
  );

  const wrapperClasses = cls(
    ns.e('wrapper'),
    ns.is('focus', open),
    ns.is('disabled', disabled),
  );

  const renderSelection = () => {
    if (multiple && hasValue) {
      return (
        <span className={ns.e('tags')}>
          {selectedValues.map((val) => (
            <span key={String(val)} className={ns.e('tag')}>
              <span className={ns.e('tag-text')}>{labelOf(val)}</span>
              {!disabled && (
                <button
                  type="button"
                  className={ns.e('tag-close')}
                  aria-label={`Remove ${labelOf(val)}`}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={(event) => {
                    event.stopPropagation();
                    handleRemoveTag(val);
                  }}
                >
                  <CloseIcon />
                </button>
              )}
            </span>
          ))}
          {filterable && (
            <input
              className={ns.e('input')}
              value={query}
              disabled={disabled}
              autoComplete="off"
              onChange={(event) => {
                setQuery(event.target.value);
                if (!open) {
                  changeOpen(true);
                }
              }}
              onClick={(event) => event.stopPropagation()}
              onMouseDown={(event) => event.stopPropagation()}
            />
          )}
        </span>
      );
    }

    if (filterable && open) {
      return (
        <input
          className={ns.e('input')}
          value={query}
          placeholder={hasValue ? labelOf(selectedValues[0]) : placeholder}
          disabled={disabled}
          autoComplete="off"
          autoFocus
          onChange={(event) => setQuery(event.target.value)}
          onClick={(event) => event.stopPropagation()}
        />
      );
    }

    if (hasValue) {
      return <span className={ns.e('selected')}>{labelOf(selectedValues[0])}</span>;
    }

    return <span className={ns.e('placeholder')}>{placeholder}</span>;
  };

  const trigger = (
    <div
      ref={ref}
      className={rootClasses}
      style={style}
      role="combobox"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-controls={open ? listboxId : undefined}
      aria-activedescendant={
        open && hoveringValue !== null ? optionId(hoveringValue) : undefined
      }
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      onClick={() => {
        if (!disabled) {
          changeOpen(!open);
        }
      }}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className={wrapperClasses}>
        {renderSelection()}
        <span className={ns.e('suffix')}>
          {showClear ? (
            <span
              className={cls(ns.e('icon'), ns.e('clear'))}
              role="button"
              aria-label="Clear"
              onMouseDown={(event) => event.preventDefault()}
              onClick={(event) => {
                event.stopPropagation();
                handleClear();
              }}
            >
              <ClearIcon />
            </span>
          ) : (
            <span className={cls(ns.e('icon'), ns.e('caret'), ns.is('reverse', open))}>
              <CaretIcon />
            </span>
          )}
        </span>
      </div>
      {name && (
        <input
          type="hidden"
          name={name}
          value={multiple ? selectedValues.join(',') : (selectedValues[0] ?? '')}
        />
      )}
    </div>
  );

  const contextValue = {
    selectedValues,
    isSelected,
    onSelect: handleSelect,
    multiple,
    query,
    hoveringValue,
    optionId,
  };

  // The inner `<ul>` is the single source of `role="listbox"`. The shared
  // Popper renders a neutral floating shell (role="tooltip", which adds no
  // listbox/menu semantics), so exactly one listbox exists in the tree. The
  // combobox is linked to it explicitly via `aria-controls`.
  const dropdown = (
    <SelectContext.Provider value={contextValue}>
      <ul
        id={listboxId}
        className={ns.b('dropdown__list')}
        role="listbox"
        aria-multiselectable={multiple || undefined}
      >
        {loading ? (
          <li className={ns.b('dropdown__empty')}>Loading</li>
        ) : filtered.length === 0 ? (
          <li className={ns.b('dropdown__empty')}>
            {options.length === 0 ? noDataText : noMatchText}
          </li>
        ) : (
          filtered.map((option) => option.element)
        )}
      </ul>
    </SelectContext.Provider>
  );

  return (
    <Popper
      reference={trigger}
      trigger="manual"
      open={open}
      onOpenChange={changeOpen}
      placement="bottom-start"
      offset={4}
      matchWidth
      role="tooltip"
      disabled={disabled}
      popperClass={ns.e('popper')}
    >
      {dropdown}
    </Popper>
  );
});

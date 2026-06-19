import {
  Children,
  cloneElement,
  type CSSProperties,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { cls, useNamespace } from '../../utils';
import { type ComponentSize } from '../../config-provider';
import { FormContext, type FormRule } from './Form';

export interface FormItemProps {
  /** Label content rendered before the control. */
  label?: ReactNode;
  /** Key in the form `model` this item is bound to. */
  prop?: string;
  /** Force the required asterisk regardless of rules. */
  required?: boolean;
  /** Validation rules for this item; falls back to `form.rules[prop]`. */
  rules?: FormRule | FormRule[];
  /** Manual error message override; takes precedence over validation. */
  error?: string;
  /** Whether to show the validation message. Falls back to the Form. */
  showMessage?: boolean;
  /** Label column width; overrides the Form's `labelWidth`. */
  labelWidth?: string | number;
  /** Native `for` attribute applied to the label. */
  for?: string;
  /** Size; falls back to the Form, then the nearest ConfigProvider. */
  size?: ComponentSize;
  /** Extra class on the root element. */
  className?: string;
  /** Extra style on the root element. */
  style?: CSSProperties;
  children?: ReactNode;
}

const EMAIL_PATTERN = /^[\w.!#$%&'*+/=?^`{|}~-]+@[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)*$/i;
const URL_PATTERN = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(:\d+)?(\/[\w./?%&=#-]*)?$/i;

function isEmpty(value: unknown): boolean {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

function measure(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return value.length;
  if (Array.isArray(value)) return value.length;
  return Number.NaN;
}

function checkType(value: unknown, type: NonNullable<FormRule['type']>): boolean {
  switch (type) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number' && Number.isFinite(value);
    case 'email':
      return typeof value === 'string' && EMAIL_PATTERN.test(value);
    case 'url':
      return typeof value === 'string' && URL_PATTERN.test(value);
    case 'array':
      return Array.isArray(value);
    default:
      return true;
  }
}

/** Validate a single value against a list of rules; resolves the first error message or null. */
export async function runRules(value: unknown, rules: FormRule[]): Promise<string | null> {
  for (const rule of rules) {
    if (rule.required && isEmpty(value)) {
      return rule.message ?? 'This field is required';
    }

    // Skip the remaining checks for empty optional values.
    if (isEmpty(value) && !rule.required) {
      if (rule.validator) {
        const result = await rule.validator(value);
        if (typeof result === 'string') return result;
      }
      continue;
    }

    if (rule.type && !checkType(value, rule.type)) {
      return rule.message ?? `Please enter a valid ${rule.type}`;
    }

    if (rule.len !== undefined) {
      const size = measure(value);
      if (Number.isFinite(size) && size !== rule.len) {
        return rule.message ?? `Length must be exactly ${rule.len}`;
      }
    }

    if (rule.min !== undefined) {
      const size = measure(value);
      if (Number.isFinite(size) && size < rule.min) {
        return rule.message ?? `Must be at least ${rule.min}`;
      }
    }

    if (rule.max !== undefined) {
      const size = measure(value);
      if (Number.isFinite(size) && size > rule.max) {
        return rule.message ?? `Must be at most ${rule.max}`;
      }
    }

    if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
      return rule.message ?? 'Invalid format';
    }

    if (rule.validator) {
      const result = await rule.validator(value);
      if (typeof result === 'string') return result;
    }
  }

  return null;
}

export const FormItem = forwardRef<HTMLDivElement, FormItemProps>(function FormItem(props, ref) {
  const {
    label,
    prop,
    required,
    rules,
    error,
    showMessage: showMessageProp,
    labelWidth,
    for: htmlFor,
    size: sizeProp,
    className,
    style,
    children,
  } = props;

  const ns = useNamespace('form-item');
  const form = useContext(FormContext);

  const [validateMessage, setValidateMessage] = useState('');
  const [validateState, setValidateState] = useState<'' | 'error' | 'success'>('');

  const size = sizeProp ?? form?.size;
  const showMessage = showMessageProp ?? form?.showMessage ?? true;

  const effectiveRules = useMemo<FormRule[]>(() => {
    const own = rules ? (Array.isArray(rules) ? rules : [rules]) : undefined;
    const fromForm =
      prop && form?.rules?.[prop]
        ? Array.isArray(form.rules[prop])
          ? (form.rules[prop] as FormRule[])
          : [form.rules[prop] as FormRule]
        : undefined;
    const list = own ?? fromForm ?? [];
    if (required && !list.some((rule) => rule.required)) {
      return [{ required: true }, ...list];
    }
    return list;
  }, [rules, prop, form?.rules, required]);

  const isRequired = required || effectiveRules.some((rule) => rule.required);

  // Keep the latest values available to the imperative callbacks without re-registering.
  const stateRef = useRef({ effectiveRules, prop, error });
  stateRef.current = { effectiveRules, prop, error };

  const validate = useMemo(() => {
    return async (trigger?: 'blur' | 'change'): Promise<boolean> => {
      const { effectiveRules: currentRules, prop: currentProp, error: currentError } =
        stateRef.current;

      if (currentError !== undefined && currentError !== '') {
        setValidateState('error');
        setValidateMessage(currentError);
        return false;
      }

      if (!currentProp || currentRules.length === 0) {
        setValidateState('');
        setValidateMessage('');
        return true;
      }

      const applicable = trigger
        ? currentRules.filter((rule) => !rule.trigger || rule.trigger === trigger)
        : currentRules;
      if (applicable.length === 0) return true;

      const value = form?.model?.[currentProp];
      const message = await runRules(value, applicable);
      if (message) {
        setValidateState('error');
        setValidateMessage(message);
        return false;
      }
      setValidateState('success');
      setValidateMessage('');
      return true;
    };
  }, [form]);

  const clear = useMemo(() => {
    return () => {
      setValidateState('');
      setValidateMessage('');
    };
  }, []);

  useEffect(() => {
    if (!prop || !form) return undefined;
    form.registerItem({ prop, validate, clear, isRequired });
    return () => form.unregisterItem(prop);
  }, [prop, form, validate, clear, isRequired]);

  const displayError = error !== undefined && error !== '' ? error : validateMessage;
  const hasError = validateState === 'error' || (error !== undefined && error !== '');

  // Stable ids used to associate the label and error message with the control.
  const generatedId = useId();
  const errorId = `${generatedId}-error`;
  const labelId = `${generatedId}-label`;
  const showError = showMessage && hasError && displayError;

  // Whether a label with content is rendered. A label shown only to carry the
  // required asterisk has no text, so it cannot name the control.
  const hasLabel = label !== undefined && label !== null;

  // Resolve the id the control will actually carry, preferring (in order) the
  // child's own `id`, an explicit `for`, then a generated id. The label's
  // `htmlFor` is wired to the same id so clicking the label focuses the field.
  const childArray = Children.toArray(children);
  const onlyChild = childArray.length === 1 ? childArray[0] : null;
  const singleChild: ReactElement<Record<string, unknown>> | null = isValidElement(onlyChild)
    ? (onlyChild as ReactElement<Record<string, unknown>>)
    : null;
  const childId = singleChild ? (singleChild.props.id as string | undefined) : undefined;
  const controlId = childId ?? htmlFor ?? generatedId;

  // Associate the single element child with this item's label and error so that
  // clicking the label focuses the field and screen readers announce the name
  // and validation message. Custom widgets (Select's `role="combobox"`,
  // Switch's `role="switch"`, etc.) are not named by `htmlFor`/`id` the way
  // native labelable controls are, so the label id is also forwarded via
  // `aria-labelledby` (composed with any the child already has). Falls back to
  // rendering children untouched when there is no single bindable element
  // (e.g. multiple/text children).
  const boundChildren = useMemo<ReactNode>(() => {
    if (!singleChild) return children;
    const childProps = singleChild.props;
    return cloneElement(singleChild, {
      id: controlId,
      'aria-labelledby': hasLabel
        ? [childProps['aria-labelledby'], labelId].filter(Boolean).join(' ')
        : (childProps['aria-labelledby'] as string | undefined),
      'aria-invalid': hasError ? true : (childProps['aria-invalid'] as boolean | undefined),
      'aria-describedby': showError
        ? [childProps['aria-describedby'], errorId].filter(Boolean).join(' ')
        : (childProps['aria-describedby'] as string | undefined),
    });
  }, [singleChild, children, controlId, labelId, errorId, hasLabel, hasError, showError]);

  const classes = cls(
    ns.b(),
    size && size !== 'default' && ns.m(size),
    ns.is('required', isRequired),
    ns.is('error', hasError),
    ns.is('success', validateState === 'success'),
    ns.is('no-asterisk', form?.hideRequiredAsterisk ?? false),
    className,
  );

  const labelStyle: CSSProperties = {};
  const width = labelWidth ?? form?.labelWidth;
  if (width !== undefined && form?.labelPosition !== 'top') {
    labelStyle.width = typeof width === 'number' ? `${width}px` : width;
  }

  const labelText =
    typeof label === 'string' && form?.labelSuffix ? `${label}${form.labelSuffix}` : label;

  return (
    <div ref={ref} className={classes} style={style} data-form-prop={prop || undefined}>
      {hasLabel || isRequired ? (
        <label id={labelId} className={ns.e('label')} style={labelStyle} htmlFor={controlId}>
          {labelText}
        </label>
      ) : null}
      <div className={ns.e('content')}>
        {boundChildren}
        {showError ? (
          <div className={ns.e('error')} id={errorId} role="alert" aria-live="polite">
            {displayError}
          </div>
        ) : null}
      </div>
    </div>
  );
});

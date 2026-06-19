import {
  createContext,
  type CSSProperties,
  type FormEvent,
  forwardRef,
  type ReactNode,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { cls, useNamespace } from '../../utils';
import {
  type ComponentSize,
  ConfigProvider,
  useDisabled,
  useSize,
} from '../../config-provider';

export type FormLabelPosition = 'left' | 'right' | 'top';
export type FormRequireAsteriskPosition = 'left' | 'right';

/** A single validation rule, mirroring the pragmatic subset of Element Plus rules. */
export interface FormRule {
  /** The value must not be empty. */
  required?: boolean;
  /** Message shown when the rule fails; otherwise a sensible default is used. */
  message?: string;
  /** Minimum string length / array length / numeric value. */
  min?: number;
  /** Maximum string length / array length / numeric value. */
  max?: number;
  /** Exact string length / array length / numeric value. */
  len?: number;
  /** Regular expression the (string) value must match. */
  pattern?: RegExp;
  /** Built-in type check. */
  type?: 'string' | 'number' | 'email' | 'url' | 'array';
  /** Custom validator; return (or resolve) a message string to fail, or null/void to pass. */
  validator?: (value: unknown) => string | null | void | Promise<string | null | void>;
  /** When this rule should run during interaction-driven validation. */
  trigger?: 'blur' | 'change';
}

/** A registered FormItem, as seen by the Form. */
export interface FormItemEntry {
  prop: string;
  validate: (trigger?: 'blur' | 'change') => Promise<boolean>;
  clear: () => void;
  isRequired: boolean;
}

/** Imperative API exposed through the Form's ref. */
export interface FormInstance {
  /** Validate every registered field; resolves `true` when all pass. */
  validate: () => Promise<boolean>;
  /** Validate a single field by its `prop`. */
  validateField: (prop: string) => Promise<boolean>;
  /**
   * Clear every field's validation state (state + message). Because the Form
   * does not own the controlled `model`, this does not reset field values —
   * the consumer resets its own model. Equivalent to `clearValidate()`.
   */
  resetFields: () => void;
  /** Clear validation messages for the given prop(s), or all when omitted. */
  clearValidate: (props?: string | string[]) => void;
  /** Scroll the given field into view. */
  scrollToField?: (prop: string) => void;
}

export interface FormContextValue {
  model?: Record<string, unknown>;
  rules?: Record<string, FormRule | FormRule[]>;
  labelWidth?: string | number;
  labelPosition: FormLabelPosition;
  labelSuffix?: string;
  size?: ComponentSize;
  disabled: boolean;
  hideRequiredAsterisk: boolean;
  showMessage: boolean;
  registerItem: (entry: FormItemEntry) => void;
  unregisterItem: (prop: string) => void;
}

export const FormContext = createContext<FormContextValue | null>(null);

export interface FormProps {
  /** The values object the consumer keeps; fields read `model[prop]`. */
  model?: Record<string, unknown>;
  /** Rules keyed by `prop`. */
  rules?: Record<string, FormRule | FormRule[]>;
  /** Shared label column width. */
  labelWidth?: string | number;
  /** Label alignment. */
  labelPosition?: FormLabelPosition;
  /** Suffix appended to string labels (e.g. `:`). */
  labelSuffix?: string;
  /** Lay items out in a single row. */
  inline?: boolean;
  /** Size shared by descendant form items. */
  size?: ComponentSize;
  /** Disable every descendant control. */
  disabled?: boolean;
  /** Hide the required asterisk on labels. */
  hideRequiredAsterisk?: boolean;
  /** Side the required asterisk sits on. */
  requireAsteriskPosition?: FormRequireAsteriskPosition;
  /** Whether to render validation messages. */
  showMessage?: boolean;
  /** Scroll to the first errored field after a failed validate. */
  scrollToError?: boolean;
  /** Fired on native form submit. */
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  /** Extra class on the root element. */
  className?: string;
  /** Extra style on the root element. */
  style?: CSSProperties;
  children?: ReactNode;
}

export const Form = forwardRef<FormInstance, FormProps>(function Form(props, ref) {
  const {
    model,
    rules,
    labelWidth,
    labelPosition = 'right',
    labelSuffix,
    inline = false,
    size: sizeProp,
    disabled: disabledProp,
    hideRequiredAsterisk = false,
    requireAsteriskPosition = 'left',
    showMessage = true,
    scrollToError = false,
    onSubmit,
    className,
    style,
    children,
  } = props;

  const ns = useNamespace('form');
  const size = useSize(sizeProp);
  const disabled = useDisabled(disabledProp);

  const items = useRef(new Map<string, FormItemEntry>());

  const registerItem = useCallback((entry: FormItemEntry) => {
    items.current.set(entry.prop, entry);
  }, []);

  const unregisterItem = useCallback((prop: string) => {
    items.current.delete(prop);
  }, []);

  const scrollToField = useCallback((prop: string) => {
    if (typeof document === 'undefined') return;
    const node = document.querySelector(`[data-form-prop="${prop}"]`);
    node?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  const validate = useCallback(async (): Promise<boolean> => {
    const results = await Promise.all(
      [...items.current.values()].map((item) => item.validate()),
    );
    const valid = results.every(Boolean);
    if (!valid && scrollToError) {
      const firstFailed = [...items.current.values()].find((_, index) => !results[index]);
      if (firstFailed) scrollToField(firstFailed.prop);
    }
    return valid;
  }, [scrollToError, scrollToField]);

  const validateField = useCallback(async (prop: string): Promise<boolean> => {
    const item = items.current.get(prop);
    if (!item) return true;
    return item.validate();
  }, []);

  // The Form does not own the controlled `model`, so it cannot restore field
  // values; this clears validation state only (see FormInstance.resetFields).
  const resetFields = useCallback(() => {
    items.current.forEach((item) => item.clear());
  }, []);

  const clearValidate = useCallback((targets?: string | string[]) => {
    if (targets === undefined) {
      items.current.forEach((item) => item.clear());
      return;
    }
    const list = Array.isArray(targets) ? targets : [targets];
    list.forEach((prop) => items.current.get(prop)?.clear());
  }, []);

  useImperativeHandle(
    ref,
    (): FormInstance => ({
      validate,
      validateField,
      resetFields,
      clearValidate,
      scrollToField,
    }),
    [validate, validateField, resetFields, clearValidate, scrollToField],
  );

  const context = useMemo<FormContextValue>(
    () => ({
      model,
      rules,
      labelWidth,
      labelPosition,
      labelSuffix,
      size: sizeProp,
      disabled,
      hideRequiredAsterisk,
      showMessage,
      registerItem,
      unregisterItem,
    }),
    [
      model,
      rules,
      labelWidth,
      labelPosition,
      labelSuffix,
      sizeProp,
      disabled,
      hideRequiredAsterisk,
      showMessage,
      registerItem,
      unregisterItem,
    ],
  );

  const classes = cls(
    ns.b(),
    ns.m(`label-${labelPosition}`),
    size !== 'default' && ns.m(size),
    ns.is('inline', inline),
    ns.is('asterisk-right', requireAsteriskPosition === 'right'),
    className,
  );

  const rootStyle: CSSProperties = { ...style };
  if (labelWidth !== undefined) {
    (rootStyle as Record<string, string>)[ns.cssVar('label-width')] =
      typeof labelWidth === 'number' ? `${labelWidth}px` : labelWidth;
  }

  return (
    <FormContext.Provider value={context}>
      <form className={classes} style={rootStyle} onSubmit={onSubmit}>
        {/*
          Propagate `disabled` through the mechanism descendant controls
          actually read (ConfigProvider -> useDisabled). ConfigProvider composes
          `disabled` with its parent, so a child cannot re-enable itself.
        */}
        <ConfigProvider disabled={disabled}>{children}</ConfigProvider>
      </form>
    </FormContext.Provider>
  );
});

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cls, useNamespace } from '../../utils';

export type StepStatus = 'wait' | 'process' | 'finish' | 'error' | 'success';

export interface StepProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Step title. */
  title?: ReactNode;
  /** Step description shown below the title. */
  description?: ReactNode;
  /** Custom icon rendered inside the step marker (overrides the number/check). */
  icon?: ReactNode;
  /** Explicit status, overriding the value derived from `active`. */
  status?: StepStatus;
  children?: ReactNode;
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        fill="currentColor"
        d="M406.656 706.944 195.84 496.256a32 32 0 1 0-45.248 45.248l256 256 512-512a32 32 0 0 0-45.248-45.248L406.592 706.944z"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        fill="currentColor"
        d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"
      />
    </svg>
  );
}

/**
 * Internal props injected by `Steps` when it clones each child. Consumers only
 * supply `StepProps`; the layout-derived values below are computed by the parent.
 */
export interface StepInternalProps {
  /** Zero-based index of this step within `Steps`. */
  stepIndex?: number;
  /** Resolved status, after merging `active` position with any explicit `status`. */
  resolvedStatus?: StepStatus;
  /** Whether this step is the active (current) one. */
  isCurrent?: boolean;
  /** Whether a connector line should be rendered after this step. */
  hasLine?: boolean;
  /** Whether the connector line should be drawn as filled (finished). */
  lineFilled?: boolean;
  /** Layout direction inherited from `Steps`. */
  direction?: 'horizontal' | 'vertical';
  /** Center icon/title under each other (horizontal only). */
  alignCenter?: boolean;
  /** Simplified rendering without descriptions/connectors. */
  simple?: boolean;
  /** Flex basis applied to the step, from `Steps`' `space`. */
  spaceStyle?: string | number;
}

export const Step = forwardRef<HTMLDivElement, StepProps & StepInternalProps>(function Step(
  props,
  ref,
) {
  const {
    title,
    description,
    icon,
    // `status` is consumed by Steps to compute `resolvedStatus`; ignore it here.
    status: _status,
    stepIndex = 0,
    resolvedStatus = 'wait',
    isCurrent = false,
    hasLine = false,
    lineFilled = false,
    direction = 'horizontal',
    alignCenter = false,
    simple = false,
    spaceStyle,
    className,
    style,
    children,
    ...rest
  } = props;
  void _status;

  const ns = useNamespace('step');

  const classes = cls(
    ns.b(),
    ns.m(direction),
    ns.is(resolvedStatus),
    ns.is('center', alignCenter && direction === 'horizontal' && !simple),
    ns.is('simple', simple),
    ns.is('flex', spaceStyle !== undefined),
    className,
  );

  const mergedStyle =
    spaceStyle === undefined
      ? style
      : {
          flexBasis: typeof spaceStyle === 'number' ? `${spaceStyle}px` : spaceStyle,
          ...style,
        };

  let marker: ReactNode;
  if (icon) {
    marker = icon;
  } else if (resolvedStatus === 'finish' || resolvedStatus === 'success') {
    marker = <CheckIcon />;
  } else if (resolvedStatus === 'error') {
    marker = <CloseIcon />;
  } else {
    marker = stepIndex + 1;
  }

  return (
    <div
      ref={ref}
      className={classes}
      style={mergedStyle}
      role="listitem"
      aria-current={isCurrent ? 'step' : undefined}
      {...rest}
    >
      <div className={ns.e('head')}>
        <div className={ns.e('icon')} aria-hidden={icon ? undefined : true}>
          {marker}
        </div>
        {hasLine && !simple && (
          <div className={cls(ns.e('line'), ns.is('filled', lineFilled))} aria-hidden="true">
            <span className={ns.e('line-inner')} />
          </div>
        )}
      </div>
      <div className={ns.e('main')}>
        {title !== undefined && <div className={ns.e('title')}>{title}</div>}
        {!simple && description !== undefined && (
          <div className={ns.e('description')}>{description}</div>
        )}
        {children}
      </div>
    </div>
  );
});

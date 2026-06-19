import {
  Children,
  cloneElement,
  forwardRef,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cls, useNamespace } from '../../utils';
import { Step, type StepInternalProps, type StepProps, type StepStatus } from './Step';

export type StepsDirection = 'horizontal' | 'vertical';

export interface StepsProps extends HTMLAttributes<HTMLDivElement> {
  /** Index of the current (active) step. */
  active?: number;
  /** Layout direction. */
  direction?: StepsDirection;
  /** Center the icon and title under each other (horizontal only). */
  alignCenter?: boolean;
  /** Render a compact, simplified step bar. */
  simple?: boolean;
  /** Fixed spacing between steps (px number or any CSS length). */
  space?: number | string;
  /** Status applied to steps before the active one. */
  finishStatus?: StepStatus;
  /** Status applied to the active step. */
  processStatus?: StepStatus;
  /** `Step` elements. */
  children?: ReactNode;
}

function isStep(child: ReactNode): child is ReactElement<StepProps> {
  return isValidElement(child) && child.type === Step;
}

export const Steps = forwardRef<HTMLDivElement, StepsProps>(function Steps(props, ref) {
  const {
    active = 0,
    direction = 'horizontal',
    alignCenter = false,
    simple = false,
    space,
    finishStatus = 'finish',
    processStatus = 'process',
    className,
    children,
    ...rest
  } = props;

  const ns = useNamespace('steps');

  const steps = Children.toArray(children).filter(isStep);
  const total = steps.length;

  const classes = cls(
    ns.b(),
    ns.m(simple ? 'simple' : direction),
    ns.is('center', alignCenter && direction === 'horizontal' && !simple),
    className,
  );

  return (
    <div ref={ref} className={classes} role="list" {...rest}>
      {steps.map((step, index) => {
        // Position-derived status, which the step's own `status` may override.
        const positional: StepStatus =
          index < active ? finishStatus : index === active ? processStatus : 'wait';
        const resolvedStatus = step.props.status ?? positional;
        const isCurrent = index === active;
        const isLast = index === total - 1;
        // The connector after a step is filled once the next step has begun, i.e.
        // when the current step is finished/processed (its index is below active).
        const lineFilled = index < active;

        const internal: StepInternalProps = {
          stepIndex: index,
          resolvedStatus,
          isCurrent,
          hasLine: !isLast,
          lineFilled,
          direction,
          alignCenter,
          simple,
          spaceStyle: space,
        };

        return cloneElement(step, { key: step.key ?? index, ...internal });
      })}
    </div>
  );
});

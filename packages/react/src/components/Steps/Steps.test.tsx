import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Steps } from './Steps';
import { Step } from './Step';

function getSteps() {
  return screen.getAllByRole('listitem');
}

describe('Steps', () => {
  it('renders a step for each child within a list', () => {
    render(
      <Steps active={1}>
        <Step title="One" />
        <Step title="Two" />
        <Step title="Three" />
      </Steps>,
    );
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(getSteps()).toHaveLength(3);
  });

  it('derives status from the active index', () => {
    render(
      <Steps active={1}>
        <Step title="One" />
        <Step title="Two" />
        <Step title="Three" />
      </Steps>,
    );
    const [one, two, three] = getSteps();
    // index < active -> finishStatus (default 'finish')
    expect(one).toHaveClass('is-finish');
    // index === active -> processStatus (default 'process')
    expect(two).toHaveClass('is-process');
    // index > active -> 'wait'
    expect(three).toHaveClass('is-wait');
  });

  it('marks the active step with aria-current="step"', () => {
    render(
      <Steps active={1}>
        <Step title="One" />
        <Step title="Two" />
      </Steps>,
    );
    const [one, two] = getSteps();
    expect(one).not.toHaveAttribute('aria-current');
    expect(two).toHaveAttribute('aria-current', 'step');
  });

  it('honors custom finishStatus and processStatus', () => {
    render(
      <Steps active={1} finishStatus="success" processStatus="error">
        <Step title="One" />
        <Step title="Two" />
        <Step title="Three" />
      </Steps>,
    );
    const [one, two, three] = getSteps();
    expect(one).toHaveClass('is-success');
    expect(two).toHaveClass('is-error');
    expect(three).toHaveClass('is-wait');
  });

  it('lets a Step override its status', () => {
    render(
      <Steps active={2}>
        <Step title="One" />
        <Step title="Two" status="error" />
        <Step title="Three" />
      </Steps>,
    );
    const [, two] = getSteps();
    // Even though index 1 < active(2) would be 'finish', the explicit status wins.
    expect(two).toHaveClass('is-error');
  });

  it('numbers waiting steps (1-based) and shows a check on finished steps', () => {
    render(
      <Steps active={1}>
        <Step title="One" />
        <Step title="Two" />
        <Step title="Three" />
      </Steps>,
    );
    const [one, , three] = getSteps();
    // Finished step renders a check icon, not its number.
    expect(within(one).queryByText('1')).not.toBeInTheDocument();
    expect(one.querySelector('svg')).toBeTruthy();
    // Waiting step shows its 1-based index.
    expect(within(three).getByText('3')).toBeInTheDocument();
  });

  it('renders the process step number when waiting/process without icon', () => {
    render(
      <Steps active={1}>
        <Step title="One" />
        <Step title="Two" />
      </Steps>,
    );
    const [, two] = getSteps();
    expect(within(two).getByText('2')).toBeInTheDocument();
  });

  it('renders a description', () => {
    render(
      <Steps active={0}>
        <Step title="One" description="First detail" />
      </Steps>,
    );
    expect(screen.getByText('First detail')).toBeInTheDocument();
  });

  it('renders a custom icon over the default marker', () => {
    render(
      <Steps active={0}>
        <Step title="One" icon={<span data-testid="custom-icon">x</span>} />
      </Steps>,
    );
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  it('applies the direction modifier class', () => {
    const { container } = render(
      <Steps active={0} direction="vertical">
        <Step title="One" />
      </Steps>,
    );
    expect(container.querySelector('.ec-steps')).toHaveClass('ec-steps--vertical');
  });

  it('renders connector lines between steps but not after the last', () => {
    const { container } = render(
      <Steps active={1}>
        <Step title="One" />
        <Step title="Two" />
        <Step title="Three" />
      </Steps>,
    );
    // One line per step except the last.
    expect(container.querySelectorAll('.ec-step__line')).toHaveLength(2);
    // The first connector is filled (step 0 is finished), the second is not.
    const lines = container.querySelectorAll('.ec-step__line');
    expect(lines[0]).toHaveClass('is-filled');
    expect(lines[1]).not.toHaveClass('is-filled');
  });

  it('applies the simple modifier and omits connector lines', () => {
    const { container } = render(
      <Steps active={0} simple>
        <Step title="One" />
        <Step title="Two" />
      </Steps>,
    );
    expect(container.querySelector('.ec-steps')).toHaveClass('ec-steps--simple');
    expect(container.querySelectorAll('.ec-step__line')).toHaveLength(0);
  });

  it('applies a fixed space as flex-basis', () => {
    const { container } = render(
      <Steps active={0} space={200}>
        <Step title="One" />
        <Step title="Two" />
      </Steps>,
    );
    const step = container.querySelector('.ec-step') as HTMLElement;
    expect(step).toHaveClass('is-flex');
    expect(step.style.flexBasis).toBe('200px');
  });
});

describe('Step', () => {
  it('renders standalone with its title', () => {
    render(<Step title="Solo" />);
    expect(screen.getByText('Solo')).toBeInTheDocument();
  });
});

/** Global class/variable prefix for Cobos UI charts. */
export const NAMESPACE = 'ec';

export interface Namespace {
  /** Block class, e.g. `ec-chart-line`. */
  b: (blockSuffix?: string) => string;
  /** Element class, e.g. `ec-chart-line__axis`. */
  e: (element?: string) => string;
  /** Modifier class, e.g. `ec-chart-line--smooth`. */
  m: (modifier?: string | false) => string;
  /** Element + modifier, e.g. `ec-chart-line__bar--stacked`. */
  em: (element: string, modifier: string) => string;
  /** State class, e.g. `is-empty`. Returns '' when `state` is false. */
  is: (name: string, state?: boolean) => string;
}

/**
 * BEM-style class name helper, mirroring the `@cobos/react` namespace utility.
 * Charts use the `chart-*` block family (e.g. `chart-line`, `chart-bar`).
 */
export function useNamespace(block: string): Namespace {
  const b = `${NAMESPACE}-${block}`;
  return {
    b: (blockSuffix) => (blockSuffix ? `${b}-${blockSuffix}` : b),
    e: (element) => (element ? `${b}__${element}` : b),
    m: (modifier) => (modifier ? `${b}--${modifier}` : b),
    em: (element, modifier) => `${b}__${element}--${modifier}`,
    is: (name, state = true) => (state ? `is-${name}` : ''),
  };
}

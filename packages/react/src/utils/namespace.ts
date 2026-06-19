/** Global class/variable prefix for Cobos UI. */
export const NAMESPACE = 'ec';

export interface Namespace {
  /** Block class, e.g. `ec-button`. */
  b: (blockSuffix?: string) => string;
  /** Element class, e.g. `ec-button__icon`. */
  e: (element?: string) => string;
  /** Modifier class, e.g. `ec-button--primary`. */
  m: (modifier?: string | false) => string;
  /** Element + modifier, e.g. `ec-button__icon--large`. */
  em: (element: string, modifier: string) => string;
  /** State class, e.g. `is-disabled`. Returns '' when `state` is false. */
  is: (name: string, state?: boolean) => string;
  /** CSS custom property name scoped to the block, e.g. `--ec-button-bg-color`. */
  cssVar: (name: string) => string;
}

/** BEM-style class name helper, mirroring the Element Plus namespace utility. */
export function useNamespace(block: string): Namespace {
  const b = `${NAMESPACE}-${block}`;
  return {
    b: (blockSuffix) => (blockSuffix ? `${b}-${blockSuffix}` : b),
    e: (element) => (element ? `${b}__${element}` : b),
    m: (modifier) => (modifier ? `${b}--${modifier}` : b),
    em: (element, modifier) => `${b}__${element}--${modifier}`,
    is: (name, state = true) => (state ? `is-${name}` : ''),
    cssVar: (name) => `--${b}-${name}`,
  };
}

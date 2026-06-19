import { describe, expect, it } from 'vitest';
import { mix } from './color';
import { darkVars, lightVars } from './tokens';

describe('color ramps', () => {
  it('matches Element Plus primary light-9', () => {
    expect(lightVars['--ec-color-primary-light-9']).toBe('#ecf5ff');
  });

  it('matches Element Plus primary dark-2', () => {
    expect(lightVars['--ec-color-primary-dark-2']).toBe('#337ecc');
  });

  it('keeps the base brand color intact', () => {
    expect(lightVars['--ec-color-primary']).toBe('#409eff');
  });
});

describe('mix', () => {
  it('blends evenly at 0.5', () => {
    expect(mix('#ffffff', '#000000', 0.5)).toBe('#808080');
  });
});

describe('dark theme', () => {
  it('overrides the page background', () => {
    expect(darkVars['--ec-bg-color']).toBe('#141414');
  });

  it('lightens the dark-2 ramp to match Element Plus', () => {
    expect(darkVars['--ec-color-primary-dark-2']).toBe('#66b1ff');
  });
});

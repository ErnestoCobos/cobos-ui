import { describe, expect, it } from 'vitest';
import { contrastRatio, mix } from './color';
import { BRAND_COLORS, createTheme, darkVars, lightVars } from './tokens';

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

describe('contrastRatio', () => {
  it('returns the maximum 21:1 for black on white', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBe(21);
  });
});

describe('contrast tokens', () => {
  const types = ['primary', 'success', 'warning', 'danger', 'error', 'info'] as const;

  for (const type of types) {
    it(`gives ${type} contrast text >= 4.5:1 against its base (light)`, () => {
      const base = BRAND_COLORS[type];
      const contrast = lightVars[`--ec-color-${type}-contrast`];
      expect(contrastRatio(contrast, base)).toBeGreaterThanOrEqual(4.5);
    });

    it(`gives ${type} contrast text >= 4.5:1 against its base (dark)`, () => {
      const base = BRAND_COLORS[type];
      const contrast = darkVars[`--ec-color-${type}-contrast`];
      expect(contrastRatio(contrast, base)).toBeGreaterThanOrEqual(4.5);
    });
  }
});

describe('createTheme', () => {
  it('derives a lime primary ramp with dark contrast text', () => {
    const theme = createTheme({ primary: '#a3e635' });
    expect(theme['--ec-color-primary']).toBe('#a3e635');
    expect(theme['--ec-color-primary-light-9']).toBe(mix('#ffffff', '#a3e635', 0.9));
    expect(theme['--ec-color-primary-contrast']).toBe('#1a1a1a');
  });

  it('picks white contrast text for a dark navy primary', () => {
    expect(createTheme({ primary: '#0d2c54' })['--ec-color-primary-contrast']).toBe('#ffffff');
  });

  it('omits types that are not seeded', () => {
    const theme = createTheme({ primary: '#a3e635' });
    expect(theme['--ec-color-success']).toBeUndefined();
  });

  it('mirrors error from danger when only danger is seeded', () => {
    const theme = createTheme({ danger: '#dc2626' });
    expect(theme['--ec-color-error']).toBe('#dc2626');
    expect(theme['--ec-color-error-contrast']).toBe(theme['--ec-color-danger-contrast']);
  });
});

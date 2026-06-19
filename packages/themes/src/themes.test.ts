import { createTheme } from '@cobos/tokens';
import { describe, expect, it } from 'vitest';
import { themeNames, themeSeeds, themes } from './themes';

describe('theme seeds', () => {
  it('picks white contrast text for the voltaflow navy primary', () => {
    expect(createTheme(themeSeeds.voltaflow)['--ec-color-primary-contrast']).toBe('#ffffff');
  });

  it('picks dark contrast text for the enkiflow lime primary', () => {
    expect(createTheme(themeSeeds.enkiflow)['--ec-color-primary-contrast']).toBe('#1a1a1a');
  });

  it('exposes all four built-in themes', () => {
    expect(themeNames).toEqual(['cobos', 'enkiflow', 'getdecant', 'voltaflow']);
  });
});

describe('theme metadata', () => {
  it('carries the same seeds as the seed map for every theme', () => {
    for (const theme of themes) {
      expect(theme.seeds).toBe(themeSeeds[theme.name]);
    }
  });

  it('keeps the cobos and voltaflow info accents alongside their primaries', () => {
    expect(themeSeeds.cobos.info).toBe('#7c3aed');
    expect(themeSeeds.voltaflow.info).toBe('#4ea5d9');
  });
});

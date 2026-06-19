import type { ThemeSeeds } from '@cobos/tokens';

/**
 * Brand accent seeds for each Cobos UI theme.
 *
 * Each theme only overrides the brand accent(s); every other token is inherited
 * from `@cobos/tokens`. The `-contrast` token is derived automatically by
 * `createTheme`, so text stays accessible on top of the seeded color.
 */
export const themeSeeds = {
  cobos: { primary: '#00d4ff', info: '#7c3aed' },
  enkiflow: { primary: '#a3e635' },
  getdecant: { primary: '#4a4239' },
  // Voltaflow's new design-led identity: a violet accent with a warm peach
  // secondary (approximated from the Claude Design landing; exact hex to be
  // locked from the source file once design access is authorized).
  voltaflow: { primary: '#7c5cff', info: '#f4a07a' },
} satisfies Record<string, ThemeSeeds>;

/** Identifier of a built-in Cobos UI theme. */
export type ThemeName = keyof typeof themeSeeds;

/** Ordered list of every built-in theme name. */
export const themeNames = Object.keys(themeSeeds) as ThemeName[];

/** Human-facing metadata describing a single theme. */
export interface ThemeMeta {
  /** Stable identifier used in `data-theme` and CSS class names. */
  name: ThemeName;
  /** Short display label. */
  label: string;
  /** One-line description of the theme's character. */
  description: string;
  /** Brand accent seeds passed to `createTheme`. */
  seeds: ThemeSeeds;
}

/** Metadata for every built-in theme, in display order. */
export const themes: ThemeMeta[] = [
  {
    name: 'cobos',
    label: 'Cobos',
    description: 'Operator-console cyan paired with a violet accent.',
    seeds: themeSeeds.cobos,
  },
  {
    name: 'enkiflow',
    label: 'Enkiflow',
    description: 'Bright lime energy for a productivity workspace.',
    seeds: themeSeeds.enkiflow,
  },
  {
    name: 'getdecant',
    label: 'Decant',
    description: 'Warm espresso tones with an editorial, refined feel.',
    seeds: themeSeeds.getdecant,
  },
  {
    name: 'voltaflow',
    label: 'Voltaflow',
    description: 'Design-led violet with a warm peach secondary.',
    seeds: themeSeeds.voltaflow,
  },
];

export default themes;

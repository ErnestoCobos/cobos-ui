import { mix } from './color';

/** Brand colors (faithful to Element Plus base palette). */
export const BRAND_COLORS = {
  primary: '#409eff',
  success: '#67c23a',
  warning: '#e6a23c',
  danger: '#f56c6c',
  error: '#f56c6c',
  info: '#909399',
} as const;

export type BrandColor = keyof typeof BRAND_COLORS;

const WHITE = '#ffffff';
const BLACK = '#000000';
/** Base background used to derive color ramps in dark mode. */
const DARK_BG = '#141414';

export type Vars = Record<string, string>;

/**
 * Build the brand color variables (base + light-1..9 + dark-2).
 * In light mode light ramps mix toward white; in dark mode toward the dark background.
 */
function colorVars(mixLight: string, mixDark2: string, dark2Weight: number): Vars {
  const vars: Vars = {
    '--ec-color-white': WHITE,
    '--ec-color-black': BLACK,
  };
  for (const [name, base] of Object.entries(BRAND_COLORS)) {
    vars[`--ec-color-${name}`] = base;
    for (let i = 1; i <= 9; i++) {
      vars[`--ec-color-${name}-light-${i}`] = mix(mixLight, base, i / 10);
    }
    vars[`--ec-color-${name}-dark-2`] = mix(mixDark2, base, dark2Weight);
  }
  return vars;
}

const lightSemantic: Vars = {
  '--ec-bg-color': '#ffffff',
  '--ec-bg-color-page': '#f2f3f5',
  '--ec-bg-color-overlay': '#ffffff',
  '--ec-text-color-primary': '#303133',
  '--ec-text-color-regular': '#606266',
  '--ec-text-color-secondary': '#909399',
  '--ec-text-color-placeholder': '#a8abb2',
  '--ec-text-color-disabled': '#c0c4cc',
  '--ec-border-color': '#dcdfe6',
  '--ec-border-color-light': '#e4e7ed',
  '--ec-border-color-lighter': '#ebeef5',
  '--ec-border-color-extra-light': '#f2f6fc',
  '--ec-border-color-dark': '#d4d7de',
  '--ec-border-color-darker': '#cdd0d6',
  '--ec-fill-color': '#f0f2f5',
  '--ec-fill-color-light': '#f5f7fa',
  '--ec-fill-color-lighter': '#fafafa',
  '--ec-fill-color-extra-light': '#fafcff',
  '--ec-fill-color-dark': '#ebedf0',
  '--ec-fill-color-darker': '#e6e8eb',
  '--ec-fill-color-blank': '#ffffff',
};

const darkSemantic: Vars = {
  '--ec-bg-color': '#141414',
  '--ec-bg-color-page': '#0a0a0a',
  '--ec-bg-color-overlay': '#1d1e1f',
  '--ec-text-color-primary': '#e5eaf3',
  '--ec-text-color-regular': '#cfd3dc',
  '--ec-text-color-secondary': '#a3a6ad',
  '--ec-text-color-placeholder': '#8d9095',
  '--ec-text-color-disabled': '#6c6e72',
  '--ec-border-color': '#4c4d4f',
  '--ec-border-color-light': '#414243',
  '--ec-border-color-lighter': '#363637',
  '--ec-border-color-extra-light': '#2b2b2c',
  '--ec-border-color-dark': '#58585b',
  '--ec-border-color-darker': '#636466',
  '--ec-fill-color': '#303030',
  '--ec-fill-color-light': '#262727',
  '--ec-fill-color-lighter': '#1d1d1d',
  '--ec-fill-color-extra-light': '#191919',
  '--ec-fill-color-dark': '#39393a',
  '--ec-fill-color-darker': '#424243',
  '--ec-fill-color-blank': '#141414',
};

/** Tokens that do not change between light and dark themes. */
const staticTokens: Vars = {
  '--ec-border-width': '1px',
  '--ec-border-style': 'solid',
  '--ec-border-color-hover': 'var(--ec-text-color-disabled)',
  '--ec-border': 'var(--ec-border-width) var(--ec-border-style) var(--ec-border-color)',
  '--ec-border-radius-base': '4px',
  '--ec-border-radius-small': '2px',
  '--ec-border-radius-round': '20px',
  '--ec-border-radius-circle': '100%',
  '--ec-component-size-large': '40px',
  '--ec-component-size': '32px',
  '--ec-component-size-small': '24px',
  '--ec-font-family':
    "'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif",
  '--ec-font-size-extra-large': '20px',
  '--ec-font-size-large': '18px',
  '--ec-font-size-medium': '16px',
  '--ec-font-size-base': '14px',
  '--ec-font-size-small': '13px',
  '--ec-font-size-extra-small': '12px',
  '--ec-font-weight-primary': '500',
  '--ec-disabled-bg-color': 'var(--ec-fill-color-light)',
  '--ec-disabled-text-color': 'var(--ec-text-color-placeholder)',
  '--ec-disabled-border-color': 'var(--ec-border-color-light)',
  '--ec-box-shadow': '0px 12px 32px 4px rgba(0, 0, 0, 0.04), 0px 8px 20px rgba(0, 0, 0, 0.08)',
  '--ec-box-shadow-light': '0px 0px 12px rgba(0, 0, 0, 0.12)',
  '--ec-box-shadow-lighter': '0px 0px 6px rgba(0, 0, 0, 0.12)',
  '--ec-box-shadow-dark':
    '0px 16px 48px 16px rgba(0, 0, 0, 0.08), 0px 12px 32px rgba(0, 0, 0, 0.12), 0px 8px 16px -8px rgba(0, 0, 0, 0.16)',
  '--ec-index-normal': '1',
  '--ec-index-top': '1000',
  '--ec-index-popper': '2000',
  '--ec-transition-duration': '0.3s',
  '--ec-transition-duration-fast': '0.2s',
  '--ec-transition-function-ease-in-out-bezier': 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  '--ec-transition-function-fast-bezier': 'cubic-bezier(0.23, 1, 0.32, 1)',
  '--ec-transition-all':
    'all var(--ec-transition-duration) var(--ec-transition-function-ease-in-out-bezier)',
  '--ec-transition-fade':
    'opacity var(--ec-transition-duration) var(--ec-transition-function-fast-bezier)',
  '--ec-transition-border':
    'border-color var(--ec-transition-duration-fast) var(--ec-transition-function-ease-in-out-bezier)',
  '--ec-transition-color':
    'color var(--ec-transition-duration) var(--ec-transition-function-ease-in-out-bezier)',
};

/** All CSS variables applied at `:root` (light theme). */
export const lightVars: Vars = {
  ...colorVars(WHITE, BLACK, 0.2),
  ...lightSemantic,
  ...staticTokens,
};

/** CSS variables overridden under the dark theme selector. */
export const darkVars: Vars = {
  ...colorVars(DARK_BG, WHITE, 0.2),
  ...darkSemantic,
};

/** Structured token data, convenient for JS/TS consumers and the registry. */
export const tokens = {
  colors: BRAND_COLORS,
  light: lightVars,
  dark: darkVars,
} as const;

export default tokens;

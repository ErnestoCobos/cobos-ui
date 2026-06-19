# @cobos/charts

Dependency-free, theme-aware **SVG charts for React**. The data-visualization
companion to [`@cobos/react`](../react) — it fills the one gap a component
library like Element Plus leaves open.

- **No runtime dependencies.** Pure SVG; nothing to bundle but the components.
- **Theme-aware by default.** Series, grid, and label colors reference the
  `--ec-*` design tokens, so charts automatically follow light/dark mode and the
  brand themes (cobos / enkiflow / getdecant / voltaflow) with **no extra
  configuration**.
- **Responsive.** Charts scale to their container width via the SVG `viewBox`;
  you control the height.
- **Accessible.** Every chart renders `role="img"` with an `aria-label` summary
  and a `<title>`.

## Install

```bash
pnpm add @cobos/charts
```

`react` and `react-dom` (>=18) are peer dependencies.

## Theming — important

Charts read their colors from the `--ec-*` CSS variables that ship with
`@cobos/tokens`. Those variables are already loaded for you if you import the
main stylesheet from `@cobos/react`:

```ts
import '@cobos/react/styles.css'; // provides the --ec-* tokens
import '@cobos/charts/styles.css'; // chart container / axis / legend styles
```

If you are not using `@cobos/react`, import `@cobos/tokens` styles directly so
the `--ec-*` variables are present. Because the defaults are token references
(`var(--ec-color-primary)`, `--ec-color-success`, …), switching the active theme
or toggling dark mode restyles every chart automatically — you never pass colors
by hand unless you want to override them.

The default series palette is:

| Slot | Token |
| ---- | ----- |
| 1 | `var(--ec-color-primary)` |
| 2 | `var(--ec-color-success)` |
| 3 | `var(--ec-color-warning)` |
| 4 | `var(--ec-color-danger)` |
| 5 | `var(--ec-color-info)` |

Grid lines use `--ec-border-color-lighter`; axis/labels use
`--ec-text-color-secondary`.

## Components

### LineChart

```tsx
import { LineChart } from '@cobos/charts';

// Single series
<LineChart
  data={[
    { x: 'Jan', y: 120 },
    { x: 'Feb', y: 200 },
    { x: 'Mar', y: 150 },
    { x: 'Apr', y: 320 },
  ]}
  height={260}
  smooth
  area
  showDots
/>;

// Multiple series
<LineChart
  series={[
    { name: 'Revenue', data: [{ x: 'Q1', y: 12 }, { x: 'Q2', y: 19 }] },
    { name: 'Costs', data: [{ x: 'Q1', y: 8 }, { x: 'Q2', y: 11 }] },
  ]}
/>;
```

Key props: `data` **or** `series`, `height` (default `240`), `colors`, `smooth`,
`area`, `showGrid`, `showXAxis`, `showYAxis`, `showDots`, `strokeWidth`
(default `2`), `yTicks`, `formatX`, `formatY`, `padding`.

### AreaChart

A `LineChart` with `area` defaulted to `true`. Accepts every `LineChart` prop.

```tsx
import { AreaChart } from '@cobos/charts';

<AreaChart data={data} smooth />;
```

### BarChart

Vertical bars by default; supports horizontal, grouped, and stacked layouts with
rounded leading corners.

```tsx
import { BarChart } from '@cobos/charts';

// Single series
<BarChart
  data={[
    { label: 'Q1', value: 120 },
    { label: 'Q2', value: 200 },
    { label: 'Q3', value: 150 },
    { label: 'Q4', value: 80 },
  ]}
/>;

// Grouped / stacked
<BarChart
  categories={['Mon', 'Tue', 'Wed']}
  series={[
    { name: 'New', data: [10, 14, 9] },
    { name: 'Returning', data: [6, 8, 12] },
  ]}
  stacked
/>;
```

Key props: `data` **or** `series` + `categories`, `height`, `colors`,
`horizontal`, `stacked`, `showGrid`, axis toggles, `radius`, `categoryGap`,
`barGap`, `formatValue`.

### DonutChart / PieChart

```tsx
import { DonutChart, PieChart } from '@cobos/charts';

<DonutChart
  data={[
    { label: 'Chrome', value: 60 },
    { label: 'Safari', value: 25 },
    { label: 'Firefox', value: 15 },
  ]}
  centerLabel="100%"
  showLegend
/>;

// Full pie (no inner radius)
<PieChart data={data} showLegend />;
```

Key props: `data`, `size` (default `200`), `thickness` (ring width, donut only),
`colors`, `centerLabel`, `showLegend`, `gap`, `formatValue`. Per-slice `color`
overrides are honored. `PieChart` is `DonutChart` with no inner radius.

### Sparkline

A tiny inline line/area chart for stat cards and tables — no axes or grid.

```tsx
import { Sparkline } from '@cobos/charts';

<Sparkline data={[3, 7, 4, 9, 6, 11, 8]} width={120} height={32} area smooth />;
```

Key props: `data: number[]`, `width`, `height`, `color` (default
`var(--ec-color-primary)`), `area`, `smooth`, `strokeWidth`.

## Empty states

Every chart renders a sensible, theme-aware empty state when its data is empty,
so you never have to special-case loading or no-data views.

## License

MIT © Ernesto Cobos

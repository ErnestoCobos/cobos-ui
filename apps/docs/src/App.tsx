import { useCallback, useEffect, useMemo, useState } from 'react';
import { ConfigProvider, Tag, Button, Icon, Link } from '@cobos/react';
import type { ComponentSize } from '@cobos/react';
import { themes } from '@cobos/themes';
import type { ThemeName } from '@cobos/themes';

import { COMPONENTS, STABLE_COMPONENTS, groupByCategory, findComponent, elementPlusUrl } from './catalog';
import { demos } from './demos';
import {
  MoonGlyph,
  SunGlyph,
  GithubGlyph,
  ArrowRightGlyph,
  CopyGlyph,
  SparkGlyph,
  StorybookGlyph,
  ChevronDownGlyph,
} from './icons';

const THEME_KEY = 'cobos-docs-theme';
const SIZE_KEY = 'cobos-docs-size';
const BRAND_KEY = 'cobos-docs-brand';
const SIZES: ComponentSize[] = ['large', 'default', 'small'];

/** Default brand on first load — showcase Ernesto's own brand (cyan accent). */
const DEFAULT_BRAND: ThemeName = 'cobos';
const BRAND_NAMES = themes.map((t) => t.name);
const BRAND_BY_NAME = new Map(themes.map((t) => [t.name, t]));

const GITHUB_URL = 'https://github.com/ErnestoCobos/cobos-ui';
const STORYBOOK_URL = '/storybook';
const INSTALL_CMD = 'npm i @cobos/react @cobos/tokens';

const STABLE_COUNT = COMPONENTS.filter((c) => c.status === 'stable').length;

/** Editorial section index: monospace numbers like "01". */
function ordinal(i: number): string {
  return String(i + 1).padStart(2, '0');
}

type Route = { kind: 'home' } | { kind: 'component'; key: string };

/** Read the active route from the URL hash. Defaults to the landing page. */
function readHash(): Route {
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  if (!raw || raw === 'overview' || raw === 'home') return { kind: 'home' };
  if (demos[raw]) return { kind: 'component', key: raw };
  return { kind: 'home' };
}

function useHashRoute(): [Route, (next: Route) => void] {
  const [route, setRoute] = useState<Route>(() => readHash());

  useEffect(() => {
    const onChange = () => setRoute(readHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((next: Route) => {
    const hash = next.kind === 'home' ? '#/' : `#/${next.key}`;
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
    setRoute(next);
    // Bring the reader back to the top when switching pages.
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return [route, navigate];
}

function getInitialTheme(): 'light' | 'dark' {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialSize(): ComponentSize {
  const stored = localStorage.getItem(SIZE_KEY);
  if (stored === 'large' || stored === 'default' || stored === 'small') return stored;
  return 'default';
}

function getInitialBrand(): ThemeName {
  const stored = localStorage.getItem(BRAND_KEY);
  if (stored && (BRAND_NAMES as string[]).includes(stored)) return stored as ThemeName;
  // First load: default to the Cobos brand so the docs showcase the cyan accent.
  return DEFAULT_BRAND;
}

/** A monospace command line with a copy affordance. */
function InstallSnippet({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard?.writeText(command).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      },
      () => {
        /* clipboard unavailable — no-op */
      },
    );
  }, [command]);

  return (
    <div className="snippet" role="group" aria-label="Install command">
      <span className="snippet__prompt" aria-hidden>
        $
      </span>
      <code className="snippet__cmd">{command}</code>
      <button type="button" className="snippet__copy" onClick={copy} aria-label="Copy install command">
        <Icon size={15}>{CopyGlyph}</Icon>
        <span>{copied ? 'Copied' : 'Copy'}</span>
      </button>
    </div>
  );
}

const FACTS: { value: string; label: string }[] = [
  { value: `${STABLE_COUNT}`, label: 'Components' },
  { value: 'Light & dark', label: 'Themes' },
  { value: 'MCP-ready', label: 'Tooling' },
  { value: 'WCAG-tuned', label: 'Accessibility' },
];

/** The landing / overview page — the default route. */
function Landing({ onBrowse }: { onBrowse: (key: string) => void }) {
  const groups = useMemo(() => groupByCategory(COMPONENTS), []);
  const firstStable = STABLE_COMPONENTS[0]?.key ?? 'button';

  return (
    <div className="landing">
      <section className="hero">
        <div className="hero__inner">
          <p className="eyebrow reveal" style={{ '--d': '0ms' } as React.CSSProperties}>
            <span className="eyebrow__rule" aria-hidden />
            React Design System · v0 · Wave 1
          </p>

          <h1 className="hero__wordmark reveal" style={{ '--d': '70ms' } as React.CSSProperties}>
            Cobos<span className="hero__wordmark-accent"> UI</span>
          </h1>

          <p className="hero__tagline reveal" style={{ '--d': '150ms' } as React.CSSProperties}>
            A token-first React design system.
          </p>

          <p className="hero__lede reveal" style={{ '--d': '220ms' } as React.CSSProperties}>
            The full Element Plus surface, re-engineered for React — driven entirely by design tokens,
            tuned for accessibility, and ready for both human and machine consumers.
          </p>

          <div className="hero__cta reveal" style={{ '--d': '300ms' } as React.CSSProperties}>
            <Button
              type="primary"
              size="large"
              onClick={() => onBrowse(firstStable)}
              icon={<Icon size={16}>{ArrowRightGlyph}</Icon>}
            >
              Get started
            </Button>
            <a className="btn-link" href={STORYBOOK_URL}>
              <Icon size={16}>{StorybookGlyph}</Icon>
              <span>Storybook</span>
            </a>
            <a className="btn-link btn-link--ghost" href={GITHUB_URL} target="_blank" rel="noreferrer">
              <Icon size={16}>{GithubGlyph}</Icon>
              <span>GitHub</span>
            </a>
          </div>

          <div className="hero__install reveal" style={{ '--d': '380ms' } as React.CSSProperties}>
            <InstallSnippet command={INSTALL_CMD} />
          </div>

          <ul className="facts reveal" style={{ '--d': '460ms' } as React.CSSProperties}>
            {FACTS.map((f) => (
              <li className="fact" key={f.label}>
                <span className="fact__value">{f.value}</span>
                <span className="fact__label">{f.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="hero__glow" aria-hidden />
      </section>

      <section className="browse" aria-labelledby="browse-title">
        <div className="section-marker">
          <span className="section-marker__num">01</span>
          <span className="section-marker__label">Components</span>
        </div>
        <h2 className="browse__title" id="browse-title">
          A complete, live catalog.
        </h2>
        <p className="browse__intro">
          {STABLE_COUNT} components shipping today, with the rest of the Element Plus surface mapped and queued.
          Every demo below is the real component — toggle the theme and size from the header.
        </p>

        <div className="cat-grid">
          {groups.map((group) => {
            const stable = group.components.filter((c) => c.status === 'stable');
            const planned = group.components.filter((c) => c.status !== 'stable');
            return (
              <div className="cat-card" key={group.category}>
                <header className="cat-card__head">
                  <h3 className="cat-card__title">{group.category}</h3>
                  <span className="cat-card__count">
                    {stable.length}
                    {planned.length ? ` / ${group.components.length}` : ''}
                  </span>
                </header>
                <ul className="cat-card__list">
                  {stable.map((c) => (
                    <li key={c.key}>
                      <button type="button" className="chip" onClick={() => onBrowse(c.key)}>
                        {c.name}
                      </button>
                    </li>
                  ))}
                  {planned.map((c) => (
                    <li key={c.key}>
                      <span className="chip is-planned" aria-disabled>
                        {c.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="principles" aria-labelledby="principles-title">
        <div className="section-marker">
          <span className="section-marker__num">02</span>
          <span className="section-marker__label">Principles</span>
        </div>
        <h2 className="browse__title" id="principles-title">
          Built to be inherited.
        </h2>
        <div className="principle-grid">
          <article className="principle">
            <Icon size={20} className="principle__icon">
              {SparkGlyph}
            </Icon>
            <h3 className="principle__title">Token-first</h3>
            <p className="principle__body">
              Every color, space and radius is a CSS variable from <code>@cobos/tokens</code>. Re-theme the
              whole system by overriding the tokens — no component forks.
            </p>
          </article>
          <article className="principle">
            <Icon size={20} className="principle__icon">
              {MoonGlyph}
            </Icon>
            <h3 className="principle__title">Light & dark, by default</h3>
            <p className="principle__body">
              Both themes ship in the box and track the same token contract, so dark mode is never an
              afterthought bolted on later.
            </p>
          </article>
          <article className="principle">
            <Icon size={20} className="principle__icon">
              {StorybookGlyph}
            </Icon>
            <h3 className="principle__title">MCP-ready</h3>
            <p className="principle__body">
              A machine-readable catalog and registry let agents and tooling discover, install and compose
              components programmatically.
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [route, navigate] = useHashRoute();
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [size, setSize] = useState<ComponentSize>(getInitialSize);
  const [brand, setBrand] = useState<ThemeName>(getInitialBrand);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(SIZE_KEY, size);
  }, [size]);

  // Brand theme: set data-theme on <html> so the per-brand --ec-* vars apply to
  // every live demo and the landing alike (they all live under documentElement),
  // composing with the `dark` class above. Persist the choice for return visits.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', brand);
    localStorage.setItem(BRAND_KEY, brand);
  }, [brand]);

  const activeBrand = BRAND_BY_NAME.get(brand) ?? themes[0];

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setNavOpen(false);
  }, [route]);

  const groups = useMemo(() => groupByCategory(COMPONENTS), []);
  const isHome = route.kind === 'home';
  const activeKey = route.kind === 'component' ? route.key : '';
  const current = activeKey ? findComponent(activeKey) : undefined;
  const ActiveDemo = activeKey ? demos[activeKey] : undefined;
  const epUrl = elementPlusUrl(current?.elementPlus);

  const goHome = useCallback(() => navigate({ kind: 'home' }), [navigate]);
  const goComponent = useCallback((key: string) => navigate({ kind: 'component', key }), [navigate]);

  return (
    <div className={`app${isHome ? ' app--home' : ''}`}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="topbar">
        <div className="topbar__left">
          {!isHome ? (
            <button
              type="button"
              className="topbar__menu-btn"
              aria-label="Toggle navigation"
              aria-expanded={navOpen}
              onClick={() => setNavOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          ) : null}
          <a
            className="wordmark"
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              goHome();
            }}
          >
            <span className="wordmark__mark" aria-hidden>
              C
            </span>
            <span className="wordmark__text">
              Cobos<span className="wordmark__accent"> UI</span>
            </span>
          </a>
          {!isHome ? (
            <nav className="crumbs" aria-label="Breadcrumb">
              <span className="crumbs__sep" aria-hidden>
                /
              </span>
              <span className="crumbs__current">{current?.category ?? 'Components'}</span>
            </nav>
          ) : (
            <Tag size="small" effect="plain" className="topbar__badge">
              Wave 1
            </Tag>
          )}
        </div>

        <div className="topbar__right">
          <div className="brand-switch">
            <span className="brand-switch__caption" aria-hidden>
              <span
                className="brand-switch__swatch"
                style={{ background: activeBrand.seeds.primary }}
              />
              <span className="brand-switch__label">Theme: {activeBrand.label}</span>
            </span>
            <div className="brand-switch__field">
              <label className="visually-hidden" htmlFor="brand-theme">
                Brand theme
              </label>
              <select
                id="brand-theme"
                className="brand-switch__select"
                value={brand}
                onChange={(e) => setBrand(e.target.value as ThemeName)}
                title={activeBrand.description}
              >
                {themes.map((t) => (
                  <option key={t.name} value={t.name}>
                    {t.label}
                  </option>
                ))}
              </select>
              <Icon size={14} className="brand-switch__chevron" aria-hidden>
                {ChevronDownGlyph}
              </Icon>
            </div>
          </div>
          {!isHome ? (
            <div className="size-toggle" role="group" aria-label="Component size">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`size-toggle__btn${s === size ? ' is-active' : ''}`}
                  onClick={() => setSize(s)}
                  aria-pressed={s === size}
                  aria-label={s === 'default' ? 'Medium size' : `${s} size`}
                >
                  {s === 'default' ? 'M' : s === 'large' ? 'L' : 'S'}
                </button>
              ))}
            </div>
          ) : null}
          <a
            className="topbar__icon-link"
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="View Cobos UI on GitHub"
          >
            <Icon size={18}>{GithubGlyph}</Icon>
          </a>
          <Button
            text
            bg
            circle
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            icon={<Icon size={18}>{theme === 'dark' ? SunGlyph : MoonGlyph}</Icon>}
          />
        </div>
      </header>

      {isHome ? (
        <main id="main" className="home-main">
          <Landing onBrowse={goComponent} />
          <SiteFooter />
        </main>
      ) : (
        <div className="layout">
          {navOpen ? <div className="scrim" onClick={() => setNavOpen(false)} aria-hidden /> : null}

          <aside className={`sidebar${navOpen ? ' is-open' : ''}`}>
            <nav className="sidebar__nav" aria-label="Components">
              <button type="button" className="sidebar__home" onClick={goHome}>
                <Icon size={13}>{ArrowRightGlyph}</Icon>
                <span>Overview</span>
              </button>
              {groups.map((group, gi) => (
                <div
                  className="nav-group reveal"
                  key={group.category}
                  style={{ '--d': `${gi * 45}ms` } as React.CSSProperties}
                >
                  <h2 className="nav-group__title">
                    <span className="nav-group__num">{ordinal(gi)}</span>
                    {group.category}
                  </h2>
                  <ul className="nav-list">
                    {group.components.map((c) => {
                      const isStable = c.status === 'stable';
                      const isActive = c.key === activeKey;
                      return (
                        <li key={c.key}>
                          {isStable ? (
                            <button
                              type="button"
                              className={`nav-item${isActive ? ' is-active' : ''}`}
                              onClick={() => goComponent(c.key)}
                              aria-current={isActive ? 'page' : undefined}
                            >
                              {c.name}
                            </button>
                          ) : (
                            <span className="nav-item is-planned" aria-disabled>
                              {c.name}
                              <Tag size="small" type="info" effect="plain" className="nav-item__soon">
                                Soon
                              </Tag>
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          <main id="main" className="content">
            {current && ActiveDemo ? (
              <article className="page">
                <header className="page__head">
                  <p className="page__eyebrow">{current.category}</p>
                  <div className="page__title-row">
                    <h1 className="page__title">{current.name}</h1>
                    <Tag type="success" effect="light" size="small">
                      Stable
                    </Tag>
                  </div>
                  <p className="page__desc">{current.description}</p>
                  <p className="page__meta">
                    {current.export ? (
                      <code className="page__import">
                        import {'{ '}
                        {current.export}
                        {' }'} from '@cobos/react'
                      </code>
                    ) : null}
                    {epUrl ? (
                      <span className="page__ref">
                        Element Plus reference:{' '}
                        <Link href={epUrl} type="primary" target="_blank" rel="noreferrer" underline>
                          {current.elementPlus}
                        </Link>
                      </span>
                    ) : null}
                  </p>
                </header>

                <ConfigProvider size={size}>
                  <div className="page__demo">
                    <ActiveDemo />
                  </div>
                </ConfigProvider>
              </article>
            ) : (
              <div className="page">
                <h1 className="page__title">Not found</h1>
                <p className="page__desc">No demo is available for this component yet.</p>
              </div>
            )}

            <SiteFooter />
          </main>
        </div>
      )}
    </div>
  );
}

function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer__brand">
        <span className="footer__mark" aria-hidden>
          C
        </span>
        <span>
          Cobos<span className="footer__accent"> UI</span>
        </span>
      </div>
      <p className="footer__line">
        A token-first React design system. Built with <code>@cobos/react</code> by Ernesto Cobos.
      </p>
      <nav className="footer__links" aria-label="Footer">
        <Link href={GITHUB_URL} target="_blank" rel="noreferrer" type="default">
          GitHub
        </Link>
        <Link href={STORYBOOK_URL} type="default">
          Storybook
        </Link>
        <Link href="https://ui.cobos.io" type="default">
          ui.cobos.io
        </Link>
      </nav>
    </footer>
  );
}

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ConfigProvider, Tag, Button, Icon, Link } from '@cobos/react';
import type { ComponentSize } from '@cobos/react';

import { COMPONENTS, STABLE_COMPONENTS, groupByCategory, findComponent, elementPlusUrl } from './catalog';
import { demos } from './demos';
import { MoonGlyph, SunGlyph } from './icons';

const THEME_KEY = 'cobos-docs-theme';
const SIZE_KEY = 'cobos-docs-size';
const SIZES: ComponentSize[] = ['large', 'default', 'small'];

/** Read the active component key from the URL hash, defaulting to the first stable one. */
function readHash(): string {
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  if (raw && demos[raw]) return raw;
  return STABLE_COMPONENTS[0]?.key ?? 'button';
}

function useHashRoute(): [string, (key: string) => void] {
  const [key, setKey] = useState<string>(() => readHash());

  useEffect(() => {
    const onChange = () => setKey(readHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((next: string) => {
    if (window.location.hash !== `#/${next}`) {
      window.location.hash = `#/${next}`;
    }
    setKey(next);
  }, []);

  return [key, navigate];
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

export default function App() {
  const [active, navigate] = useHashRoute();
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [size, setSize] = useState<ComponentSize>(getInitialSize);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(SIZE_KEY, size);
  }, [size]);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setNavOpen(false);
  }, [active]);

  const groups = useMemo(() => groupByCategory(COMPONENTS), []);
  const current = findComponent(active);
  const ActiveDemo = demos[active];
  const epUrl = elementPlusUrl(current?.elementPlus);

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__left">
          <button
            type="button"
            className="topbar__menu-btn"
            aria-label="Toggle navigation"
            onClick={() => setNavOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
          <a className="wordmark" href="#/" onClick={() => navigate(STABLE_COMPONENTS[0].key)}>
            <span className="wordmark__mark" aria-hidden>
              C
            </span>
            <span className="wordmark__text">
              Cobos<span className="wordmark__accent"> UI</span>
            </span>
          </a>
          <Tag size="small" effect="plain" className="topbar__badge">
            Wave 1
          </Tag>
        </div>

        <div className="topbar__right">
          <div className="size-toggle" role="group" aria-label="Component size">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                className={`size-toggle__btn${s === size ? ' is-active' : ''}`}
                onClick={() => setSize(s)}
                aria-pressed={s === size}
              >
                {s === 'default' ? 'M' : s === 'large' ? 'L' : 'S'}
              </button>
            ))}
          </div>
          <Button
            text
            bg
            circle
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            icon={
              <Icon size={18}>{theme === 'dark' ? SunGlyph : MoonGlyph}</Icon>
            }
          />
        </div>
      </header>

      <div className="layout">
        {navOpen ? <div className="scrim" onClick={() => setNavOpen(false)} aria-hidden /> : null}

        <aside className={`sidebar${navOpen ? ' is-open' : ''}`}>
          <nav className="sidebar__nav" aria-label="Components">
            {groups.map((group) => (
              <div className="nav-group" key={group.category}>
                <h2 className="nav-group__title">{group.category}</h2>
                <ul className="nav-list">
                  {group.components.map((c) => {
                    const isStable = c.status === 'stable';
                    const isActive = c.key === active;
                    return (
                      <li key={c.key}>
                        {isStable ? (
                          <button
                            type="button"
                            className={`nav-item${isActive ? ' is-active' : ''}`}
                            onClick={() => navigate(c.key)}
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

        <main className="content">
          {current && ActiveDemo ? (
            <article className="page">
              <header className="page__head">
                <div className="page__title-row">
                  <h1 className="page__title">{current.name}</h1>
                  <Tag type="success" effect="light" size="small">
                    Stable
                  </Tag>
                </div>
                <p className="page__desc">{current.description}</p>
                {epUrl ? (
                  <p className="page__ref">
                    Element Plus reference:{' '}
                    <Link href={epUrl} type="primary" target="_blank" rel="noreferrer" underline>
                      {current.elementPlus}
                    </Link>
                  </p>
                ) : null}
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

          <footer className="footer">
            <span>Cobos UI — a token-first React design system.</span>
            <span>
              Built with <code>@cobos/react</code> by Ernesto Cobos.
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}

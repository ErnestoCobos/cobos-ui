import type { ReactNode } from 'react';

/**
 * A single labelled example inside a component demo page. Renders a short
 * caption above a surface that holds the live component(s).
 */
export function Example({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="example">
      <header className="example__head">
        <h3 className="example__title">{title}</h3>
        {description ? <p className="example__desc">{description}</p> : null}
      </header>
      <div className="example__stage">{children}</div>
    </section>
  );
}

/** Vertical stack of examples that makes up a component demo page. */
export function DemoStack({ children }: { children: ReactNode }) {
  return <div className="demo-stack">{children}</div>;
}

import { createContext, useContext, useMemo, type ReactNode } from 'react';

export type ComponentSize = 'large' | 'default' | 'small';

export interface ConfigContextValue {
  /** Default size applied to descendant components. */
  size: ComponentSize;
  /** Disable all descendant form controls. */
  disabled: boolean;
  /** Text direction. */
  dir: 'ltr' | 'rtl';
}

const defaultConfig: ConfigContextValue = {
  size: 'default',
  disabled: false,
  dir: 'ltr',
};

export const ConfigContext = createContext<ConfigContextValue>(defaultConfig);

export function useConfig(): ConfigContextValue {
  return useContext(ConfigContext);
}

export interface ConfigProviderProps extends Partial<ConfigContextValue> {
  children?: ReactNode;
}

export function ConfigProvider({ size, disabled, dir, children }: ConfigProviderProps) {
  const parent = useConfig();
  const value = useMemo<ConfigContextValue>(
    () => ({
      // Explicit props override the inherited config; otherwise inherit from the parent.
      size: size ?? parent.size,
      // Disabling composes: once a subtree is disabled it cannot be re-enabled below.
      disabled: (disabled ?? false) || parent.disabled,
      dir: dir ?? parent.dir,
    }),
    [size, disabled, dir, parent.size, parent.disabled, parent.dir],
  );
  return (
    <ConfigContext.Provider value={value}>
      <div className="ec-config-provider" style={{ display: 'contents' }} dir={value.dir}>
        {children}
      </div>
    </ConfigContext.Provider>
  );
}

/** Resolve a component size, falling back to the nearest ConfigProvider, then `default`. */
export function useSize(size?: ComponentSize): ComponentSize {
  const config = useConfig();
  return size ?? config.size ?? 'default';
}

/** Resolve a disabled flag, OR-ed with the nearest ConfigProvider. */
export function useDisabled(disabled?: boolean): boolean {
  const config = useConfig();
  return Boolean(disabled ?? false) || config.disabled;
}

import type { Decorator, Preview } from '@storybook/react-vite';
import { ConfigProvider, type ComponentSize } from '../src';

import '@cobos/tokens/tokens.css';
import '@cobos/react/styles.css';

/** Toggle the `dark` class on the document root, mirroring the runtime API. */
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme as 'light' | 'dark';
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }
  return <Story />;
};

/** Wrap every story in a ConfigProvider so the size global takes effect. */
const withConfig: Decorator = (Story, context) => {
  const size = context.globals.size as ComponentSize;
  return (
    <ConfigProvider size={size}>
      <Story />
    </ConfigProvider>
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // Surface accessibility findings in the panel without failing the run.
      test: 'todo',
    },
  },
  globalTypes: {
    theme: {
      description: 'Color theme',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
    size: {
      description: 'Component size',
      defaultValue: 'default',
      toolbar: {
        title: 'Size',
        icon: 'ruler',
        items: [
          { value: 'large', title: 'Large' },
          { value: 'default', title: 'Default' },
          { value: 'small', title: 'Small' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [withConfig, withTheme],
};

export default preview;

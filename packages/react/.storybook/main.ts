import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  docs: {
    // Generate an autodocs page for every story file tagged with `autodocs`.
    autodocs: 'tag',
  },
  typescript: {
    // Drive the autodocs Props tables from the real TypeScript interfaces and
    // their JSDoc comments rather than from runtime PropTypes.
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      // Only document props that originate from our own source, never the ones
      // inherited from React / the DOM typings in node_modules.
      propFilter: (prop) =>
        prop.parent ? !/node_modules/.test(prop.parent.fileName) : true,
    },
  },
};

export default config;

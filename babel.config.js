// babel.config.js — upgraded for reliability, performance, and modern targets
module.exports = function (api) {
  // Cache the returned config for faster repeated builds
  api.cache(true);

  const isTest = api.env('test');
  const isProd = api.env('production');

  // Shared presets
  const presets = [
    [
      '@babel/preset-env',
      {
        // Use browserslist in package.json for target selection
        // Use built-ins usage to inject polyfills only where needed
        useBuiltIns: 'usage',
        corejs: { version: 3, proposals: true },
        // Enable loose mode for smaller output where safe
        loose: true,
        // Do not transform ES modules in test env to allow Jest to use ESM if configured
        modules: isTest ? 'auto' : false,
        // Enable bugfixes for smaller, more correct output
        bugfixes: true,
      },
    ],
    '@babel/preset-typescript',
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
        // Keep development flag for better DX in dev builds
        development: !isProd,
        // Use built-in JSX transform optimizations
        importSource: undefined,
      },
    ],
  ];

  // Shared plugins
  const plugins = [
    // Dynamic import syntax support
    '@babel/plugin-syntax-dynamic-import',

    // Decorators and class fields
    [
      '@babel/plugin-proposal-decorators',
      { legacy: true },
    ],
    [
      '@babel/plugin-proposal-class-properties',
      { loose: true },
    ],
    [
      '@babel/plugin-proposal-private-methods',
      { loose: true },
    ],
    [
      '@babel/plugin-proposal-private-property-in-object',
      { loose: true },
    ],

    // Useful proposals and transforms
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-proposal-optional-chaining',
  ];

  // Environment-specific tweaks
  if (isTest) {
    // Jest and other test runners often need CommonJS modules
    // Keep transforms minimal to preserve stack traces
    plugins.push('@babel/plugin-transform-modules-commonjs');
  }

  if (isProd) {
    // Production-only optimizations
    // Remove development-only code paths if using env flags
    plugins.push([
      'transform-remove-console',
      { exclude: ['error', 'warn'] },
    ]);
  }

  return {
    presets,
    plugins,
    // Improve performance by enabling assumptions where safe
    assumptions: {
      setPublicClassFields: true,
    },
    // Only compile files in src and tests by default to speed up tooling
    ignore: [
      /node_modules/,
      /dist/,
      /build/,
    ],
  };
};

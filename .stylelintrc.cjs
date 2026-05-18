module.exports = {
    // Core plugins
    plugins: [
        'stylelint-no-unsupported-browser-features',
        'stylelint-scss',
        'stylelint-order'
    ],

    // Base configs
    extends: [
        'stylelint-config-standard-scss',
        'stylelint-config-recommended-vue' // safe default for projects that may include single-file components
    ],

    // Files and folders to ignore from linting
    ignoreFiles: [
        'packages/*/dist/**/*.css',
        'dist/**',
        'node_modules/**',
        '.vercel/**',
        '.next/**'
    ],

    // Parser options for SCSS
    defaultSeverity: 'warning',

    // Rules
    rules: {
        // SCSS specific relaxations kept explicit
        'scss/at-mixin-pattern': null,
        'scss/no-global-function-names': null,
        'scss/dollar-variable-pattern': null,
        'scss/at-extend-no-missing-placeholder': null,
        'scss/percent-placeholder-pattern': null,

        // Color and string rules
        'color-named': 'never',
        'color-no-invalid-hex': true,
        'string-no-newline': true,

        // Declarations and shorthand
        'declaration-block-no-duplicate-properties': [true, { ignore: ['consecutive-duplicates'] }],
        'declaration-block-no-shorthand-property-overrides': true,
        'declaration-block-no-redundant-longhand-properties': null,
        'shorthand-property-no-redundant-values': true,
        'font-family-name-quotes': 'always-unless-keyword',

        // Functions and urls
        'function-calc-no-unspaced-operator': true,
        'function-name-case': 'lower',
        'function-url-quotes': 'always',

        // Selectors and specificity
        'no-duplicate-selectors': true,
        'no-descending-specificity': null,
        'selector-pseudo-class-no-unknown': [
            true,
            {
                ignorePseudoClasses: ['export']
            }
        ],
        'selector-class-pattern': null,
        'selector-id-pattern': null,
        'selector-pseudo-element-colon-notation': 'single',
        'selector-pseudo-element-no-unknown': true,
        'selector-type-case': 'lower',
        'selector-type-no-unknown': [true, { ignoreTypes: ['from', 'to', '0%', '50%', '100%', '_'] }],

        // Units, numbers and timing
        'number-max-precision': 3,
        'time-min-milliseconds': 100,
        'unit-allowed-list': ['fr', 'px', 'em', 'rem', '%', 'svh', 'vw', 'vh', 'deg', 'ms', 's', 'dpcm'],

        // Value casing and invalid comments
        'value-keyword-case': 'lower',
        'no-invalid-double-slash-comments': true,

        // Enforce ordering for readability
        'order/order': [
            'warn',
            {
                order: [
                    'custom-properties',
                    'dollar-variables',
                    'at-rules',
                    'declarations',
                    'rules'
                ]
            }
        ],
        'order/properties-alphabetical-order': null,

        // Browser feature checks
        'plugin/no-unsupported-browser-features': [
            true,
            {
                severity: 'warning',
                browsers: null // uses project's browserslist by default; set explicitly via package.json if needed
            }
        ],

        // Custom property and placeholder patterns relaxed for flexibility
        'custom-property-pattern': null,
        'scss/at-extend-no-missing-placeholder': null
    },

    // File-specific overrides
    overrides: [
        {
            files: ['**/*.scss', '**/*.sass'],
            customSyntax: 'postcss-scss',
            rules: {
                // Allow more precision in utility files
                'number-max-precision': 4
            }
        },
        {
            files: ['**/*.css'],
            rules: {
                // CSS-only files may not use SCSS rules
                'scss/dollar-variable-pattern': null
            }
        }
    ]
};

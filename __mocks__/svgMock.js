// __mocks__/svgMock.js

// Default export: when you import an SVG file directly
module.exports = 'svg-mock';

// Named export: when you use `import { ReactComponent as Icon } from './icon.svg'`
module.exports.ReactComponent = () => 'svg-mock-component';

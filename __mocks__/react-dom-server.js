// __mocks__/react-dom-server.js

// We stub out the methods from react-dom/server so Jest tests don’t break
// when components or libraries attempt to use server-side rendering.

module.exports = {
  renderToString: () => '<div>test-render-string</div>',
  renderToStaticMarkup: () => '<div>test-static-markup</div>',
  renderToNodeStream: () => {
    const { Readable } = require('stream');
    const stream = new Readable();
    stream.push('<div>test-node-stream</div>');
    stream.push(null);
    return stream;
  },
  renderToStaticNodeStream: () => {
    const { Readable } = require('stream');
    const stream = new Readable();
    stream.push('<div>test-static-node-stream</div>');
    stream.push(null);
    return stream;
  },
};

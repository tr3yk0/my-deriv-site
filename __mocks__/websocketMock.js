class WebSocketMock {
  constructor(url) {
    this.url = url;
    this.readyState = WebSocketMock.CONNECTING;
    this.sentMessages = [];
    this.onopen = null;
    this.onmessage = null;
    this.onclose = null;
    this.onerror = null;

    // Simulate async connection
    setTimeout(() => {
      this.readyState = WebSocketMock.OPEN;
      if (this.onopen) this.onopen({ type: 'open' });
    }, 10);
  }

  send(message) {
    this.sentMessages.push(message);
    // Echo back a fake response
    if (this.onmessage) {
      this.onmessage({ data: JSON.stringify({ echo: message }) });
    }
  }

  close() {
    this.readyState = WebSocketMock.CLOSED;
    if (this.onclose) this.onclose({ type: 'close' });
  }
}

WebSocketMock.CONNECTING = 0;
WebSocketMock.OPEN = 1;
WebSocketMock.CLOSING = 2;
WebSocketMock.CLOSED = 3;

module.exports = WebSocketMock;

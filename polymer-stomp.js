import {
  html,
  PolymerElement
} from '@polymer/polymer/polymer-element.js';

// import 'stomp-websocket';

// import 'sockjs';

/**
 * `polymer-stomp`
 * 
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class polymerStomp extends PolymerElement {

  static get template() {
    return html `
      <style>
        :host {
          display: block;
        }
      </style>
      <h2>Hello [[prop1]]!</h2>
    `;
  }
  static get properties() {
    return {
      autoConnect: {
        type: Boolean
      },
      url: {
        type: String,
        notify: true
      },
      topic: {
        type: String,
        notify: true,
        observer: '_topicChanged'
      },
      debug: {
        type: Boolean,
        notify: true
      },
      online: {
        type: Boolean,
        notify: true
      },
      connectHeaders: {
        type: String,
        notify: true
      },
      sendHeaders: {
        type: String,
        notify: true
      },
      sendTopic: {
        type: String,
        notify: true
      },
      additionalSendHeaders: {
        type: String
      }
    };
  }
  constructor() {
    super();
  }

  _topicChanged(newValue, oldValue) {
    this.connect(newValue);
  }

  ready() {
    super.ready();

    if (this.autoConnect) {
      this.connect();
    }
  }

  connect() {
    if (this.socket)
      this.close();
    if (!this.url || !this.topic)
       return;

    this.socket = new SockJS(this.url);
    var topic = this.topic;

    var connectHeaders = {};
    if ((typeof(this.connectHeaders) !== 'undefined')) {
      connectHeaders = JSON.parse(this.connectHeaders);
    } 

    this.stompClient = Stomp.over(this.socket);

    if (!this.debug) {
      this.stompClient.debug = null;
    }

    this.stompClient.connect(connectHeaders, () => {
      this.subscribe(topic);
    }, function (err) {
      console.error(err);
    });
  }

  _handleEvent(event) {
    //console.log(event.detail);
    this.dispatchEvent(new CustomEvent('message', {detail: event.detail}));
    this.send('echo');
  }

  subscribe(topic) {
    var element = this;
    this.stompClient.subscribe(topic, function (message) {
      var parsedMessage = JSON.parse(message.body);
      var event = new CustomEvent('message', {
        'detail': parsedMessage
      });

      element._handleEvent(event);
    });
  }

  send(message) {
    if (this.stompClient) {

      var msg = message;
      if (typeof(this.additionalSendHeaders) !== 'undefined') {
        var msg = JSON.parse(this.additionalSendHeaders);
        msg.text = message;
      }

      var sendHeaders = {};
      if (typeof(this.sendHeaders) !== 'undefined') {
        sendHeaders = JSON.parse(this.sendHeaders);
      }
      this.stompClient.send(this.sendTopic, sendHeaders, JSON.stringify(msg));
    }
  }

  close() {
    if (this.socket)
      this.socket.close();
  }

}

window.customElements.define('polymer-stomp', polymerStomp);
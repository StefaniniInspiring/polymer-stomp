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
        type: String
      },
      url: {
        type: String,
        notify: true
      },
      topic: {
        type: String,
        notify: true
      },
      debug: {
        type: String,
        notify: true
      }
    };
  }
  constructor() {
    super();
  }

  ready() {
    super.ready();

    if (this.autoConnect !== 'false') {
      this.socket = new SockJS(this.url);

      var actorId = '0-54-1481162456609';
      var topic = this.topic
      var element = this

      var connectHeaders = {
        'actorId': actorId,
        'requestId': actorId + "-" + Date.now()
      };

      var stompClient = Stomp.over(this.socket);
      
      if (this.debug === 'false') {
        stompClient.debug = null;
      }
      
      stompClient.connect(connectHeaders, function () {
        stompClient.subscribe(topic, function (message) {
          var parsedMessage = JSON.parse(message.body);
          var event = new CustomEvent('message', {
            'detail': parsedMessage
          });

          element._handleEvent(event);
        });
      }, function (err) {
        console.error(err);
      });
      
    }

  }

  _handleEvent(event) {
    console.log(event.detail);
    //this.fire('message', event.detail);
  }

  send(message) {
    if (this.socket)
      this.socket.send(message);
  }

  close() {
    if (this.socket)
      this.socket.close();
  }

  connect() {
    if (this.socket)
      this.close();
    if (!this.url || !this.topic)
      return;
    this.socket = new SockJS(this.url);
    var stompClient = Stomp.over(this.socket);
    var topic = this.topic
    var element = this
    stompClient.connect({}, function () {
      stompClient.subscribe(topic, function (message) {
        var parsedMessage = JSON.parse(message.body);
        var event = new CustomEvent('message', {
          'detail': parsedMessage
        });
        element._handleEvent(event);
      });
    });
  }
}

window.customElements.define('polymer-stomp', polymerStomp);
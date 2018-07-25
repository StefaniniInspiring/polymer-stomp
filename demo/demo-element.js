import {
    PolymerElement,
    html
} from '@polymer/polymer/polymer-element.js';
import '../polymer-stomp.js';

class DemoElement extends PolymerElement {
    static get template() {
        return html `
        <span>Topico</span>
        <iron-input bind-value="{{topic}}">
            <input value="{{topic::input}}" style="width: 400px;">
        </iron-input>
        <polymer-stomp 
            url="https://server.febrafar.hom.stefaniniinspiring.com.br/singleinstance/chat" 
            topic="{{topic}}"
            auto-connect
            debug
            connect-headers='{
                "actorId": "0-54-1484575765732",
                "requestId": "0-54-1484575765732"
            }'
            send-topic="/app/chat/message"
            send-headers='{
                "requestId": "0-54-1484575765732"
            }'
            additional-send-headers='{
                "id": "0-54-1484575765732",
                "conversation": "mSFOL-641-1527077280270"
            }'>
        </polymer-stomp>
    `;
    }

    constructor() {
        super();

        this.topic = '/queue/message/0-54-1484575765732';
    }

    _message(fav) {
        if (fav) {
            return 'You really like me!';
        } else {
            return 'Do you like me?';
        }
    }
}

customElements.define('demo-element', DemoElement);
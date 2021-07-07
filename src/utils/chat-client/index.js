import { ChatEvents } from "constant";

export class ChatClient extends EventTarget {
  constructor(socketURL) {
    super();
    this.socketURL = socketURL;
    this.ws = null;
  }

  setupEventHandlers = () => {
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("##", data);
      switch (data.status) {
        case "error":
          this.triggerEvent(ChatEvents.ERROR, data.error);
          break;
        case "ok":
          if (data.chat) {
            this.triggerEvent(ChatEvents.STATUS, data.chat);
          }
          if (data.event === "message") {
            this.triggerEvent(ChatEvents.MESSAGE, data.message);
          }
          if (data.event === "joined") {
            this.triggerEvent(ChatEvents.JOINED, data.participant);
          }
          break;
        default:
          break;
      }
    };

    this.ws.onopen = () => {
      this.triggerEvent(ChatEvents.OPEN);

      // Join Channel With Token
      this.sendData({
        action: "join",
        chat: this.channel,
        token: this.token,
      });
    };

    this.ws.onerror = (event) => {
      console.log(`Chat WS error: ${JSON.stringify(event.data)}`);
    };

    this.ws.onclose = (event) => {
      console.log("Chat WS closed: ", event);
      this.ws = undefined;
    };
  };

  /***************************
   * WebSocket Communication *
   ***************************/
  sendData = (data) => {
    if (this.ws) {
      this.ws.send(JSON.stringify(data));
    }
  };

  connect = (channel, token) => {
    this.ws = new WebSocket(this.socketURL);
    this.channel = channel;
    this.token = token;

    this.setupEventHandlers();
  };

  disconnect = () => {
    if (this.ws) this.ws.close();
  };

  /***************************
   * Custom Event Management *
   ***************************/
  on = (event, handler) => {
    this.addEventListener(event, (e) => {
      if (handler) {
        handler(e.detail);
      }
    });
  };

  off = (event, handler) => {
    this.removeEventListener(event, handler);
  };

  triggerEvent = (name, payload) => {
    this.dispatchEvent(new CustomEvent(name, { detail: payload }));
  };
}

import { GameEvents } from "constant";

export default class GameClient extends EventTarget {
  constructor(socketURL) {
    super();
    this.socketURL = socketURL;
    this.gameId = null;
  }
  getWebSocket = () => {
    return this.ws;
  };
  setWebSocketURL = (socketURL) => {
    this.socketURL = socketURL;
  };

  setupEventHandlers = () => {
    this.ws.onmessage = (event) => {
      // console.log(`<- SS: ${event.data}`);
      var msg = JSON.parse(event.data);
      console.log(msg);
      if (msg.status === "ok") {
        if (msg.game) {
          if (!this.gameId) this.gameId = msg.game.id;
          this.triggerEvent(GameEvents.GET_RESPONSE, msg);
        } else if (msg.pong) {
          // This is Ping Pong
        } else if (msg.drawOffer === 0 || msg.drawOffer === 1) {
          // Offering Draw
        }
        if (msg.user) {
          this.triggerEvent(GameEvents.AUTHENTICATED, msg);
        }
      }
    };

    this.ws.onopen = (event) => {
      console.log("OPEN SOCKET: ", event);
      this.triggerEvent(GameEvents.OPENED);
    };

    this.ws.onerror = (event) => {
      console.log(`WS error: ${JSON.stringify(event.data)}`);
    };

    this.ws.onclose = (event) => {
      console.log(`WS closed: ${event.data}`);
      this.ws = undefined;
    };
  };

  /***************************
   * WebSocket Communication *
   ***************************/
  sendData = (data) => {
    if (this.ws) {
      // console.log(`-> SS: ${data}`);
      this.ws.send(JSON.stringify(data));
    }
  };

  connect = () => {
    this.ws = new WebSocket(this.socketURL);
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

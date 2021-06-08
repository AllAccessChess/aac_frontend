export const GAME_ACTIONS = {
  join: "join",
  status: "status",
  rm: "rm",
  move: "move",
  resign: "resign",
};

export const GAME_EVENTS = {
  GET_RESPONSE: "GET_RESPONSE",
};

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
      console.log(JSON.stringify(msg));
      if (msg.id && !this.gameId) this.gameId = msg.id;
      this.triggerEvent(GAME_EVENTS.GET_RESPONSE, msg);
    };

    this.ws.onopen = (event) => {
      console.log("OPEN SOCKET");
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
      this.ws.send(data);
    }
  };

  connect = () => {
    this.ws = new WebSocket(this.socketURL);
    this.setupEventHandlers();
  };

  disconnect = () => {
    this.ws.close();
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

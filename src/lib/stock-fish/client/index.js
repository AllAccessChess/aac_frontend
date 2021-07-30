// AAC StockFish Library - StockFish Client

const STOCKFISH = window.STOCKFISH;

export const LogLevel = Object.freeze({
  NONE: 4,
  ERROR: 3,
  WARN: 2,
  INFO: 1,
  DEBUG: 0,
});

export default class StockFishClient extends EventTarget {
  constructor(logLevel = LogLevel.INFO) {
    super();

    // StockFish Engine for Possible & Best Moves using 5 depth
    this.engine =
      typeof STOCKFISH === "function"
        ? STOCKFISH()
        : new Worker("/stockfish.js");

    // Game Turn
    this.turn = "w";

    // StockFish Engine Configuration
    this.config = {
      wtime: 3000,
      btime: 3000,
      winc: 1500,
      binc: 1500,
      // depth: 12,
    };

    // Log Level
    this.logLevel = logLevel;
  }

  //=====================================================================

  /********************
   *     Getter       *
   ********************/

  get logLevelString() {
    const logStrs = ["DEBUG", "INFO", "WARN", "ERROR", "NONE"];
    return logStrs[this.logLevel];
  }

  //=====================================================================

  /***************************
   *     Engine <-> GUI      *
   ***************************/

  /**
   * Engine Response Handler
   */
  setupEngineResponseHandler = () => {
    this.handleLog(LogLevel.INFO, "Setting Up Engine Reponse Handler");

    const _this = this;

    this.engine.onmessage = (event) => {
      let line;

      if (event && typeof event === "object") {
        line = event.data;
      } else {
        line = event;
      }

      this.handleLog(LogLevel.DEBUG, "Engine Reply", line);

      // UCI OK
      if (line === "uciok") {
        _this.triggerEvent("engine-loaded");
      }

      // Ready OK
      if (line === "readyok") {
        _this.triggerEvent("engine-ready");
      }

      // Best Move
      const bvMatch = line.match(/bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);

      if (bvMatch && bvMatch.length > 3) {
        _this.triggerEvent("best-move", {
          bestMove: {
            from: bvMatch[1],
            to: bvMatch[2],
            promotion: bvMatch[3],
          },
        });
      }

      // Best Move in go infinite
      const bvInfMatch = line.match(/pv ([a-h][1-8])([a-h][1-8])([qrbn])?/);

      if (bvInfMatch && bvInfMatch.length > 3) {
        _this.triggerEvent("best-move", {
          bestMove: {
            from: bvInfMatch[1],
            to: bvInfMatch[2],
            promotion: bvInfMatch[3],
          },
          engineStopped: false,
        });
      }

      // Ponder
      const pdMatch = line.match(/ponder ([a-h][1-8])([a-h][1-8])([qrbn])?/);

      if (pdMatch && pdMatch.length > 3) {
        _this.triggerEvent("ponder", {
          from: pdMatch[1],
          to: pdMatch[2],
          promotion: pdMatch[3],
        });
      }

      // Possible Moves
      const pvSanMatch = line.match(/^info .*\bpvSan (.*?) bmc/);
      if (pvSanMatch && pvSanMatch.length > 1) {
        _this.triggerEvent("possible-moves-san", pvSanMatch[1]);
      }

      // Score
      const scoreMatch = line.match(/^info .*\bscore (\w+) (-?\d+)/);
      if (scoreMatch) {
        let score = parseInt(scoreMatch[2], 10) * (_this.turn === "w" ? 1 : -1);
        score = (score / 100.0).toFixed(1);

        _this.triggerEvent("score", score);
      }

      // Depth
      const depthMath = line.match(/depth ([0-9]+)/);

      if (depthMath && depthMath.length > 1) {
        _this.triggerEvent("depth", parseInt(depthMath[1]));
      }
    };
  };

  /**
   * Remove Engine Response Handler
   */
  removeEngineResponseHandler = () => {
    this.engine.onmessage = null;
  };

  /**
   * Send UCI Command to Engine
   */
  uciCmd = (cmd, engine) => {
    this.handleLog(LogLevel.DEBUG, "Sending Command to SF Engine", cmd);

    (engine || this.engine).postMessage(cmd);
  };

  //=====================================================================

  /***************************
   *    Public Interface     *
   ***************************/

  /**
   * Initialize Engine
   */
  initialize = () => {
    this.handleLog(LogLevel.INFO, "Initializing Engine");

    // Switch to UCI mode
    this.uciCmd("uci");

    // Set up Engine Response Handlers
    this.setupEngineResponseHandler();
  };

  /**
   * Start Engine
   */
  start = () => {
    this.handleLog(LogLevel.INFO, "Staring Engine");

    this.uciCmd("ucinewgame");
    this.uciCmd("isready");
  };

  /**
   * Go
   */
  go = (fen, turn) => {
    this.handleLog(LogLevel.INFO, "Run Engine");

    this.turn = turn;

    if (fen) {
      this.uciCmd("position fen " + fen);
    }

    this.uciCmd(
      this.config.depth ? `go depth ${this.config.depth}` : "go infinite"
    );
  };

  /**
   * Go Infinite
   */
  goInfinite = () => {
    this.uciCmd("go infinite");
  };

  /**
   * Stop
   */
  stop = () => {
    if (this.engine) {
      this.removeEngineResponseHandler();

      delete this.engine;

      this.engine =
        typeof STOCKFISH === "function"
          ? STOCKFISH()
          : new Worker("/stockfish.js");

      this.initialize();
    }

    this.triggerEvent("stopped");
  };

  //=====================================================================

  /***************************
   * Custom Event Management *
   ***************************/

  /**
   * Add Event Handler
   * @param {*} event
   * @param {*} handler
   */
  on = (event, handler) => {
    this.addEventListener(event, (e) => {
      if (handler) {
        handler(e.detail);
      }
    });
  };

  /**
   * Remove Event Handler
   * @param {*} event
   * @param {*} handler
   */
  off = (event, handler) => {
    this.removeEventListener(event, handler);
  };

  /**
   * Trigger Custom Event
   * @param {*} name
   * @param {*} payload
   */
  triggerEvent = (name, payload) => {
    this.dispatchEvent(new CustomEvent(name, { detail: payload }));
  };

  //=====================================================================

  /****************************
   *        Logging           *
   ****************************/

  /**
   * Error Handler
   * @param err
   */
  handleError = (err) => this.handleLog(LogLevel.ERROR, JSON.stringify(err));

  /**
   * Log Handler
   * @param logLevel
   * @param args
   */
  handleLog = (logLevel, ...args) => {
    if (this.logLevel <= logLevel) {
      console.log(`STOCKFISH CLIENT : ${this.logLevelString} :`, ...args);
    }
  };
}

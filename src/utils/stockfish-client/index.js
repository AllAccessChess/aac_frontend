const STOCKFISH = window.STOCKFISH;

export default class StockFishClient extends EventTarget {
  constructor(game, playerColor) {
    super();
    this.game = game;
    this.playerColor = playerColor;
    this.engine =
      typeof STOCKFISH === "function"
        ? STOCKFISH()
        : new Worker("stockfish.js");
    this.evaler =
      typeof STOCKFISH === "function"
        ? STOCKFISH()
        : new Worker("stockfish.js");
    this.engineStatus = {};
    this.time = { wtime: 3000, btime: 3000, winc: 1500, binc: 1500 };
    this.uciCmd("uci");

    this.initHandlers();
  }

  uciCmd = (cmd, which) => {
    (which || this.engine).postMessage(cmd);
  };

  get_moves = () => {
    let moves = "";
    let history = this.game.history({ verbose: true });

    for (let i = 0; i < history.length; ++i) {
      let move = history[i];
      moves +=
        " " + move.from + move.to + (move.promotion ? move.promotion : "");
    }

    return moves;
  };

  prepareMove = () => {
    let turn = this.game.turn() === "w" ? "white" : "black";
    if (!this.game.game_over()) {
      if (turn !== this.playerColor) {
        this.uciCmd("position startpos moves" + this.get_moves());
        this.uciCmd("position startpos moves" + this.get_moves(), this.evaler);
        this.uciCmd("eval", this.evaler);

        if (this.time && this.time.wtime) {
          this.uciCmd(
            "go " +
              (this.time.depth ? "depth " + this.time.depth : "") +
              " wtime " +
              this.time.wtime +
              " winc " +
              this.time.winc +
              " btime " +
              this.time.btime +
              " binc " +
              this.time.binc
          );
        } else {
          this.uciCmd(
            "go " + (this.time.depth ? "depth " + this.time.depth : "")
          );
        }
        // isEngineRunning = true;
      }
    }
  };

  initHandlers = () => {
    this.evaler.onmessage = (event) => {
      let line;

      if (event && typeof event === "object") {
        line = event.data;
      } else {
        line = event;
      }

      // console.log('evaler: ' + line);

      /// Ignore some output.
      if (
        line === "uciok" ||
        line === "readyok" ||
        line.substr(0, 11) === "option name"
      ) {
        return;
      }
    };

    this.engine.onmessage = (event) => {
      let line;

      if (event && typeof event === "object") {
        line = event.data;
      } else {
        line = event;
      }
      // console.log('Reply: ' + line);
      if (line === "uciok") {
        this.engineStatus.engineLoaded = true;
      } else if (line === "readyok") {
        this.engineStatus.engineReady = true;
      } else {
        let match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
        /// Did the AI move?
        if (match) {
          // isEngineRunning = false;
          const move = this.game.move({
            from: match[1],
            to: match[2],
            promotion: match[3],
          });
          const fen = this.game.fen();
          this.triggerEvent("move", { move, fen });

          this.prepareMove();
          this.uciCmd("eval", this.evaler);
          //uciCmd("eval");
          /// Is it sending feedback?
        } else if (
          (match = line.match(/^info .*\bdepth (\d+) .*\bnps (\d+)/))
        ) {
          this.engineStatus.search = "Depth: " + match[1] + " Nps: " + match[2];
        }

        /// Is it sending feed back with a score?
        if ((match = line.match(/^info .*\bscore (\w+) (-?\d+)/))) {
          let score =
            parseInt(match[2], 10) * (this.game.turn() === "w" ? 1 : -1);
          /// Is it measuring in centipawns?
          if (match[1] === "cp") {
            this.engineStatus.score = (score / 100.0).toFixed(2);
            /// Did it find a mate?
          } else if (match[1] === "mate") {
            this.engineStatus.score = "Mate in " + Math.abs(score);
          }

          /// Is the score bounded?
          if ((match = line.match(/\b(upper|lower)bound\b/))) {
            this.engineStatus.score =
              ((match[1] === "upper") === (this.game.turn() === "w")
                ? "<= "
                : ">= ") + this.engineStatus.score;
          }
        }
      }
      // displayStatus();
    };
  };

  start = () => {
    this.uciCmd("ucinewgame");
    this.uciCmd("isready");
    this.engineStatus.engineReady = false;
    this.engineStatus.search = null;
    this.prepareMove();
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

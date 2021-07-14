const STOCKFISH = window.STOCKFISH;

export default class StockFishClient {
  constructor(game, setFen, playerColor) {
    this.game = game;
    this.setFen = setFen;
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
    this.clockTimeoutID = null;
    this.uciCmd("uci");

    this.initHandlers();
  }

  uciCmd = (cmd, which) => {
    (which || this.engine).postMessage(cmd);
  };

  clockTick = () => {
    let t =
      (this.time.clockColor === "white" ? this.time.wtime : this.time.btime) +
      this.time.startTime -
      Date.now();
    let timeToNextSecond = (t % 1000) + 1;
    this.clockTimeoutID = setTimeout(this.clockTick, timeToNextSecond);
  };

  stopClock = () => {
    if (this.clockTimeoutID !== null) {
      clearTimeout(this.clockTimeoutID);
      this.clockTimeoutID = null;
    }
    if (this.time.startTime > 0) {
      let elapsed = Date.now() - this.time.startTime;
      this.time.startTime = null;
      if (this.time.clockColor === "white") {
        this.time.wtime = Math.max(0, this.time.wtime - elapsed);
      } else {
        this.time.btime = Math.max(0, this.time.btime - elapsed);
      }
    }
  };

  startClock = () => {
    if (this.game.turn() === "w") {
      this.time.wtime += this.time.winc;
      this.time.clockColor = "white";
    } else {
      this.time.btime += this.time.binc;
      this.time.clockColor = "black";
    }
    this.time.startTime = Date.now();
    this.clockTick();
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
    this.stopClock();
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
      if (
        this.game.history().length >= 2 &&
        !this.time.depth &&
        !this.time.nodes
      ) {
        this.startClock();
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
          this.game.move({ from: match[1], to: match[2], promotion: match[3] });
          this.setFen(this.game.fen());
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
}

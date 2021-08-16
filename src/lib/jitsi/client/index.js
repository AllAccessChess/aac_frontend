// AAC Jitsi Library - Jitsi Client

import { snakeCaseString } from "utils/common";
import DOMManager from "./domManager";
import { loadScript } from "./helpers";

export const LogLevel = Object.freeze({
  NONE: 4,
  ERROR: 3,
  WARN: 2,
  INFO: 1,
  DEBUG: 0,
});

export default class JitsiClient extends EventTarget {
  /**
   * constructor
   */
  constructor(domain, logLevel = LogLevel.INFO) {
    super();

    // Jitsi Object
    this.connection = null;
    this.conference = null;
    this.isJoined = false;

    // Jitsi Configuration
    this.domain = domain;

    // Meeting Configuration
    this.meetingId = null;
    this.userName = null;
    this.settings = {
      audio: true,
      video: true,
    };

    // Log Level
    this.logLevel = logLevel;

    // DOM Manager
    this.domManager = new DOMManager(this);
  }

  //=====================================================================

  /********************
   *     Getter       *
   ********************/

  get logLevelString() {
    const logStrs = ["DEBUG", "INFO", "WARN", "ERROR", "NONE"];
    return logStrs[this.logLevel];
  }

  get JitsiMeetJS() {
    return window.JitsiMeetJS;
  }

  //=====================================================================

  /********************
   * SDK Installation *
   ********************/

  /**
   * Initialize the SDK
   */
  initialize = (callback) => {
    const _this = this;

    loadScript("https://code.jquery.com/jquery-3.5.1.min.js", () => {
      loadScript("https://meet.jit.si/libs/lib-jitsi-meet.min.js", () => {
        if (!_this.JitsiMeetJS) {
          _this.handleError("JitsiMeetJS is not installed.");
          throw new Error("JitsiMeetJS is not installed.");
        }

        _this.handleLog(LogLevel.INFO, "Initializing.");
        _this.JitsiMeetJS.init({
          disableAudioLevels: true,
          enableAnalyticsLogging: true,
        });

        _this.handleLog(LogLevel.DEBUG, "Setting Log Level.");
        _this.JitsiMeetJS.setLogLevel(this.JitsiMeetJS.logLevels.WARN);

        if (callback) {
          callback();
        }
      });
    });
  };

  //=====================================================================

  /*********************
   *  Jitsi Interface  *
   *********************/

  /**
   * Connect
   */
  connect = () => {
    this.handleLog(LogLevel.DEBUG, "Creating Connection.");
    this.connection = new this.JitsiMeetJS.JitsiConnection(null, null, {
      hosts: {
        domain: "meet.jitsi",
        muc: "muc.meet.jitsi",
        // anonymousdomain: "guest.meet.jitsi",
      },
      serviceUrl: `wss://${this.domain}/xmpp-websocket`,
      websocketKeepAlive: 0,
    });

    this.setupConnectionEventListener();

    this.handleLog(LogLevel.INFO, "Connecting to Jitsi Server.");
    // this.connection.connect(this.password);  // meeting with password
    this.connection.connect();
  };

  /**
   * Disconnect
   */
  disconnect = () => {
    this.handleLog(LogLevel.DEBUG, "Leaving the Conference.");

    this.conference.leave();
  };

  /**
   * Setup Connection Event Handlers
   */
  setupConnectionEventListener = () => {
    this.handleLog(LogLevel.DEBUG, "Setting Up Connection Event Handlers.");

    this.connection.addEventListener(
      this.JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
      this.onConnectionSuccess
    );

    this.connection.addEventListener(
      this.JitsiMeetJS.events.connection.CONNECTION_FAILED,
      this.onConnectionFailed
    );

    this.connection.addEventListener(
      this.JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
      this.onConnectionDisconnected
    );
  };

  /**
   * Remove Connection Event Handlers
   */
  removeConnectionEventListener = () => {
    this.handleLog(LogLevel.DEBUG, "Removing Connection Event Handlers.");

    this.connection.removeEventListener(
      this.JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
      this.onConnectionSuccess
    );

    this.connection.removeEventListener(
      this.JitsiMeetJS.events.connection.CONNECTION_FAILED,
      this.onConnectionFailed
    );

    this.connection.removeEventListener(
      this.JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
      this.onConnectionDisconnected
    );
  };

  /**
   * Event Handler for CONNECTION_ESTABLISHED
   * @param {object} evt
   */
  onConnectionSuccess = (evt) => {
    this.handleLog(LogLevel.INFO, "Connection Established.", evt);

    this.joinConference();
  };

  /**
   * Event Handler for CONNECTION_FAILED
   * @param {object} evt
   */
  onConnectionFailed = (evt) => {
    this.handleLog(LogLevel.INFO, "Connection Failed.", evt);

    this.removeConnectionEventListener();
  };

  /**
   * Event Handler for CONNECTION_DISCONNECTED
   * @param {object} evt
   */
  onConnectionDisconnected = () => {
    this.handleLog(LogLevel.INFO, "Connection Disconnected.");

    this.removeConnectionEventListener();
  };

  /**
   * Join Conference
   * @param {string} name
   */
  joinConference = () => {
    this.handleLog(
      LogLevel.DEBUG,
      "Creating Conference Object:",
      this.meetingId
    );
    this.conference = this.connection.initJitsiConference(this.meetingId, {});

    this.setupConferenceEventListener();

    this.handleLog(LogLevel.INFO, "Joining Conference:", this.meetingId);
    this.conference.join();
  };

  /**
   * Leave Conference
   */
  leaveConference = () => {
    this.handleLog(LogLevel.INFO, "Leaving Conference:", this.meetingId);

    if (this.conference) {
      const localTracks = this.conference.getLocalTracks();

      this.conference.leave();

      for (const localTrack of localTracks) {
        localTrack.dispose();
      }
    }
  };

  /**
   * Setup Conference Event Handlers
   */
  setupConferenceEventListener = () => {
    this.handleLog(LogLevel.DEBUG, "Setting Up Conference Event Handlers.");

    this.conference.on(
      this.JitsiMeetJS.events.conference.CONFERENCE_JOINED,
      this.onConferenceJoined
    );

    this.conference.on(
      this.JitsiMeetJS.events.conference.TRACK_ADDED,
      this.onRemoteTrack
    );

    this.conference.on(
      this.JitsiMeetJS.events.conference.CONFERENCE_LEFT,
      this.onConferenceLeft
    );
  };

  /**
   * Remove Conference Event Handlers
   */
  removeConferenceEventListener = () => {
    this.handleLog(LogLevel.DEBUG, "Removing Conference Event Handlers.");

    this.conference.off(
      this.JitsiMeetJS.events.conference.CONFERENCE_JOINED,
      this.onConferenceJoined
    );

    this.conference.off(
      this.JitsiMeetJS.events.conference.TRACK_ADDED,
      this.onRemoteTrack
    );

    this.conference.off(
      this.JitsiMeetJS.events.conference.CONFERENCE_LEFT,
      this.onConferenceLeft
    );
  };

  /**
   * Event Handler for CONFERENCE_JOINED
   */
  onConferenceJoined = () => {
    this.handleLog(LogLevel.INFO, "Joined Conference:", this.meetingId);

    this.isJoined = true;

    this.conference.setDisplayName(this.userName);

    const devices = [];
    if (this.settings.audio) {
      devices.push("audio");
    }
    if (this.settings.video) {
      devices.push("video");
    }
    if (devices.length) {
      this.JitsiMeetJS.createLocalTracks({ devices })
        .then(this.onLocalTracks)
        .catch((error) => {
          throw error;
        });

      this.conference.sendCommand("follow-me", {
        attributes: {
          tileViewEnabled: true,
        },
      });

      this.conference
        .startRecording({
          mode: "file",
        })
        .then(() => {
          this.handleLog(LogLevel.INFO, "Recording Started");
        })
        .catch((error) => {
          this.handleError(error);
          throw error;
        });
    }
  };

  /**
   * Event Handler for CONFERENCE_LEFT
   */
  onConferenceLeft = () => {
    this.handleLog(LogLevel.INFO, "Left Conference:", this.meetingId);

    this.isJoined = false;
    this.removeConferenceEventListener();

    this.connection.disconnect();
  };

  /**
   * Event Handler for TRACK_ADDED
   * @param {objet} track
   */
  onRemoteTrack = (track) => {
    this.handleLog(LogLevel.DEBUG, "Remote Track Added:", track);

    if (track.isLocal()) {
      return;
    }

    const participantId = track.getParticipantId();

    const participant = this.conference
      .getParticipants()
      .find((participant) => participant._id === participantId);

    if (participant && participant._displayName) {
      const dom = document.getElementById(
        `${snakeCaseString(participant._displayName)}-${track.getType()}`
      );
      if (dom) {
        track.attach(dom);
      }
    }
  };

  /**
   * Event Handler for Local Track Added
   * @param {array} tracks
   */
  onLocalTracks = (tracks) => {
    this.handleLog(LogLevel.DEBUG, "Local Tracks Added:", tracks);

    for (let i = 0; i < tracks.length; i++) {
      if (this.isJoined) {
        this.conference.addTrack(tracks[i]);
      }

      if (tracks[i].getType() === "video") {
        tracks[i].attach(
          document.getElementById(
            `${snakeCaseString(this.userName)}-${tracks[i].getType()}`
          )
        );
      }
    }
  };

  //=====================================================================

  /*********************
   * Public  Interface *
   *********************/

  /**
   * Join Meeting
   * @param {object} options
   */
  joinMeeting = ({ meetingId, password, userName, settings }) => {
    this.meetingId = meetingId;
    // this.password = password;
    this.userName = userName;
    this.settings = {
      audio: !settings || settings.audio === undefined ? true : false,
      video: !settings || settings.video === undefined ? true : false,
    };

    if (!this.meetingId) {
      this.handleLog(LogLevel.WARN, "Meeting ID is empty.");
      return;
    }
    if (!this.userName) {
      this.handleLog(LogLevel.WARN, "User Name is empty.");
      return;
    }
    this.connect();
  };

  /**
   * Leave Meeting
   */
  leaveMeeting = () => {
    this.leaveConference();
  };

  //=====================================================================

  /*********************
   *      Logging      *
   *********************/

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
      console.log(`JITSI CLIENT : ${this.logLevelString} :`, ...args);
    }
  };
}

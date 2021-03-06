// AAC Zoom Library - Zoom Client

import { ZoomMtg } from "@zoomus/websdk";

import { ZoomLocale, ZoomMeetingRole } from "./constants";
import DOMManager from "./domManager";
import { loadStyleSheet } from "./helpers";

export { loadStyleSheet };

export default class ZoomClient extends EventTarget {
  /**
   * constructor
   *
   * @param {string} apiKey
   * @param {string} locale
   */
  constructor(apiKey, locale = ZoomLocale.EN) {
    super();

    // Zoom SDK configuration
    this.apiKey = apiKey;
    this.locale = locale;

    // User Data
    this.userName = null;
    this.userEmail = null;
    this.userRole = ZoomMeetingRole.Attendee;

    // Meeting Info
    this.meetingNumber = null;
    this.passWord = null;
    this.userIds = [];
    this.customRenderingEnabled = true;

    this.domManager = new DOMManager(this);
  }

  //=====================================================================

  /********************
   * SDK Installation *
   ********************/

  /**
   * Check system compatibility
   *
   * @returns boolean | string
   */
  checkSystemRequirements = () => {
    return ZoomMtg.checkSystemRequirements();
  };

  /**
   * Initialize the SDK
   */
  initialize = () => {
    // Load Stylesheets
    loadStyleSheet("/zoom.css");

    // Use javascript library from cloud
    ZoomMtg.setZoomJSLib("https://source.zoom.us/1.9.6/lib", "/av");

    // Preload Wasm and JS SDK
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareJssdk();

    // loads language files, also passes any error messages to the ui
    ZoomMtg.i18n.load(this.locale);
    ZoomMtg.i18n.reload(this.locale);

    // Setup Event Handlers
    this.setupEventHandlers();
  };

  //=====================================================================

  /*******************
   * Zoom SDK Events *
   *******************/

  /**
   * Setup Event Handlers
   */
  setupEventHandlers = () => {
    ZoomMtg.inMeetingServiceListener("onUserJoin", this.onUserJoin);
    ZoomMtg.inMeetingServiceListener("onUserLeave", this.onUserLeave);
    ZoomMtg.inMeetingServiceListener(
      "onUserIsInWaitingRoom",
      this.onUserIsInWaitingRoom
    );
    ZoomMtg.inMeetingServiceListener("onMeetingStatus", this.onMeetingStatus);
  };

  /**
   * On User Join event
   *
   * @param {object} data
   */
  onUserJoin = (data) => {
    this.userIds.push(data.userId);
    this.triggerEvent("onUserJoin", data);
  };

  /**
   * On User Leave event
   *
   * @param {object} data
   */
  onUserLeave = (data) => {
    this.userIds = this.userIds.filter((userId) => userId !== data.userId);
    this.triggerEvent("onUserLeave", data);
  };

  /**
   * On User Is In Waiting Room event
   *
   * @param {object} data
   */
  onUserIsInWaitingRoom = (data) => {
    this.triggerEvent("onUserIsInWaitingRoom", data);
  };

  /**
   * On Meeting Status event
   *
   * @param {object} data
   */
  onMeetingStatus = (data) => {
    this.triggerEvent("onMeetingStatus", data);
  };

  //=====================================================================

  /*******************************
   * Meeting Interaction Methods *
   *******************************/

  /**
   * Set User Data
   *
   * @param {userName, userEmail, userRole}
   */
  setUserData = ({
    userName,
    userEmail = null,
    userRole = ZoomMeetingRole.Attendee,
  }) => {
    this.userName = userName;
    this.userEmail = userEmail;
    this.userRole = userRole;
  };

  /**
   * Join Meeting
   *
   * @param {meetingNumber, passWord, signature, leaveUrl}
   * @param {object} options
   */
  joinMeeting = async (
    { meetingNumber, passWord, signature, leaveUrl },
    options = {}
  ) => {
    try {
      if (!meetingNumber) {
        throw new Error("Meeting Number is required");
      }
      if (!passWord) {
        throw new Error("Password is required");
      }
      if (!this.userName) {
        throw new Error("User name is required");
      }

      await new Promise((resolve, reject) => {
        ZoomMtg.init({
          leaveUrl,
          success: function () {
            resolve();
          },
          error: function (res) {
            reject(res);
          },
        });
      });

      if (options.previewDOM) {
        this.movePreviewContainer(options.previewDOM);
      }

      if (options.joinButtonText) {
        this.domManager.changeJoinMeetingButtonText(options.joinButtonText);
      }

      if (options.title) {
        this.domManager.changeMeetingTitle(options.title);
      }

      if (this.domManager.joinButton) {
        const _this = this;
        _this.domManager.joinButton.addEventListener("click", function () {
          _this.domManager.hidePreviewContainer();
          _this.triggerEvent("joinClicked");
        });
        if (options.autoJoin) {
          setTimeout(() => {
            _this.domManager.joinButton.click();
          }, 500);
        }
      }

      await new Promise((resolve, reject) => {
        ZoomMtg.join({
          apiKey: this.apiKey,
          meetingNumber: meetingNumber,
          passWord: passWord,
          signature: signature,
          userName: this.userName,
          userEmail: this.userEmail || "",
          success: function () {
            resolve();
          },
          error: function (res) {
            reject(res);
          },
        });
      });

      this.meetingNumber = meetingNumber;
      this.passWord = passWord;

      // Hide Join Audio Panel
      ZoomMtg.showJoinAudioFunction({
        show: false,
      });

      // Switch to Gallery View
      this.domManager.switchToGalleryView();

      // Open the chat panel
      this.domManager.openChatPanel();

      // Move chat panel
      if (options.chatDOM) {
        this.moveChatContainer(options.chatDOM);
      }
    } catch (e) {
      console.error(e);
    }
  };

  /**
   * Leave Meeting
   */
  leaveMeeting = () => {
    if (this.meetingNumber) {
      ZoomMtg.leaveMeeting({});

      this.meetingNumber = null;
      this.passWord = null;
    }
  };

  /**
   * Enable Custom Rendering
   */
  enableCustomRendering = () => {
    this.customRenderingEnabled = true;
  };

  /**
   * Disable Custom Rendering
   */
  disableCustomRendering = () => {
    this.customRenderingEnabled = false;
  };

  //=====================================================================

  /********************
   * DOM Manipulation *
   ********************/

  /**
   * Move preview container
   *
   * @param {HTMLElement} parentDOM
   * @param {boolean} append
   */
  movePreviewContainer = (parentDOM, append = true) => {
    this.domManager.movePreviewContainer(parentDOM, append);
  };

  /**
   * Move chat container
   *
   * @param {HTMLElement} parentDOM
   * @param {boolean} append
   */
  moveChatContainer = (parentDOM, append = true) => {
    this.domManager.moveChatContainer(parentDOM, append);
  };

  /**
   * Set style of the preview container
   *
   * @param {object} styles
   */
  setPreviewContainerStyles = (styles) => {
    this.domManager.setPreviewContainerStyles(styles);
  };

  /**
   * Render user video on custom canvas
   *
   * @param {string} userId
   */
  renderUserVideo = () => {
    this.domManager.renderUserVideo();
  };

  /**
   * Returns meeting user name from id
   *
   * @param {string} userId
   * @returns string
   */
  getUserName = (userId) => {
    return this.domManager.getUserName(userId);
  };

  //=====================================================================

  /***************************
   * Custom Event Management *
   ***************************/

  /**
   * Attach custom event handler
   *
   * @param {string} event
   * @param {function} handler
   */
  on = (event, handler) => {
    this.addEventListener(event, (e) => {
      if (handler) {
        handler(e.detail);
      }
    });
  };

  /**
   * Trigger custom event
   *
   * @param {string} name
   * @param {object} payload
   */
  triggerEvent = (name, payload) => {
    this.dispatchEvent(new CustomEvent(name, { detail: payload }));
  };
}

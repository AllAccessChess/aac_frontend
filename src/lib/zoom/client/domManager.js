// AAC Zoom Library - DOM Manager

import { snakeCaseString } from "./helpers";

export default class DOMManager {
  get fps() {
    return 24;
  }

  /**
   * Root Element
   * Zoom SDK Root Element
   */
  get rootElement() {
    return document.getElementById("zmmtg-root");
  }

  /**
   * Media Preview Container
   * This is the parent of av preview container
   */
  get mediaPreviewContainer() {
    return document.querySelector(".media-preview-container");
  }

  /**
   * AV Preview Container
   * This is direct parent of preview video
   */
  get avPreviewContainer() {
    return document.querySelector(".av-preview-container");
  }

  /**
   * Gallery View Menu Item
   */
  get galleryViewMenuItem() {
    return document.querySelector('a[aria-label="Gallery View"]');
  }

  /**
   * Speaker View Menu Item
   */
  get speakerViewMenuItem() {
    return document.querySelector('a[aria-label="Speaker View"]');
  }

  /**
   * Chat Button
   */
  get chatButton() {
    return document.querySelector('button[aria-label="open the chat pane"]');
  }

  /**
   * Join Button
   */
  get joinButton() {
    return document.querySelector(".joinWindowBtn");
  }

  /**
   * Gallery View Canvas
   */
  get galleryCanvas() {
    return document.querySelector(".gallery-video-container__canvas");
  }

  get meetingTitle() {
    return document.querySelector(".meeting-title");
  }

  /**
   * Speaker View Canvas
   */
  get speakerCanvas() {
    return document.querySelector(".speaker-view__canvas");
  }

  /**
   * Suspension View Canvas
   */
  get suspensionCanvas() {
    return document.querySelector(".suspension-video-container__canvas");
  }

  /**
   * Chat Window
   */
  get chatContainer() {
    return document.querySelector(".chat-container");
  }

  /**
   * Find user area DOM
   * @param {string} userId
   */
  findUserAreaDOM = (userId) => {
    /**
     * Look from gallery area
     */
    let userAreaDOM = document.getElementsByClassName(
      `gallery-video-container__video-frame ${userId}`
    );
    if (userAreaDOM && userAreaDOM.length) {
      return { userAreaDOM: userAreaDOM[0], from: "gallery" };
    }

    /**
     * Look from speaker bar area
     */
    userAreaDOM = document.getElementsByClassName(
      `speaker-active-container__video-frame ${userId}`
    );
    if (userAreaDOM && userAreaDOM.length) {
      return { userAreaDOM: userAreaDOM[0], from: "speaker" };
    }

    /**
     * Look from speaker active area
     */
    userAreaDOM = document.getElementsByClassName(
      `speaker-bar-container__video-frame ${userId}`
    );
    if (userAreaDOM && userAreaDOM.length) {
      return { userAreaDOM: userAreaDOM[0], from: "speaker" };
    }

    userAreaDOM = document.getElementsByClassName(
      `suspension-video-container__video-frame ${userId}`
    );
    if (userAreaDOM && userAreaDOM.length) {
      return { userAreaDOM: userAreaDOM[0], from: "suspension" };
    }

    return { userAreaDOM: null, fromGallery: null };
  };

  /**
   * Find Custom User Video Canvas
   *
   * @param {string} userName
   * @returns
   */
  getUserVideoCanvas = (userName) => {
    return document.getElementById(`${snakeCaseString(userName)}-video`);
  };

  /**
   * Move the media preview container to another DOM
   *
   * @param {HTMLElement} parentDOM
   * @param {boolean} append
   */
  movePreviewContainer = (parentDOM, append = true) => {
    if (this.mediaPreviewContainer) {
      if (append) {
        parentDOM.appendChild(this.mediaPreviewContainer);
      } else {
        parentDOM.prependChild(this.mediaPreviewContainer);
      }
    }
  };

  /**
   * Hides the media preview container
   */
  hidePreviewContainer = () => {
    if (this.mediaPreviewContainer) {
      this.mediaPreviewContainer.style.display = "none";
    }
  };

  /**
   * Set the style of the AV preview container
   *
   * @param {object} styles
   */
  setPreviewContainerStyles = (styles) => {
    if (this.avPreviewContainer) {
      for (const style in styles) {
        this.avPreviewContainer.style[style] = styles[style];
      }
    }
  };

  /**
   * Switch to Gallery View
   */
  switchToGalleryView = () => {
    if (this.galleryViewMenuItem) {
      this.galleryViewMenuItem.click();
    }
  };

  /**
   * Switch to Speaker View
   */
  switchToSpeakerView = () => {
    if (this.speakerViewMenuItem) {
      this.speakerViewMenuItem.click();
    }
  };

  /**
   * Open Chat Panel
   */
  openChatPanel = () => {
    if (this.chatButton) {
      this.chatButton.click();
    }
  };

  /**
   * Render user video on canvas
   *
   * @param {string} userId
   */
  renderUserVideo = (userId) => {
    const _this = this;

    const renderFrame = () => {
      const userName = _this.getUserName(userId);
      const userVideoCanvas = _this.getUserVideoCanvas(userName);
      const { userAreaDOM, from } = this.findUserAreaDOM(userId);
      const canvas =
        from === "gallery"
          ? _this.galleryCanvas
          : from === "speaker"
          ? _this.speakerCanvas
          : _this.suspensionCanvas;

      if (userAreaDOM && canvas && userVideoCanvas) {
        const userArea = userAreaDOM.getBoundingClientRect();

        const canvasArea = canvas.getBoundingClientRect();
        const userVideoCanvasContext = userVideoCanvas.getContext("2d");

        userVideoCanvasContext.drawImage(
          canvas,
          Math.max(0, userArea.x - canvasArea.x),
          Math.max(0, userArea.y - canvasArea.y),
          Math.min(canvas.width, userArea.width),
          Math.min(canvas.height, userArea.height),
          0,
          0,
          userVideoCanvas.width,
          userVideoCanvas.height
        );
        requestAnimationFrame(renderFrame);
      } else {
        setTimeout(renderFrame, 1000);
      }
    };

    renderFrame();
  };

  /**
   * Change Meeting Title on Preview
   *
   * @param {string} text
   */
  changeMeetingTitle = (text) => {
    if (this.meetingTitle) {
      this.meetingTitle.innerHTML = text;
    }
  };

  /**
   * Change Join Button Text
   *
   * @param {string} text
   */
  changeJoinMeetingButtonText = (text) => {
    if (this.joinButton) {
      this.joinButton.innerHTML = text;
    }
  };

  /**
   * Returns user name in the zoom meeting
   *
   * @param {string} userId
   * @returns string
   */
  getUserName = (userId) => {
    const { userAreaDOM } = this.findUserAreaDOM(userId);
    if (userAreaDOM) {
      const userTextDOM = userAreaDOM.querySelector("span");
      if (userTextDOM) {
        return userTextDOM.innerHTML;
      }
    }
    return "";
  };

  /**
   * Move the chat container to another DOM
   *
   * @param {HTMLElement} parentDOM
   * @param {boolean} append
   */
  moveChatContainer = (parentDOM, append = true) => {
    if (this.chatContainer) {
      if (append) {
        parentDOM.appendChild(this.chatContainer);
      } else {
        parentDOM.prependChild(this.chatContainer);
      }
    }
  };
}

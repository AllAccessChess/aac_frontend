// AAC Zoom Library - DOM Manager

export default class DOMManager {
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
      return { userAreaDOM: userAreaDOM[0], fromGallery: true };
    }

    /**
     * Look from speaker bar area
     */
    userAreaDOM = document.getElementsByClassName(
      `speaker-active-container__video-frame ${userId}`
    );
    if (userAreaDOM && userAreaDOM.length) {
      return { userAreaDOM: userAreaDOM[0], fromGallery: false };
    }

    /**
     * Look from speaker active area
     */
    userAreaDOM = document.getElementsByClassName(
      `speaker-bar-container__video-frame ${userId}`
    );
    if (userAreaDOM && userAreaDOM.length) {
      return { userAreaDOM: userAreaDOM[0], fromGallery: false };
    }

    return { userAreaDOM: null, fromGallery: false };
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
   * @param {Element} userVideoCanvas
   */
  renderUserVideo = (userId, userVideoCanvas) => {
    const _this = this;

    const renderFrame = () => {
      const galleryCanvas = _this.galleryCanvas;
      const speakerCanvas = _this.speakerCanvas;
      const userVideoCanvasContext = userVideoCanvas.getContext("2d");
      const { userAreaDOM, fromGallery } = this.findUserAreaDOM(userId);

      console.log(
        `## Zoom SDK ## - Rendering ${userId}'s video on ${userVideoCanvas} from ${userAreaDOM} - ${
          fromGallery ? "Gallery" : "Speaker"
        }`
      );

      if (userAreaDOM) {
        const userArea = userAreaDOM.getBoundingClientRect();

        const canvas = fromGallery ? galleryCanvas : speakerCanvas;
        if (canvas) {
          const canvasArea = canvas.getBoundingClientRect();

          userVideoCanvasContext.drawImage(
            canvas,
            userArea.x - canvasArea.x,
            userArea.y - canvasArea.y,
            userArea.width,
            userArea.height,
            0,
            0,
            userVideoCanvas.width,
            userVideoCanvas.height
          );
        }
      }
      window.requestAnimationFrame(renderFrame);
    };

    window.requestAnimationFrame(renderFrame);
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
}

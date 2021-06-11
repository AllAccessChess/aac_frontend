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
      const userVideoCanvasContext = userVideoCanvas.getContext("2d");
      const userAreaDOM = document.getElementsByClassName(
        `gallery-video-container__video-frame ${userId}`
      );

      if (userAreaDOM && userAreaDOM.length && galleryCanvas) {
        const userArea = userAreaDOM[0].getBoundingClientRect();
        const galleryArea = galleryCanvas.getBoundingClientRect();

        userVideoCanvasContext.drawImage(
          galleryCanvas,
          userArea.x - galleryArea.x,
          userArea.y - galleryArea.y,
          userArea.width,
          userArea.height,
          0,
          0,
          userVideoCanvas.width,
          userVideoCanvas.height
        );
      }
      window.requestAnimationFrame(renderFrame);
    };

    window.requestAnimationFrame(renderFrame);
  };
}

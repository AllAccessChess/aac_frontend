// AAC Zoom Library -React Context

import React, { createContext, useContext, useEffect, useState } from "react";

import ZoomClient, { loadStyleSheet } from "../client";

const ZoomContext = createContext(null);

export const ZoomProvider = (props) => {
  const [zoomClient, setZoomClient] = useState(null);

  useEffect(() => {
    // Load Stylesheets
    loadStyleSheet("/zoom.css");

    if (!props.apiKey) {
      console.error("API Key is required for Zoom Provider");
      return;
    }

    // Create a new Zoom Client
    const zoomClient = new ZoomClient(props.apiKey);

    // Check System Requirements
    if (!zoomClient.checkSystemRequirements()) {
      console.error("Zoom SDK is not supported in this browser");
      return;
    }

    // Initialize
    zoomClient.initialize();

    setZoomClient(zoomClient);
  }, [props.apiKey]);

  return (
    <ZoomContext.Provider value={{ zoomClient }}>
      {props.children}
    </ZoomContext.Provider>
  );
};

export const useZoomContext = () => {
  const { zoomClient } = useContext(ZoomContext);

  return {
    zoomClient,
  };
};

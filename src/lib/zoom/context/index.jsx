import React, { createContext, useContext, useEffect, useState } from "react";

import config from "config";
import ZoomClient from "../client";
import "../styles/override.scss";

const ZoomContext = createContext(null);

export const ZoomProvider = (props) => {
  const [zoomClient, setZoomClient] = useState(null);

  useEffect(() => {
    // Create a new Zoom Client
    const zoomClient = new ZoomClient(config.zoom.apiKey);

    // Check System Requirements
    if (!zoomClient.checkSystemRequirements()) {
      console.error("Zoom SDK is not supported in this browser");
      return;
    }

    // Initialize
    zoomClient.initialize();

    setZoomClient(zoomClient);
  }, []);

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

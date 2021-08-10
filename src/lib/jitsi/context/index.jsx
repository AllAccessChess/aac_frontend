// AAC Jitsi Library -React Context

import React, { createContext, useContext, useEffect, useState } from "react";

import JitsiClient from "../client";

const JitsiContext = createContext(null);

export const JitsiProvider = (props) => {
  const [jitsiClient, setJitsiClient] = useState(null);

  useEffect(() => {
    // Initialize
    try {
      // Create a new Jitsi Client
      const client = new JitsiClient("jitsi.allaccesschess.net");

      setJitsiClient(client);
    } catch (err) {}
  }, []);

  return (
    <JitsiContext.Provider value={{ jitsiClient }}>
      {props.children}
    </JitsiContext.Provider>
  );
};

export const useJitsiClient = () => {
  const { jitsiClient } = useContext(JitsiContext);

  return {
    jitsiClient,
  };
};

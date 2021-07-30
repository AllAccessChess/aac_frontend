// AAC StockFish Library - React Context

import React, { createContext, useContext, useEffect, useState } from "react";

import StockFishClient from "../client";

const StockFishContext = createContext(null);

export const StockFishProvider = (props) => {
  const [stockFishClient, setStockFishClient] = useState(null);

  useEffect(() => {
    // Create a new StockFish Client
    const stockFishClient = new StockFishClient();

    // Initialize
    stockFishClient.initialize();
    stockFishClient.initializeTemp();

    setStockFishClient(stockFishClient);
  }, []);

  return (
    <StockFishContext.Provider value={{ stockFishClient }}>
      {props.children}
    </StockFishContext.Provider>
  );
};

export const useStockFishClient = () => {
  const { stockFishClient } = useContext(StockFishContext);

  return {
    stockFishClient,
  };
};

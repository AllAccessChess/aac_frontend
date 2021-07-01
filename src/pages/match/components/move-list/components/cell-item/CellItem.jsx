import React, { useRef, useEffect } from "react";

import { HoveralbleCell } from "./styles";

export const CellItem = ({ cell, active, onClick, ...props }) => {
  const cellRef = useRef(null);

  useEffect(() => {
    if (active) {
      cellRef.current.scrollIntoView(false);
    }
  }, [active]);

  return (
    <HoveralbleCell ref={cellRef} {...props} active={active} onClick={onClick}>
      {cell.action && cell.action === "move" ? cell.content.san : cell}
    </HoveralbleCell>
  );
};

import React from "react";
import Squares from "../blocks/Squares";
const Background = () => {
  return (
    <Squares
      speed={0.2}
      squareSize={55}
      direction="down" // up, down, left, right, diagonal
      borderColor="#185837"
      hoverFillColor="#222"
      className="relative"  
    />
  );
};

export default Background;

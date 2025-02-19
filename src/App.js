import React, { useEffect, useRef, useState } from "react";
import "./style.scss";

const App = () => {
  const canvasRef = useRef(null);
  const [tiles, setTiles] = useState([
    { id: 1, x: 50, y: 50, label: "Rodzic 1", url: "https://onet.pl" },
    { id: 2, x: 200, y: 50, label: "Rodzic 2" },
    { id: 3, x: 125, y: 150, label: "Dziecko" },
    { id: 4, x: 125, y: 250, label: "Dziecko2" }
    
  ]);
  const [draggingTile, setDraggingTile] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    draw(ctx);
  }, [tiles]);

  const draw = (ctx) => {
    ctx.clearRect(0, 0, 1200, 800);
    tiles.forEach(tile => {
      ctx.fillStyle = "lightblue";
      ctx.border = "1px solid";
      ctx.fillRect(tile.x, tile.y, 120  , 60);
      ctx.fillStyle = "red";
      ctx.font = "14px Arial";
      ctx.fillText(tile.label, tile.x+(120/2), tile.y+(60/2));
    });
  };

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const tile = tiles.find(t => offsetX >= t.x && offsetX <= t.x + 80 && offsetY >= t.y && offsetY <= t.y + 40);
    if (tile) {
      setDraggingTile(tile.id);
    }
  };

  const handleMouseMove = (e) => {
    if (draggingTile !== null) {
      const { offsetX, offsetY } = e.nativeEvent;
      setTiles(tiles.map(tile => tile.id === draggingTile ? { ...tile, x: offsetX - 40, y: offsetY - 20 } : tile));
    }
  };

  const handleMouseUp = () => {
    setDraggingTile(null);
  };

  return (
    <div className="tree-container">
      <canvas 
        ref={canvasRef} 
        width={1200} 
        height={600} 
        style={{ border: "3px solid black" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default App;

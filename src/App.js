import React, { useEffect, useRef, useState } from "react";
import "./style.scss";

const App = () => {
  const canvasRef = useRef(null);
  const [tiles, setTiles] = useState([
    { id: 1, x: 50, y: 50, label: "Ojciec",name:"Adam Nowak", url: "https://onet.pl" },
    { id: 2, x: 200, y: 50, label: "Matka",name:"Joanna Nowak", url: "https://wnet.pl"  },
    { id: 3, x: 50, y: 300, label: "Syn",name:"Olo Nowak", url: "https://bbc.com"  },
    { id: 4, x: 200, y: 300, label: "Córka",name:"Kata Nowak", url: "https://wp.pl"  }
  ]);
  const [draggingTile, setDraggingTile] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    draw(ctx);
  }, [tiles]);

  const drawRoundedRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  };

  const draw = (ctx) => {
    ctx.clearRect(0, 0, 1200, 800);
    tiles.forEach(tile => {
      ctx.fillStyle = "lightgreen"; // Zmiana koloru kafelków
      ctx.strokeStyle = "black"; // Kolor obramowania
      ctx.lineWidth = 2; // Grubość obramowania
      drawRoundedRect(ctx, tile.x, tile.y, 120, 180, 10); // Zaokrąglone kafelki
      ctx.fillStyle = "red";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(tile.label, tile.x + 60, tile.y + 30);
      ctx.fillText(tile.name, tile.x + 60, tile.y + 40);
    });
  };

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const tile = tiles.find(t => offsetX >= t.x && offsetX <= t.x + 120 && offsetY >= t.y && offsetY <= t.y + 60);
    if (tile) {
      setDraggingTile(tile.id);
    }
  };

  const handleMouseMove = (e) => {
    if (draggingTile !== null) {
      const { offsetX, offsetY } = e.nativeEvent;
      setTiles(tiles.map(tile => tile.id === draggingTile ? { ...tile, x: offsetX - 60, y: offsetY - 30 } : tile));
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

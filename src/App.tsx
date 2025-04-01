import React, { useEffect, useRef, useState } from "react";
import './style.scss'; // Import stylów
//import manImage from './assets/image/man.jpg';
import ImageWoman from './assets/image/40Kobieta.jpeg';
import ImageMan from './assets/image/40FacetRobo.jpeg';

interface Tile {
  id: number;
  x: number;
  y: number;
  label: string;
  name: string;
  born: string;
  death: string;
  url: string;
}

interface Images {
  [key: number]: HTMLImageElement;
}

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tiles, setTiles] = useState<Tile[]>([
    { id: 1, x: 50, y: 50, label: "", name: "Adam Nowak", born: "* 12.01.1958", death: "+ 12.03.2025", url: ImageMan },
    { id: 2, x: 200, y: 50, label: "", name: "Joanna Nowak", born: "* 12.01.1958", death: "+ 12.03.2025", url: ImageWoman },
 
  ]);
  const [draggingTile, setDraggingTile] = useState<number | null>(null);
  const [images, setImages] = useState<Images>({});

  useEffect(() => {
    tiles.forEach(tile => {
      const img = new Image();
      img.src = tile.url;
      img.onload = () => {
        setImages(prev => ({ ...prev, [tile.id]: img }));
      };
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      draw(ctx);
    }
  }, [tiles, images]);

  const addTile = () => {
    const newTile: Tile = {
      id: tiles.length + 1,
      x: Math.random() * 800, // Losowa pozycja X
      y: Math.random() * 400, // Losowa pozycja Y
      label: "",
      name: "Nowy Tile",
      born: "* 01.01.2000",
      death: "+ 01.01.2070",
      url: ImageMan, // Użyj domyślnego obrazu
    };
    setTiles([...tiles, newTile]);
  };

  const drawCircularImage = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, radius: number) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    
    ctx.drawImage(img, x, y, radius * 2, radius * 2);
    
    ctx.beginPath();
    ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, true);
    ctx.clip();
    ctx.closePath();
    ctx.restore();

    ctx.beginPath();
    ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, true);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
  };

  const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
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

  const draw = (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
  
    // Ustawienie koloru tła canvas
    ctx.fillStyle = "#5b8e7d"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    tiles.forEach(tile => {
      ctx.fillStyle = "#b5e48c";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      drawRoundedRect(ctx, tile.x, tile.y + 60, 120, 120, 10);
  
      if (images[tile.id]) {
        drawCircularImage(ctx, images[tile.id], tile.x + 30, tile.y + 30, 30);
      }
  
      ctx.fillStyle = "black";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(tile.label, tile.x + 60, tile.y);
      ctx.fillText(tile.name, tile.x + 60, tile.y + 100);
      ctx.fillText(tile.born, tile.x + 60, tile.y + 120);
      ctx.fillText(tile.death, tile.x + 60, tile.y + 140);
    });
  };
  

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { offsetX, offsetY } = e.nativeEvent;
    const tile = tiles.find(t => 
      offsetX >= t.x && 
      offsetX <= t.x + 120 && 
      offsetY >= t.y && 
      offsetY <= t.y + 180
    );
    if (tile) {
      setDraggingTile(tile.id);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggingTile !== null) {
      const { offsetX, offsetY } = e.nativeEvent;
      setTiles(tiles.map(tile => 
        tile.id === draggingTile 
          ? { ...tile, x: offsetX - 60, y: offsetY - 90 } 
          : tile
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggingTile(null);
  };

  return (
    <div>
      <nav className="navbar">
        <button onClick={addTile}>Dodaj Tile</button>
      </nav>
      <div className="tree-container">
        <canvas 
          ref={canvasRef} 
          width={1600} 
          height={800} 
          style={{ border: "3px dotted gray" }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>
    </div>
  );
};

export default App;
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
      if (!images[tile.id]) {
        const img = new Image();
        img.src = tile.url;
        img.onload = () => {
          setImages(prev => ({ ...prev, [tile.id]: img }));
        };
        img.onerror = () => {
          console.error(`Failed to load image for tile ID: ${tile.id}`);
        };
      }
    });
  }, [tiles, images]);

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
      name: "imię i nazwisko",
      born: "* data urodzenia",
      death: "+ data śmierci",
      url: ImageMan, // Użyj domyślnego obrazu
    };
    setTiles([...tiles, newTile]);
  };

  const modifyTile = () => {
    const tileId = parseInt(prompt("Podaj ID kafelka do modyfikacji:") || "", 10);
    const tileToModify = tiles.find(tile => tile.id === tileId);

    if (!tileToModify) {
      alert("Nie znaleziono kafelka o podanym ID.");
      return;
    }

    const newName = prompt("Podaj nową nazwę:", tileToModify.name) || tileToModify.name;
    const newBorn = prompt("Podaj nową datę urodzenia:", tileToModify.born) || tileToModify.born;
    const newDeath = prompt("Podaj nową datę śmierci:", tileToModify.death) || tileToModify.death;
    const newImageUrl = prompt("Podaj URL nowego obrazu:", tileToModify.url) || tileToModify.url;

    const updatedTile = { ...tileToModify, name: newName, born: newBorn, death: newDeath, url: newImageUrl };

    setTiles(tiles.map(tile => (tile.id === tileId ? updatedTile : tile)));

    // Aktualizacja obrazu w stanie `images`
    const img = new Image();
    img.src = newImageUrl;
    img.onload = () => {
      setImages(prev => ({ ...prev, [tileId]: img }));
    };
    img.onerror = () => {
      console.error(`Failed to load new image for tile ID: ${tileId}`);
    };
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
      // Rysowanie kafelka
      ctx.fillStyle = "#b5e48c";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 2;
      drawRoundedRect(ctx, tile.x, tile.y + 60, 120, 120, 10);
  
      // Rysowanie obrazu na kafelku
      if (images[tile.id]) {
        drawCircularImage(ctx, images[tile.id], tile.x + 30, tile.y + 30, 30);
      }
  
      // Rysowanie tekstu na kafelku
      ctx.fillStyle = "black";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(tile.label, tile.x + 60, tile.y);
      ctx.fillText(tile.name, tile.x + 60, tile.y + 100);
      ctx.fillText(tile.born, tile.x + 60, tile.y + 120);
      ctx.fillText(tile.death, tile.x + 60, tile.y + 140);
  
      // Rysowanie numeru kafelka trochę z prawej strony
      ctx.fillStyle = "black"; // Kolor numeru kafelka
      ctx.font = "bold 16px Arial"; // Styl czcionki
      ctx.textAlign = "left"; // Wyrównanie tekstu do lewej
      ctx.fillText(`${tile.id}`, tile.x + 100, tile.y + 80); // Pozycja numeru kafelka
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
        <button onClick={addTile}>Dodaj Osobę</button>
        <button onClick={modifyTile}>Modyfikuj Osobę</button>
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
import { useState, useEffect } from "preact/hooks";
import { shapes, selectedShapes, addShape, deleteShape } from "./state";
import "./leftView.css";

function Toolbar() {
  const [shapeType, setShapeType] = useState<
    "Square" | "Star" | "Bullseye" | "Cat"
  >("Square"); // Default shape type
  const isAddDisabled = shapes.value.length >= 25; // step 24, step 27
  const isDeleteDisabled = selectedShapes.value.length === 0; // step 27
  const isClearDisabled = shapes.value.length === 0; // step 27

  const handleAddShape = () => {
    // step 9
    const newShape = {
      id: Date.now(),
      type: shapeType,
      hue: randomInt(0, 360),
      location: 1,
      radius: shapeType === "Star" ? randomInt(20, 45) : undefined,
      spikes: shapeType === "Star" ? randomInt(3, 10) : undefined,
      hue2: shapeType === "Bullseye" ? randomInt(0, 360) : undefined,
      rings: shapeType === "Bullseye" ? randomInt(2, 5) : undefined,
      look: shapeType === "Cat" ? randomLook() : undefined,
    };

    addShape(newShape);
  };

  // step 5
  useEffect(() => {
    if (shapes.value.length === 0) {
      for (let i = 0; i < 8; i++) {
        addShape({
          id: Date.now() + i,
          type: "Square",
          hue: randomInt(0, 360),
          location: 1,
        });
      }
    }
  }, []);

  // step 19
  const handleDeleteSelectedShapes = () => {
    deleteShape();
  };

  // step 20
  const handleClearShapes = () => {
    shapes.value = []; // clear all shapes
    selectedShapes.value = []; // clear all selections
  };

  return (
    <div class="toolbar">
      <button
        class={isAddDisabled ? "button-disabled" : ""}
        disabled={isAddDisabled}
        onClick={handleAddShape}
      >
        Add
      </button>
      <select
        value={shapeType}
        onChange={(e) =>
          setShapeType(
            (e.target as HTMLSelectElement).value as
              | "Square"
              | "Star"
              | "Bullseye"
              | "Cat"
          )
        }
      >
        <option value="Square">Square</option>
        <option value="Star">Star</option>
        <option value="Bullseye">Bullseye</option>
        <option value="Cat">Cat</option>
      </select>
      <button
        class={isDeleteDisabled ? "button-disabled" : ""}
        disabled={isDeleteDisabled}
        onClick={handleDeleteSelectedShapes}
      >
        Delete
      </button>
      <button
        class={isClearDisabled ? "button-disabled" : ""}
        disabled={isClearDisabled}
        onClick={handleClearShapes}
      >
        Clear
      </button>
    </div>
  );
}

export default Toolbar;

function randomInt(n1: number, n2: number) {
  // n1 <= n2
  return Math.floor(Math.random() * (Math.abs(n2 - n1) + 1)) + n1;
}

function randomLook() {
  // n1 <= n2
  const randNum = Math.floor(Math.random() * 3);
  let look;
  if (randNum === 0) {
    look = "left";
  } else if (randNum === 1) {
    look = "center";
  } else {
    look = "right";
  }
  return look;
}

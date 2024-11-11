import { shapes, selectedShapes, saveState } from "./state";
import Canvas from "./canvas";

function ShapeList() {
  const shapetypeToNumber = (shapeType: string) => {
    switch (shapeType) {
      case "Square":
        return 1;
      case "Star":
        return 2;
      case "Bullseye":
        return 3;
      case "Cat":
        return 4;
      default:
        return 1;
    }
  };

  // step 26
  // fot clicking the whitespace in shapeList
  const handleContainerClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) {
      selectedShapes.value = [];
    }
  };

  // step 10, step 18, step 21, step 22
  function toggleShapeSelection(id: number, event: MouseEvent) {
    const isAlreadySelected = selectedShapes.value.includes(id);
    const isShiftKeyDown = event.shiftKey;

    if (isShiftKeyDown) {
      if (isAlreadySelected) {
        selectedShapes.value = selectedShapes.value.filter(
          (selectedId) => selectedId !== id
        );
      } else {
        selectedShapes.value = [...selectedShapes.value, id];
      }
    } else {
      if (isAlreadySelected && selectedShapes.value.length === 1) {
        selectedShapes.value = selectedShapes.value.filter(
          (selectedId) => selectedId !== id
        );
      } else {
        selectedShapes.value = [id];
      }
    }
    saveState();
  }

  return (
    <div className="shapeList" onClick={handleContainerClick}>
      {shapes.value.map((shape) => (
        <div key={shape.id} onClick={(e) => toggleShapeSelection(shape.id, e)}>
          <Canvas
            width={50}
            height={50}
            shape={shapetypeToNumber(shape.type)}
            location={shape.location}
            hue={shape.hue}
            hue2={shape.hue2}
            spikes={shape.spikes}
            radius={shape.radius}
            look={shape.look}
            rings={shape.rings}
            selected={selectedShapes.value.includes(shape.id)}
          />
        </div>
      ))}
    </div>
  );
}

export default ShapeList;

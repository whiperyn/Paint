import { Fragment } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import {
  selectedShapes,
  shapes,
  updateShapeProperty,
  pushState,
} from "./state";
import Canvas from "./canvas";
import "./rightView.css";

function RightView() {
  const displayRef = useRef<HTMLDivElement>(null);
  const selectedCount = selectedShapes.value.length;
  const selectedShape = shapes.value.find((shape) =>
    selectedShapes.value.includes(shape.id)
  );

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
  const [isHueValid, setIsHueValid] = useState(true);
  const [isHue2Valid, setIsHue2Valid] = useState(true);
  const [isRadiusValid, setIsRadiusValid] = useState(true);
  const [isRingsValid, setIsRingsValid] = useState(true);
  const [isSpikesValid, setIsSpikesValid] = useState(true);

  const [hueInput, setHueInput] = useState(selectedShape?.hue);
  const [hue2Input, setHue2Input] = useState(selectedShape?.hue2);
  const [radiusInput, setRadiusInput] = useState(selectedShape?.radius);
  const [ringsInput, setRingsInput] = useState(selectedShape?.rings);
  const [spikesInput, setSpikesInput] = useState(selectedShape?.spikes);

  useEffect(() => {
    // when the selected shape changes, update
    if (selectedShape && selectedShape.hue) {
      setHueInput(selectedShape.hue);
      setIsHueValid(true);
    }

    if (selectedShape && selectedShape.hue2) {
      setHue2Input(selectedShape.hue2);
      setIsHue2Valid(true);
    }

    if (selectedShape && selectedShape.radius) {
      setRadiusInput(selectedShape.radius);
      setIsRadiusValid(true);
    }

    if (selectedShape && selectedShape.rings) {
      setRingsInput(selectedShape.rings);
      setIsRingsValid(true);
    }

    if (selectedShape && selectedShape.spikes) {
      setSpikesInput(selectedShape.spikes);
      setIsSpikesValid(true);
    }
  }, [selectedShape]);

  const savingState = (isValid: boolean) => {
    if (isValid) {
      pushState();
    }

    console.log("received focus");
  };

  // step 15
  const handleHueChange = (event: Event) => {
    const newProp = (event.target as HTMLInputElement).value;
    setHueInput(parseInt(newProp, 10));
    const t = parseInt(newProp, 10);
    const valid = !isNaN(t) && t >= 0 && t <= 360;
    setIsHueValid(valid);
    if (valid && selectedShape) {
      updateShapeProperty(selectedShape.id, "hue", parseInt(newProp, 10));
    }
  };
  const handleHue2Change = (event: Event) => {
    const newProp = (event.target as HTMLInputElement).value;
    setHue2Input(parseInt(newProp, 10));
    const t = parseInt(newProp, 10);
    const valid = !isNaN(t) && t >= 0 && t <= 360; // step 16
    setIsHue2Valid(valid);
    if (valid && selectedShape) {
      updateShapeProperty(selectedShape.id, "hue2", parseInt(newProp, 10));
    }
  };
  const handleRadiusChange = (event: Event) => {
    const newProp = (event.target as HTMLInputElement).value;
    setRadiusInput(parseInt(newProp, 10));
    const t = parseInt(newProp, 10);
    const valid = !isNaN(t) && t >= 20 && t <= 45;
    setIsRadiusValid(valid);
    if (valid && selectedShape) {
      updateShapeProperty(selectedShape.id, "radius", parseInt(newProp, 10));
    }
  };
  const handleSpikesChange = (event: Event) => {
    const newProp = (event.target as HTMLInputElement).value;
    setSpikesInput(parseInt(newProp, 10));
    const t = parseInt(newProp, 10);
    const valid = !isNaN(t) && t >= 3 && t <= 10;
    setIsSpikesValid(valid);
    if (valid && selectedShape) {
      updateShapeProperty(selectedShape.id, "spikes", parseInt(newProp, 10));
    }
  };
  const handleRingsChange = (event: Event) => {
    const newProp = (event.target as HTMLInputElement).value;
    setRingsInput(parseInt(newProp, 10));
    const t = parseInt(newProp, 10);
    const valid = !isNaN(t) && t >= 2 && t <= 5;
    setIsRingsValid(valid);
    if (valid && selectedShape) {
      updateShapeProperty(selectedShape.id, "rings", parseInt(newProp, 10));
    }
  };
  const handleLookChange = (event: Event) => {
    const newProp = (event.target as HTMLInputElement).value;
    if (selectedShape) {
      savingState(true);
      updateShapeProperty(selectedShape.id, "look", newProp);
    }
  };

  // step 11
  // number of selected shape
  if (selectedCount === 0) {
    return <div class="rightView">Select One</div>; // step 17
  }

  if (selectedCount > 1) {
    return <div class="rightView">Too Many Selected</div>; // step 25
  }

  if (!selectedShape) {
    return null; // just in case, shouldn't happen
  }

  // step 14
  if (selectedShape.type === "Square") {
    return (
      <div class="rightView">
        {selectedShape && (
          <Fragment>
            <div class="shapedisplay" ref={displayRef}>
              <Canvas
                width={200}
                height={200}
                shape={shapetypeToNumber(selectedShape.type)}
                location={2}
                hue={selectedShape.hue}
                hue2={selectedShape.hue2}
                spikes={selectedShape.spikes}
                radius={selectedShape.radius}
                look={selectedShape.look}
                rings={selectedShape.rings}
              />
            </div>
            <div class="shapeEdit">
              <label class="edit-row">
                Hue:
                <input
                  type="number"
                  value={hueInput}
                  onChange={() => savingState(isHueValid)}
                  onInput={handleHueChange}
                  style={{ outline: isHueValid ? "none" : "2px solid red" }}
                />
              </label>
            </div>
          </Fragment>
        )}
      </div>
    );
  } else if (selectedShape.type === "Star") {
    return (
      <div class="rightView">
        {selectedShape && (
          <Fragment>
            <div class="shapedisplay" ref={displayRef}>
              <Canvas
                width={200}
                height={200}
                shape={shapetypeToNumber(selectedShape.type)}
                location={2}
                hue={selectedShape.hue}
                hue2={selectedShape.hue2}
                spikes={selectedShape.spikes}
                radius={selectedShape.radius}
                look={selectedShape.look}
                rings={selectedShape.rings}
              />
            </div>
            <div class="shapeEdit">
              <label class="edit-row">
                Hue:
                <input
                  type="number"
                  value={hueInput}
                  onChange={() => savingState(isHueValid)}
                  onInput={handleHueChange}
                  style={{ outline: isHueValid ? "none" : "2px solid red" }}
                />
              </label>
              <label class="edit-row">
                Points:
                <input
                  type="number"
                  value={spikesInput}
                  onChange={() => savingState(isSpikesValid)}
                  onInput={handleSpikesChange}
                  style={{ outline: isSpikesValid ? "none" : "2px solid red" }}
                />
              </label>
              <label class="edit-row">
                Radius:
                <input
                  type="number"
                  value={radiusInput}
                  onChange={() => savingState(isRadiusValid)}
                  onInput={handleRadiusChange}
                  style={{ outline: isRadiusValid ? "none" : "2px solid red" }}
                />
              </label>
            </div>
          </Fragment>
        )}
      </div>
    );
  } else if (selectedShape.type === "Bullseye") {
    return (
      <div class="rightView">
        {selectedShape && (
          <Fragment>
            <div class="shapedisplay" ref={displayRef}>
              <Canvas
                width={200}
                height={200}
                shape={shapetypeToNumber(selectedShape.type)}
                location={2}
                hue={selectedShape.hue}
                hue2={selectedShape.hue2}
                spikes={selectedShape.spikes}
                radius={selectedShape.radius}
                look={selectedShape.look}
                rings={selectedShape.rings}
              />
            </div>
            <div class="shapeEdit">
              <label class="edit-row">
                Hue 1:
                <input
                  type="number"
                  value={hueInput}
                  onChange={() => savingState(isHueValid)}
                  onInput={handleHueChange}
                  style={{ outline: isHueValid ? "none" : "2px solid red" }}
                />
              </label>
              <label class="edit-row">
                Hue 2:
                <input
                  type="number"
                  value={hue2Input}
                  onChange={() => savingState(isHue2Valid)}
                  onInput={handleHue2Change}
                  style={{ outline: isHue2Valid ? "none" : "2px solid red" }}
                />
              </label>
              <label class="edit-row">
                Rings:
                <input
                  type="number"
                  value={ringsInput}
                  onChange={() => savingState(isRingsValid)}
                  onInput={handleRingsChange}
                  style={{ outline: isRingsValid ? "none" : "2px solid red" }}
                />
              </label>
            </div>
          </Fragment>
        )}
      </div>
    );
  } else {
    // Cat
    return (
      <div class="rightView">
        {selectedShape && (
          <Fragment>
            <div class="shapedisplay" ref={displayRef}>
              <Canvas
                width={200}
                height={200}
                shape={shapetypeToNumber(selectedShape.type)}
                location={2}
                hue={selectedShape.hue}
                hue2={selectedShape.hue2}
                spikes={selectedShape.spikes}
                radius={selectedShape.radius}
                look={selectedShape.look}
              />
            </div>
            <div class="shapeEdit">
              <label class="edit-row">
                Hue:
                <input
                  type="number"
                  value={hueInput}
                  onChange={() => savingState(isHueValid)}
                  onInput={handleHueChange}
                  style={{ outline: isHueValid ? "none" : "2px solid red" }}
                />
              </label>
              <div class="edit-row">
                <label>Look: </label>
                <select value={selectedShape.look} onChange={handleLookChange}>
                  <option value="center">Center</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}

export default RightView;

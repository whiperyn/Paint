import { shapes, selectedShapes, undo, redo, history } from "./state";
import "./leftView.css";
import { useEffect } from "preact/hooks";

function StatusBar() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "z") {
        undo();
      } else if (e.ctrlKey && e.shiftKey && e.key === "Z") {
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  const isUndoDisabled = history.value.past.length === 0;
  const isRedoDisabled = history.value.future.length === 0;
  // step 7, step 23
  if (selectedShapes.value.length > 0) {
    return (
      <div class="bottombar">
        <div class="statusbar1">{shapes.value.length} shapes </div>
        <div class="buttons">
          <button
            onClick={undo}
            class={isUndoDisabled ? "button-disabled" : ""}
            disabled={isUndoDisabled}
          >
            Undo
          </button>
          <button
            onClick={redo}
            class={isRedoDisabled ? "button-disabled" : ""}
            disabled={isRedoDisabled}
          >
            Redo
          </button>
        </div>
        <div class="statusbar2">
          {shapes.value.length >= 25 ? "Full" : ""}{" "}
          {selectedShapes.value.length} Selected
        </div>
      </div>
    );
  }
  return (
    <div class="bottombar">
      <div class="statusbar1">{shapes.value.length} Shapes </div>
      <div class="buttons">
        <button
          onClick={undo}
          class={isUndoDisabled ? "button-disabled" : ""}
          disabled={isUndoDisabled}
        >
          Undo
        </button>
        <button
          onClick={redo}
          class={isRedoDisabled ? "button-disabled" : ""}
          disabled={isRedoDisabled}
        >
          Redo
        </button>
      </div>

      <div class="statusbar2">{shapes.value.length >= 25 ? "Full" : ""}</div>
    </div>
  );
}

export default StatusBar;

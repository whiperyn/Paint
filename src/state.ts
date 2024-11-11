import { signal, batch } from "@preact/signals";

export const selectedShapes = signal<number[]>([]);

export interface Shape {
  id: number;
  type: "Square" | "Star" | "Bullseye" | "Cat";
  hue: number;
  location: number;
  radius?: number;
  spikes?: number;
  hue2?: number;
  rings?: number;
  look?: string;
}

export const shapes = signal<Shape[]>([]);

export const updateShapeProperty = (
  id: number,
  property: keyof Shape,
  value: any
) => {
  const index = shapes.value.findIndex((shape) => shape.id === id);
  if (index !== -1) {
    const shape = shapes.value[index];
    shapes.value = [
      ...shapes.value.slice(0, index),
      { ...shape, [property]: value },
      ...shapes.value.slice(index + 1),
    ];
  }
};

export const shapesHistory = signal<Shape[][]>([[]]); //history, for undo/redo
export const currentIndex = signal(0);

// track both shapes in shapeList and selectedshapes
export interface HistoryState {
  shapes: Shape[];
  selectedShapes: number[];
}

export const history = signal<{
  past: HistoryState[];
  future: HistoryState[];
  present: HistoryState;
}>({
  past: [],
  future: [],
  present: { shapes: shapes.value, selectedShapes: selectedShapes.value },
});

export function addShape(newShape: Shape) {
  // step 9
  batch(() => {
    const currentState = {
      shapes: [...shapes.value], // copy of current shapes
      selectedShapes: [...selectedShapes.value], // copy of current selected shapes
    };
    history.value.past.push(history.value.present);
    history.value.present = currentState;
    history.value.future = [];

    // add new shape
    shapes.value = [...shapes.value, newShape];

    history.value.present = {
      shapes: [...shapes.value],
      selectedShapes: [...selectedShapes.value],
    };
  });
}

export function deleteShape() {
  batch(() => {
    // save the current state before deleting
    const currentState = {
      shapes: [...shapes.value],
      selectedShapes: [...selectedShapes.value],
    };
    history.value.past.push(history.value.present);
    history.value.present = currentState;
    history.value.future = [];

    shapes.value = shapes.value.filter(
      (shape) => !selectedShapes.value.includes(shape.id)
    );

    selectedShapes.value = [];

    history.value.present = {
      shapes: [...shapes.value],
      selectedShapes: [...selectedShapes.value],
    };
  });
}

export function saveState() {
  const currentState = {
    shapes: [...shapes.value],
    selectedShapes: [...selectedShapes.value],
  };

  batch(() => {
    history.value.past.push(history.value.present);
    history.value.present = currentState;
    history.value.future = [];
  });
}
export function pushState() {
  const currentState = {
    shapes: [...shapes.value],
    selectedShapes: [...selectedShapes.value],
  };

  batch(() => {
    const savingState = {
      shapes: history.value.present.shapes,
      selectedShapes: [...selectedShapes.value],
    };
    history.value.past.push(savingState);
    history.value.present = currentState;
    history.value.future = [];
  });
}

// Undo
export function undo() {
  if (history.value.past.length > 0) {
    const prevState = history.value.past.pop();
    if (prevState) {
      batch(() => {
        history.value.future.push(history.value.present);
        history.value.present = prevState;

        shapes.value = prevState.shapes;
        selectedShapes.value = prevState.selectedShapes;
      });
    }
  }
  console.log(selectedShapes.value);
}

// Redo
export function redo() {
  if (history.value.future.length > 0) {
    const nextState = history.value.future.pop();
    if (nextState) {
      batch(() => {
        history.value.past.push(history.value.present);
        history.value.present = nextState;

        shapes.value = nextState.shapes;
        selectedShapes.value = nextState.selectedShapes;
      });
    }
  }
}

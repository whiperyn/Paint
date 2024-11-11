import { useRef, useEffect, useLayoutEffect, useState } from "preact/hooks";
import "./leftView.css";

// location == 1 when in leftView; 2 when in right
type CanvasProps = {
  width?: number;
  height?: number;
  shape: number;
  location?: number;
  hue: number;
  hue2?: number;
  spikes?: number;
  radius?: number;
  look?: string;
  rings?: number;
  selected?: boolean;
};

function Canvas({
  width = 256,
  height = 256,
  shape,
  location = 1,
  hue,
  hue2,
  spikes,
  radius,
  look,
  rings,
  selected = false,
}: CanvasProps) {
  const shapeName = (() => {
    switch (shape) {
      case 1:
        return "square";
      case 2:
        return "star";
      case 3:
        return "bullseye";
      default:
        return "cat";
    }
  })();

  // Construct the className based on shape and location
  const className = (() => {
    if (location === 2) {
      return "editform";
    } else {
      if (selected) {
        return `shape ${shapeName} selected`;
      } else {
        return `shape ${shapeName}`;
      }
    }
  })();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 256, height: 256 });
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        setDimensions({
          width: canvasRef.current.parentElement.offsetWidth,
          height: canvasRef.current.parentElement.offsetHeight,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // drawing
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    // step 6
    let effectiveWidth = location === 1 ? 50 : width;
    let effectiveHeight = location === 1 ? 50 : height;
    if (
      !canvas ||
      !canvas.parentElement ||
      !canvas.parentElement.parentElement
    ) {
      return;
    }
    if (location === 2) {
      const parentWidth = canvas.parentElement.parentElement.offsetWidth;
      const parentHeight = canvas.parentElement.parentElement.offsetHeight;

      let size = Math.min(parentWidth, parentHeight);
      canvas.parentElement.style.width = `${size}px`;
      canvas.parentElement.style.height = `${size}px`;
      canvas.width = size;
      canvas.height = size;

      effectiveWidth = size;
      effectiveHeight = size;
    }

    if (ctx && canvas) {
      if (shape === 1) {
        // square
        Squaredraw(ctx, effectiveWidth, effectiveHeight, hue);
      } else if (shape === 2) {
        // star
        if (radius && spikes) {
          Stardraw(ctx, effectiveWidth, effectiveHeight, hue, spikes, radius);
        }
      } else if (shape === 3) {
        // bulleye
        if (hue2 && rings) {
          Bullseyedraw(
            ctx,
            effectiveWidth,
            effectiveHeight,
            hue,
            hue2,
            rings,
            location
          );
        }
      } else {
        // cat
        if (look) {
          Catdraw(ctx, effectiveWidth, effectiveHeight, hue, look, location);
        }
      }
    }
  }, [
    dimensions,
    width,
    height,
    shape,
    location,
    hue,
    hue2,
    spikes,
    radius,
    look,
    rings,
    selected,
  ]);

  function Squaredraw(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    hue: number
  ) {
    ctx.clearRect(0, 0, width, height);
    let size = Math.min(width, height);
    ctx.beginPath();
    ctx.rect(0, 0, size, size);
    const color = `hsl(${hue}, 100%, 50%)`;
    ctx.fillStyle = color;
    ctx.fill();
    if (location === 2) {
      ctx.lineWidth = 4;
    }
    ctx.stroke();
  }

  function Stardraw(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    hue: number,
    spikes: number,
    radius: number
  ) {
    if (!ctx) return;
    let innerRadius = 15;
    if (location === 2) {
      innerRadius = (15 / 50) * (width / 2);
      radius = (radius / 100) * width;
    } else {
      radius = (radius / 100) * 50;
      innerRadius = (innerRadius / 100) * 50;
    }
    const color = `hsl(${hue}, 100%, 50%)`;
    ctx.clearRect(0, 0, width, height);
    let rot = (Math.PI / 2) * 3;
    let x = width / 2;
    let y = height / 2;
    let step = Math.PI / spikes;

    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(x, y - radius);
    for (let i = 0; i < spikes; i++) {
      x = width / 2 + Math.cos(rot) * radius;
      y = height / 2 + Math.sin(rot) * radius;
      ctx.lineTo(x, y);
      rot += step;

      x = width / 2 + Math.cos(rot) * innerRadius;
      y = height / 2 + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(width / 2, height / 2 - radius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.stroke();
  }

  function Bullseyedraw(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    hue: number,
    hue2: number,
    rings: number,
    location: number
  ) {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    let maxRadius = width / 2;
    if (location === 2) {
      maxRadius = Math.min(width, height) / 2;
      maxRadius -= 2; // to account for stroke
    } else {
      maxRadius -= 5; // to ensure maxRadius is 45 since in shapeList (location = 1) width = 100, so the math will make sure it's 45
    }
    ctx.strokeStyle = "black";

    for (let i = 0; i <= rings; i++) {
      ctx.beginPath();
      ctx.arc(
        width / 2,
        height / 2,
        (maxRadius * (rings - i)) / rings,
        0,
        2 * Math.PI,
        false
      );
      ctx.fillStyle = `hsl(${i % 2 === 0 ? hue : hue2}, 100%, 50%)`;
      ctx.fill();
      ctx.closePath();
      ctx.stroke();
    }
  }
  function Catdraw(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    hue: number,
    look: string,
    location: number
  ) {
    const centerX = width / 2;
    const centerY = height / 2;
    ctx.clearRect(0, 0, width, height);
    ctx.translate(centerX, centerY);
    const scale = location === 1 ? 0.4 : (0.5 / 50) * Math.min(width, height);
    ctx.scale(scale, scale);

    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;

    /// head white outline
    ctx.beginPath();
    ctx.arc(0, 0, 40, 0, 2 * Math.PI);
    ctx.stroke();

    // ears
    ctx.beginPath();
    // left
    ctx.moveTo(-40, -48);
    ctx.lineTo(-8, -36);
    ctx.lineTo(-35, -14);
    ctx.closePath();
    // right
    ctx.moveTo(40, -48);
    ctx.lineTo(8, -36);
    ctx.lineTo(35, -14);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    // head
    ctx.beginPath();
    ctx.arc(0, 0, 40, 0, 2 * Math.PI);
    ctx.fill();

    // whites of eyes
    ctx.strokeStyle = "black";
    ctx.fillStyle = "white";
    ctx.lineWidth = 1;
    ctx.beginPath();
    // left
    ctx.ellipse(-16, -9, 8, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // right
    ctx.beginPath();
    ctx.ellipse(16, -9, 8, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // eyeballs
    ctx.fillStyle = "black";

    // left
    if (look === "left") {
      ctx.beginPath();
      ctx.arc(-20, -9, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (look === "right") {
      ctx.beginPath();
      ctx.arc(-12, -9, 5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(-16, -9, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    // right
    ctx.beginPath();
    if (look === "left") {
      ctx.beginPath();
      ctx.arc(12, -9, 5, 0, Math.PI * 2);
      ctx.fill();
    } else if (look === "right") {
      ctx.beginPath();
      ctx.arc(20, -9, 5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(16, -9, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  return (
    <div
      className={className}
      onMouseDown={(e) => {
        const target = e.currentTarget as HTMLElement;
        target.classList.add("thick-outline");
      }}
      onMouseUp={(e) => {
        const target = e.currentTarget as HTMLElement;
        target.classList.remove("thick-outline");
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget as HTMLElement;
        target.classList.remove("thick-outline");
      }}
    >
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
}

export default Canvas;

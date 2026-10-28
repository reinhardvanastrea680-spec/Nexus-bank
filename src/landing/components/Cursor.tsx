import { useEffect, useRef, useState } from "react";

type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
};

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const particleIdCounter = useRef(0);

  const mousePosition = useRef({ x: 0, y: 0 });
  const followerPosition = useRef({ x: 0, y: 0 });
  const lastMousePos = useRef({ x: 0, y: 0 });
  const isHovered = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };

      const dist = Math.hypot(
        e.clientX - lastMousePos.current.x,
        e.clientY - lastMousePos.current.y,
      );

      if (dist > 8) {
        const newParticle: Particle = {
          id: particleIdCounter.current++,
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 12 + 6,
          opacity: 1,
          color: isHovered.current ? "#ff00ff" : "#00d4ff",
        };
        setParticles((prev) => [...prev, newParticle]);
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const animate = () => {
      const { x, y } = mousePosition.current;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${x - 12}px, ${y - 12}px, 0)`;
      }

      const fx =
        followerPosition.current.x + (x - followerPosition.current.x) * 0.12;
      const fy =
        followerPosition.current.y + (y - followerPosition.current.y) * 0.12;

      followerPosition.current = { x: fx, y: fy };

      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${fx - 24}px, ${fy - 24}px, 0)`;
      }

      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            opacity: p.opacity - 0.02,
            size: p.size * 0.96,
          }))
          .filter((p) => p.opacity > 0),
      );

      requestAnimationFrame(animate);
    };

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Hide custom cursor over input fields, textareas, and select elements
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("select")
      ) {
        cursorRef.current?.style.setProperty("opacity", "0");
        followerRef.current?.style.setProperty("opacity", "0");
        return;
      }
      
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button")
      ) {
        isHovered.current = true;
        cursorRef.current?.classList.add("hovered");
        followerRef.current?.classList.add("hovered");
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Show custom cursor when leaving input fields
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("select")
      ) {
        cursorRef.current?.style.setProperty("opacity", "1");
        followerRef.current?.style.setProperty("opacity", "1");
        return;
      }
      
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button")
      ) {
        isHovered.current = false;
        cursorRef.current?.classList.remove("hovered");
        followerRef.current?.classList.remove("hovered");
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseover", handleMouseEnter);
    document.addEventListener("mouseout", handleMouseLeave);
    requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseEnter);
      document.removeEventListener("mouseout", handleMouseLeave);
    };
  }, []);

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="cursor-trail"
          style={{
            left: `${p.x - p.size / 2}px`,
            top: `${p.y - p.size / 2}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            backgroundColor: p.color,
            color: p.color,
          }}
        />
      ))}
      <div ref={cursorRef} className="cursor" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  );
}

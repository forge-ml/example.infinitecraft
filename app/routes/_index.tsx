import { useState, useEffect, useRef } from "react";
import { json, type ActionFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { getResource } from "./utils/server";

// Updated Card component with drag and drop functionality
const Card = ({ emoji, name, onDragStart, onDragOver, onDrop, style }: {
  emoji: string;
  name: string;
  onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  style: React.CSSProperties;
}) => (
  <div
    draggable
    onDragStart={onDragStart}
    onDragOver={onDragOver}
    onDrop={onDrop}
    className="absolute p-4 bg-white size-32 border border-gray-200 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-200 flex flex-col items-center justify-center aspect-square cursor-move"
    style={style}
  >
    <span className="text-5xl mb-2">{emoji}</span>
    <span className="text-base font-semibold text-center">{name}</span>
  </div>
);


export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const elem1 = formData.get("elem1") as string;
  const elem2 = formData.get("elem2") as string;

  if (elem1 && elem2) {
    const result = await getResource(elem1, elem2);
    return json({ newResource: { name: result.resource, emoji: result.emoji } });
  }

  return json({ error: "Invalid elements" }, { status: 400 });
};

// Add these constants at the top level
const CARD_SIZE = 128; // 32px * 4 (size-32 class)

function findAvailablePosition(elements: any[], containerWidth: number, containerHeight: number) {
  let x, y;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    x = Math.random() * (containerWidth - CARD_SIZE);
    y = Math.random() * (containerHeight - CARD_SIZE);
    attempts++;

    if (attempts > maxAttempts) {
      console.warn("Couldn't find a non-overlapping position after", maxAttempts, "attempts");
      return null;
    }
  } while (elements.some(elem =>
    Math.abs(elem.x - x) < CARD_SIZE && Math.abs(elem.y - y) < CARD_SIZE
  ));

  return { x, y };
}

export default function Index() {
  const [elements, setElements] = useState([
    { name: "Fire", emoji: "🔥", x: 900, y: 400 },
    { name: "Water", emoji: "💧", x: 1100, y: 400 },
    { name: "Earth", emoji: "🪨", x: 1000, y: 250 },  // Changed to rock emoji
    { name: "Air", emoji: "🌬️", x: 1000, y: 550 }
  ]);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, name: string) => {
    e.dataTransfer.setData("text/plain", name);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const fetcher = useFetcher();

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetName: string) => {
    e.preventDefault();
    const sourceName = e.dataTransfer.getData("text/plain");

    if (sourceName !== targetName) {
      fetcher.submit(
        { elem1: sourceName, elem2: targetName },
        { method: "post" }
      );
    }
  };

  useEffect(() => {
    if (fetcher.data?.newResource) {
      const { name, emoji } = fetcher.data.newResource;
      console.log("Received new resource:", name, emoji);
      if (name && !elements.some(e => e.name === name)) {
        const containerRect = containerRef.current?.getBoundingClientRect();
        const position = findAvailablePosition(
          elements,
          containerRect?.width || 500,
          containerRect?.height || 500
        );
        if (position) {
          setElements(prevElements => [...prevElements, { name, emoji, ...position }]);
        } else {
          console.warn("No available position for new element");
        }
      }
    }
  }, [fetcher.data, elements]);

  return (
    <div className="font-sans p-4">
      <h1 className="text-2xl font-bold mb-4">Infinite Craft</h1>

      <div ref={containerRef} className="relative w-full h-[80vh] border border-gray-200 rounded-lg overflow-hidden">
        {elements.map((elem, index) => (
          <Card
            key={index}
            emoji={elem.emoji}
            name={elem.name}
            onDragStart={(e) => handleDragStart(e, elem.name)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, elem.name)}
            style={{
              left: elem.x,
              top: elem.y
            }}
          />
        ))}
      </div>
    </div>
  );
}
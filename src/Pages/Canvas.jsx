/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import Toolbar from "./Toolbar";
import AnimationBar from "../Components/AnimationBar";
import SaveButton from "../Components/SaveButton";
import LayersBar from "../Components/LayersBar";

const Canvas = () => {
  const stageRef = useRef(null);

  const defaultCanvasSize = {
    width: window.innerWidth * 0.7,
    height: window.innerHeight * 0.5,
  };

  const [canvasSize, setCanvasSize] = useState(defaultCanvasSize);
  const [isCanvasSet, setIsCanvasSet] = useState(false);

  const [copyEnabled, setCopyEnabled] = useState(false); // toggle for copy button
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("black");
  const [thickness, setThickness] = useState({
    brush: 8,
    eraser: 20,
  });
  const [showThicknessControl, setShowThicknessControl] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showOnionSkin, setShowOnionSkin] = useState(false);
  const [animationName, setAnimationName] = useState("");

  const [frames, setFrames] = useState(() => {
    const saved = localStorage.getItem("frames");
    return saved ? JSON.parse(saved) : [{ layers: [[]] }]; // One frame with one empty layer
  });

  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [currentLayerIndex, setCurrentLayerIndex] = useState(0);
  const [fps, setFps] = useState(12);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentFrame = frames[currentFrameIndex];
  const currentLayer = currentFrame?.layers?.[currentLayerIndex] || [];

  useEffect(() => {
    localStorage.setItem("frames", JSON.stringify(frames));
  }, [frames]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("frames");
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  const updateCanvasSize = () => {
    setCanvasSize({
      width: window.innerWidth * 0.7,
      height: window.innerHeight * 0.5,
    });
  };

  const handlePointerDown = (e) => {
    e.evt.preventDefault();
    setIsDrawing(true);

    // Push the current state to undo stack BEFORE any modification
    setUndoStack((prev) => [...prev, JSON.parse(JSON.stringify(frames))]);
    setRedoStack([]); // Clear redo stack on new action

    const stage = stageRef.current;
    const point = stage.getPointerPosition();
    const pressure = Math.max(e.evt.pressure || 0.5, 0.2);

    const newLine = {
      points: [point.x, point.y],
      stroke: tool === "eraser" ? "#FFF" : color,
      strokeWidth:
        tool === "brush"
          ? thickness.brush * pressure
          : tool === "eraser"
          ? thickness.eraser
          : 2 * pressure,
    };

    // Modify frames state
    setFrames((prevFrames) => {
      const updated = [...prevFrames];
      const current = { ...updated[currentFrameIndex] };

      const updatedLayers = [...current.layers];
      const currentLayer = [...updatedLayers[currentLayerIndex], newLine];

      updatedLayers[currentLayerIndex] = currentLayer;
      current.layers = updatedLayers;
      updated[currentFrameIndex] = current;

      return updated;
    });
    setCurrentLine(newLine);
  };

  // Undo & Redo
  const handleUndo = () => {
    if (undoStack.length === 0) return;

    // Pop the last state from the undo stack
    const previousState = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, -1)); // Remove the last state from undo stack
    setRedoStack((prev) => [...prev, JSON.parse(JSON.stringify(frames))]); // Add the current state to redo stack

    // Restore the previous state
    setFrames(JSON.parse(JSON.stringify(previousState)));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;

    // Pop the last state from the redo stack
    const nextState = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1)); // Remove the last state from redo stack
    setUndoStack((prev) => [...prev, JSON.parse(JSON.stringify(frames))]); // Add the current state to undo stack

    // Restore the next state
    setFrames(JSON.parse(JSON.stringify(nextState)));
  };

  const handlePointerMove = (e) => {
    if (!isDrawing) return;
    e.evt.preventDefault();
    const stage = stageRef.current;
    const point = stage.getPointerPosition();

    setFrames((prev) => {
      const updated = [...prev];
      const frame = { ...updated[currentFrameIndex] };
      const layers = [...frame.layers];
      const layer = [...layers[currentLayerIndex]];
      const lastLine = { ...layer[layer.length - 1] };
      lastLine.points = [...lastLine.points, point.x, point.y];
      layer[layer.length - 1] = lastLine;
      layers[currentLayerIndex] = layer;
      frame.layers = layers;
      updated[currentFrameIndex] = frame;
      return updated;
    });
  };

  const handlePointerUp = (e) => {
    e.evt.preventDefault();
    setIsDrawing(false);
  };

  const handleClearCanvas = () => {
    setFrames((prev) => {
      const updated = [...prev];
      const frame = { ...updated[currentFrameIndex] };
      const layers = [...frame.layers];
      layers[currentLayerIndex] = [];
      frame.layers = layers;
      updated[currentFrameIndex] = frame;
      return updated;
    });
  };

  const addFrame = () => {
    setFrames((prev) => [...prev, { layers: [[]] }]);
    setCurrentFrameIndex(frames.length);
    setCurrentLayerIndex(0);
  };

  const deleteFrame = () => {
    if (frames.length === 1) return;
    setFrames((prev) => {
      const updated = [...prev];
      updated.splice(currentFrameIndex, 1);
      return updated;
    });
    setCurrentFrameIndex((prev) => Math.max(0, prev - 1));
    setCurrentLayerIndex(0);
  };

  const prevFrame = () => {
    setCurrentFrameIndex((prev) => Math.max(0, prev - 1));
    setCurrentLayerIndex(0);
  };

  const nextFrame = () => {
    setCurrentFrameIndex((prev) => {
      const nextIndex = Math.min(frames.length - 1, prev + 1);

      if (copyEnabled && nextIndex !== prev) {
        setFrames((prevFrames) => {
          const copiedFrame = { ...prevFrames[prev] };
          const copiedLayers = copiedFrame.layers.map((layer) =>
            layer.map((line) => ({ ...line }))
          );

          const updated = [...prevFrames];
          const nextFrame = { ...updated[nextIndex] };

          // Only copy if it's a fresh/empty frame
          if (nextFrame.layers.every((layer) => layer.length === 0)) {
            nextFrame.layers = copiedLayers;
            updated[nextIndex] = nextFrame;
          }

          return updated;
        });
      }

      return nextIndex;
    });

    setCurrentLayerIndex(0);
  };

  const addLayer = () => {
    setFrames((prev) => {
      const updated = [...prev];
      const frame = { ...updated[currentFrameIndex] };
      frame.layers = [[], ...frame.layers];
      updated[currentFrameIndex] = frame;
      return updated;
    });
    setCurrentLayerIndex(0);
  };

  const deleteLayer = () => {
    if (currentFrame.layers.length === 1) return;
    setFrames((prev) => {
      const updated = [...prev];
      const frame = { ...updated[currentFrameIndex] };
      frame.layers.splice(currentLayerIndex, 1);
      updated[currentFrameIndex] = frame;
      return updated;
    });
    setCurrentLayerIndex((prev) => Math.max(0, prev - 1));
  };

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentFrameIndex((prev) => (prev + 1) % frames.length);
    }, 1000 / fps);
    return () => clearInterval(interval);
  }, [isPlaying, fps, frames.length]);

  // Saving animations
  const saveAnimation = () => {
    const name = prompt("Enter a name for your animation:");
    if (!name) return;

    const saved = JSON.parse(localStorage.getItem("savedAnimations") || "[]");
    const newEntry = {
      id: Date.now(),
      name,
      frames,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem(
      "savedAnimations",
      JSON.stringify([newEntry, ...saved])
    );
  };

  // Load saved animations
  useEffect(() => {
    const loaded = localStorage.getItem("currentAnimation");
    if (loaded) {
      const animation = JSON.parse(loaded);

      // Confirm if current work exists
      const isWorking = frames.length > 1 || frames[0].layers.length > 1;
      if (isWorking) {
        const confirmLoad = window.confirm(
          "Load this animation? Unsaved work will be lost."
        );
        if (!confirmLoad) return;
      }

      setFrames(animation.frames);
      setCurrentFrameIndex(0);
      setCurrentLayerIndex(0);

      // Set animation name
      if (animation.name) {
        setAnimationName(animation.name);
      }

      // Clear temp storage
      localStorage.removeItem("currentAnimation");
    }
  }, []);

  return (
    <>
      <main>
        <Toolbar
          canvasWidth={canvasSize.width}
          onSelectTool={setTool}
          onChangeColor={setColor}
          onClearCanvas={handleClearCanvas}
          thickness={thickness}
          setThickness={setThickness}
          showThicknessControl={showThicknessControl}
          setShowThicknessControl={setShowThicknessControl}
        />

        <div className="flex flex-col items-center w-full relative">
          {/* Canvas Size Controls */}
          <div className="mb-4 flex gap-4 items-center">
            {!isCanvasSet ? (
              <>
                <label className="text-white">
                  Width:
                  <input
                    type="range"
                    min="1000"
                    max={window.innerWidth * 0.75}
                    value={canvasSize.width}
                    onChange={(e) =>
                      setCanvasSize((prev) => ({
                        ...prev,
                        width: parseInt(e.target.value),
                      }))
                    }
                    className="ml-2"
                  />
                </label>

                <label className="text-white">
                  Height:
                  <input
                    type="range"
                    min="400"
                    max={window.innerHeight * 0.65}
                    value={canvasSize.height}
                    onChange={(e) =>
                      setCanvasSize((prev) => ({
                        ...prev,
                        height: parseInt(e.target.value),
                      }))
                    }
                    className="ml-2"
                  />
                </label>

                <button
                  className="bg-emerald-600 text-white px-4 py-2 rounded-full hover:bg-emerald-700 transition"
                  onClick={() => setIsCanvasSet(true)}
                >
                  Set Canvas Size
                </button>
              </>
            ) : (
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition"
                onClick={() => {
                  setCanvasSize(defaultCanvasSize);
                  setIsCanvasSet(false);
                }}
              >
                Reset Canvas Size
              </button>
            )}
          </div>

          {/* Konva Canvas (Always visible) */}
          <Stage
            ref={stageRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="bg-white rounded-lg shadow-lg"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          >
            <Layer>
              {/* Onion Skinning */}
              {showOnionSkin &&
                currentFrameIndex > 0 &&
                frames[currentFrameIndex - 1]?.layers?.flatMap((layer) =>
                  layer.map((line, i) => (
                    <Line
                      key={`onion-${i}`}
                      points={line.points}
                      stroke={line.stroke}
                      strokeWidth={line.strokeWidth}
                      opacity={0.3}
                      tension={0.9}
                      lineCap="round"
                    />
                  ))
                )}

              {/* Current Frame Layers */}
              {currentFrame?.layers?.flatMap((layer, layerIndex) =>
                layer.map((line, i) => (
                  <Line
                    key={`line-${layerIndex}-${i}`}
                    points={line.points}
                    stroke={line.stroke}
                    strokeWidth={line.strokeWidth}
                    tension={0.9}
                    lineCap="round"
                  />
                ))
              )}
            </Layer>
          </Stage>
        </div>

        {/* Layers Sidebar */}
        {/* <div
          className="absolute top-[100px] right-0 flex flex-col gap-2 bg-[rgba(63,84,53,0.15)] 
          border border-[rgba(63,84,53,0.14)] backdrop-blur-[15.6px] shadow-lg 
          shadow-[rgba(0,0,0,0.1)] rounded-xl p-4 text-white overflow-y-auto"
          style={{ height: canvasSize.height, maxHeight: canvasSize.height }}
        >
          <h2 className="text-lg font-bold mb-3">Layers</h2>
          {currentFrame?.layers?.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentLayerIndex(i)}
              className={`px-4 py-2 rounded-lg transition text-left text-sm ${
                currentLayerIndex === i
                  ? "bg-emerald-600"
                  : "bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)]"
              }`}
            >
              Layer {currentFrame?.layers.length - i}
            </button>
          ))}

          <div className="flex justify-between mt-4">
            <button
              onClick={addLayer}
              className="text-emerald-400 hover:text-emerald-300"
            >
              <i className="ri-add-line"></i>
            </button>
            <button
              onClick={deleteLayer}
              className="text-red-400 hover:text-red-300"
            >
              <i className="ri-delete-bin-line"></i>
            </button>
          </div>
        </div> */}
      </main>

      {/* Animation Bar */}
      <AnimationBar
        prevFrame={prevFrame}
        nextFrame={nextFrame}
        deleteFrame={deleteFrame}
        addFrame={addFrame}
        setIsPlaying={setIsPlaying}
        handleUndo={handleUndo}
        handleRedo={handleRedo}
        showOnionSkin={showOnionSkin}
        setShowOnionSkin={setShowOnionSkin}
        copyEnabled={copyEnabled}
        setCopyEnabled={setCopyEnabled}
        currentFrameIndex={currentFrameIndex}
        frames={frames}
        fps={fps}
        setFps={setFps}
      />
      {/* Save Button */}
      <SaveButton 
        saveAnimation={saveAnimation} 
      />
      {/* Layers SideBar */}
      <LayersBar
        addLayer={addLayer}
        deleteLayer={deleteLayer}
        canvasSize={canvasSize}
        currentLayerIndex={currentLayerIndex}
        setCurrentLayerIndex={setCurrentLayerIndex}
        currentFrame={currentFrame}
      />
    </>
  );
};

export default Canvas;

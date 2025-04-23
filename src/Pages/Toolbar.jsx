import React, { useEffect, useRef } from "react";
import Draggable from "react-draggable";

const Toolbar = ({
  canvasWidth,
  onSelectTool,
  onChangeColor,
  onClearCanvas,
  thickness,
  setThickness,
  showThicknessControl,
  setShowThicknessControl,
}) => {
  const [isMinimized, setIsMinimized] = React.useState(false);
  const [isFloating, setIsFloating] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 20, y: 20 });
  const toolbarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".toolbar-icon")) {
        setShowThicknessControl(null);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  

  useEffect(() => {
    const savedPosition = localStorage.getItem("toolbarPosition");
    if (savedPosition) {
      const { x, y } = JSON.parse(savedPosition);
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 150, x)),
        y: Math.max(0, Math.min(window.innerHeight - 200, y)),
      });
    }
  }, []);

  useEffect(() => {
    if (canvasWidth >= window.innerWidth * 0.9) {
      setIsFloating(true);
    }
  }, [canvasWidth]);

  const handleStop = (e, data) => {
    setPosition({ x: data.x, y: data.y });
    localStorage.setItem("toolbarPosition", JSON.stringify(data));
  };

  const handleColorChange = (e) => {
    onChangeColor(e.target.value);
  };

  const handleRightClick = (tool, e) => {
    e.preventDefault();
    setShowThicknessControl(showThicknessControl === tool ? null : tool);
  };

  return (
    <Draggable
      nodeRef={toolbarRef}
      disabled={!isFloating}
      position={isFloating ? undefined : position}
      onStop={handleStop}
    >
      <div
        ref={toolbarRef}
        className="fixed z-50 top-10 left-4 backdrop-blur-xs border-2 border-emerald-950 
        text-white p-5 rounded-3xl flex flex-col gap-4 cursor-move 
        shadow-2xl shadow-emerald-900 bg-gray-900/90"
      >
        {isMinimized ? (
          <div className="flex flex-col items-center ">
            <button
              onClick={() => setIsMinimized(false)}
              className="bg-black rounded-full p-2 hover:bg-gray-700"
              title="Expand Toolbar"
            >
              🔼
            </button>
            <span className="text-sm text-gray-300 mt-1.5">Toolbar</span>
          </div>
        ) : (
          <>
            <button
              onClick={() => setIsMinimized(true)}
              className="border-1 border-emerald-700 w-full bg-black rounded-full p-1 hover:bg-gray-700"
            >
              ➖
            </button>
            <h3 className="flex justify-center bg-black px-3 py-1 rounded-2xl text-lg font-semibold">
              - TOOLBAR -
            </h3>
            <hr className="border-gray-700" />
            <button
              onClick={() => setIsFloating(!isFloating)}
              className="bg-gray-700 px-2 py-1 rounded transition hover:bg-gray-600"
            >
              {isFloating ? "Fix Position" : "Enable Floating"}
            </button>
            <hr className="border-gray-700" />
            <div className="flex flex-col gap-3">
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => onSelectTool("pencil")}
                className="toolbar-icon bg-black p-1 border-2 rounded-md border-emerald-700 hover:bg-gray-800"
              >
                ✏️ Pencil
              </button>

              <button
                onContextMenu={(e) => handleRightClick("brush", e)}
                onClick={() => onSelectTool("brush")}
                className="toolbar-icon bg-black p-1 border-2 rounded-md border-emerald-700 hover:bg-gray-800"
              >
                🖌️ Brush
                {showThicknessControl === "brush" && (
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={thickness.brush}
                    onChange={(e) =>
                      setThickness((prev) => ({
                        ...prev,
                        brush: parseInt(e.target.value),
                      }))
                    }
                    className="ml-2 w-24"
                  />
                )}
              </button>

              <button
                onContextMenu={(e) => handleRightClick("eraser", e)}
                onClick={() => onSelectTool("eraser")}
                className="toolbar-icon bg-black p-0.5 border-2 rounded-md border-emerald-700 hover:bg-gray-800"
              >
                🧽 Eraser
                {showThicknessControl === "eraser" && (
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={thickness.eraser}
                    onChange={(e) =>
                      setThickness((prev) => ({
                        ...prev,
                        eraser: parseInt(e.target.value),
                      }))
                    }
                    className="ml-2 w-24"
                  />
                )}
              </button>

              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={onClearCanvas}
                className="toolbar-icon bg-black border-2 border-emerald-700 rounded-md p-0.5 hover:bg-gray-800"
              >
                🫧 Clean Slate
              </button>

              <div className="flex items-center gap-2">
                <label className="text-white">🌈 Color Picker</label>
                <input
                  type="color"
                  onChange={handleColorChange}
                  className="w-10 h-10 cursor-pointer"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </Draggable>
  );
};

export default Toolbar;

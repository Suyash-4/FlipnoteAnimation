/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React from "react";

export const LayersBar = ({
    addLayer,
    deleteLayer,
    canvasSize,
    currentLayerIndex,
    setCurrentLayerIndex,
    currentFrame
}) => {
  return (
    <div
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
    </div>
  );
};

export default LayersBar;
import React from 'react';

const AnimationBar = ({
  prevFrame,
  nextFrame,
  deleteFrame,
  addFrame,
  setIsPlaying,
  handleUndo,
  handleRedo,
  showOnionSkin,
  setShowOnionSkin,
  copyEnabled,
  setCopyEnabled,
  currentFrameIndex,
  frames,
  fps,
  setFps
}) => {
  return (
    <div
      className="fixed bottom-0 left-1/2 transform -translate-x-1/2 
             w-full max-w-6xl p-4 rounded-2xl 
             bg-[rgba(63,84,53,0.15)] backdrop-blur-[8.6px] 
             border border-[rgba(63,84,53,0.14)] 
             shadow-lg shadow-[rgba(0,0,0,0.1)] 
             flex justify-between items-center text-white z-50">
      {/* Frame navigation and control */}
      <div className="flex gap-4 items-center">
        <button
          title="Previous Frame"
          onClick={prevFrame}
          className="hover:text-blue-400 transition text-3xl"
        >
          <i className="ri-arrow-left-s-line"></i>
        </button>
        <button
          title="Next Frame"
          onClick={nextFrame}
          className="hover:text-blue-400 transition text-3xl"
        >
          <i className="ri-arrow-right-s-line"></i>
        </button>
        <button
          title="Delete Frame"
          onClick={deleteFrame}
          className="hover:text-red-400 transition text-xl"
        >
          <i className="ri-delete-bin-line"></i>
        </button>
        <button
          title="Add Frame"
          onClick={addFrame}
          className="hover:text-emerald-400 transition text-xl"
        >
          <i className="ri-add-line"></i>
        </button>
      </div>

      {/* Play/Pause Controls */}
      <div className="flex gap-4 items-center">
        <button
          title="Play"
          onClick={() => setIsPlaying(true)}
          className="hover:text-blue-400 transition text-xl"
        >
          <i className="ri-play-fill"></i>
        </button>
        <button
          title="Pause"
          onClick={() => setIsPlaying(false)}
          className="hover:text-yellow-400 transition text-xl"
        >
          <i className="ri-pause-fill"></i>
        </button>
      </div>

      {/* Undo & Redo */}
      <div className="flex gap-4">
        <div>
          <button
            title="Undo"
            onClick={handleUndo}
            className="hover:text-lime-300 hover:scale-[1.1] transition"
          >
            <i className="ri-arrow-go-back-line"></i>
          </button>
        </div>
        <div>
          <button
            title="Redo"
            onClick={handleRedo}
            className="hover:text-lime-600 hover:scale-[1.1] transition"
          >
            <i className="ri-arrow-go-forward-line"></i>
          </button>
        </div>
      </div>

      {/* Onion Skin Toggle */}
      <div>
        <button
          title="Light preview of previous frame"
          onClick={() => setShowOnionSkin(!showOnionSkin)}
          className={`border px-3 py-1 rounded-xl transition text-lg font-medium ${
            showOnionSkin ? 'text-purple-400' : 'text-gray-400'
          }`}
        >
          Onion Skin
        </button>
      </div>

      {/* Copy Button */}
      <div>
        <button
          className={`${
            copyEnabled ? 'bg-blue-600' : 'bg-gray-600'
          } text-white px-4 py-2 rounded-full transition`}
          onClick={() => setCopyEnabled((prev) => !prev)}
        >
          {copyEnabled ? 'Copy ON' : 'Copy OFF'}
        </button>
      </div>

      {/* Frame Indicator */}
      <div className="text-lg font-semibold">
        Frame {currentFrameIndex + 1} / {frames.length}
      </div>

      {/* FPS Control */}
      <div className="flex items-center gap-2 text-sm">
        <label htmlFor="fps">FPS</label>
        <input
          id="fps"
          type="range"
          min="1"
          max="30"
          value={fps}
          onChange={(e) => setFps(Number(e.target.value))}
          className="w-28"
        />
        <span>{fps}</span>
      </div>
    </div>
  );
};

export default AnimationBar;

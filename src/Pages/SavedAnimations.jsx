import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const SavedAnimations = () => {
  const navigate = useNavigate();
  const [animations, setAnimations] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedAnimations") || "[]");
    setAnimations(saved);
  }, []);

  const handleLoad = (animation) => {
    localStorage.setItem("currentAnimation", JSON.stringify(animation));
    navigate("/canvas");
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this animation?"
    );
    if (!confirmDelete) return;

    const updated = animations.filter((anim) => anim.id !== id);
    setAnimations(updated);
    localStorage.setItem("savedAnimations", JSON.stringify(updated));
  };

  // Gif saving
  // const generateGIF = async (animation) => {
  //   const { frames, width, height, fps } = animation;
  
  //   console.log("Generating GIF for:", animation.name);
  
  //   const gif = new GIF({
  //     workers: 2,
  //     quality: 10,
  //     width,
  //     height,
  //     workerScript: "/gif.worker.js", 
  //     repeat: 0,
  //     background: "#00000000",
  //     transparent: "#00000000",
  //     dither: false,
  //   });
  
  //   const tempCanvas = document.createElement("canvas");
  //   const ctx = tempCanvas.getContext("2d");
  //   tempCanvas.width = width;
  //   tempCanvas.height = height;
  
  //   for (let i = 0; i < frames.length; i++) {
  //     const frame = frames[i];
  //     ctx.clearRect(0, 0, width, height);
  
  //     console.log(`Loading frame ${i + 1}/${frames.length}`);
  
  //     await Promise.all(
  //       frame.layers.map((layer) => {
  //         return new Promise((resolve) => {
  //           const img = new Image();
  //           img.onload = () => {
  //             ctx.drawImage(img, 0, 0);
  //             resolve();
  //           };
  //           img.onerror = (err) => {
  //             console.error("Image load error", err);
  //             resolve(); // Skip broken images
  //           };
  //           img.src = layer.dataURL;
  //         });
  //       })
  //     );
  
  //     gif.addFrame(ctx, { delay: 1000 / (fps || 10) });
  //   }
  
  //   gif.on("finished", (blob) => {
  //     console.log("GIF finished rendering");
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = `${animation.name || "animation"}.gif`;
  //     a.click();
  //     URL.revokeObjectURL(url);
  //   });
  
  //   gif.render();
  // };
  
  return (
    <div className="p-6 w-fit grid grid-cols-2 gap-8">
      {animations.length === 0 ? (
        <p className="text-white">No saved animations yet.</p>
      ) : (
        animations.map((animation) => (
          <div
            key={animation.id}
            className="mt-4 px-20 py-10 rounded-3xl bg-[rgba(63,84,53,0.15)] shadow-lg 
      shadow-[rgba(0,0,0,0.1)] backdrop-blur-[8.6px] 
      border border-[rgba(67,95,54,0.86)] text-white flex flex-col items-center"
          >
            <h3 className="text-lg font-semibold">{animation.name}</h3>

            <div className=" flex flex-col gap-2">
              <button
                className="text-sm text-blue-500 underline cursor-pointer"
                onClick={() => handleLoad(animation)}
              >
                Load
              </button>

              <button
                className="text-sm text-red-500 underline cursor-pointer"
                onClick={() => handleDelete(animation.id)}
              >
                Delete
              </button>
              {/* <button
                className="text-sm text-green-500 underline cursor-pointer"
                onClick={() => generateGIF(animation)}
              >
                Download GIF
              </button> */}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SavedAnimations;

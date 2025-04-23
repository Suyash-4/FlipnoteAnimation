// import React, { useState } from "react";
// import { Routes, Route, Link, useLocation } from "react-router-dom";
// import Background from "./Components/Background";
// import Home from "./Pages/Home";
// import Canvas from "./Pages/Canvas";
// import SavedAnimations from "./Pages/SavedAnimations";
// import Toolbar from "./Pages/Toolbar";

// const App = () => {
//   const location = useLocation();
//   return (
//     <>
//       <div className="absolute inset-0">
//         <Background />
//       </div>
//       <header className="fixed top-0 w-screen p-10 backdrop-blur-xs">
//         <nav className="flex  justify-between ">
//           <h1 className="text-3xl text-amber-200">Pixel Frames</h1>
//           <ul className="flex gap-15 text-2xl text-white">
//             <li>
//               <Link to="/">Home</Link>
//             </li>
//             <li>
//               <Link to="/canvas">Canvas</Link>
//             </li>
//             <li>
//               <Link to="/saved">Saved Animations</Link>
//             </li>
//           </ul>
//         </nav>
//       </header>
//       {/* <Toolbar/> */}
//       {location.pathname === "/canvas" && <Toolbar />}
//       <main
//         className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]
//   text-white p-25 mt-10 bg-transparent "
//       >
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/canvas" element={<Canvas />} />
//           <Route path="/saved" element={<SavedAnimations />} />
//         </Routes>
//       </main>
//     </>
//   );
// };

// export default App;


import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Background from "./Components/Background";
import Home from "./Pages/Home";
import Canvas from "./Pages/Canvas";
import SavedAnimations from "./Pages/SavedAnimations";
import Toolbar from "./Pages/Toolbar";

const App = () => {
  const location = useLocation();

  return (
    <>
      {/* Background Component */}
      <div className="absolute inset-0">
        <Background />
      </div>

      {/* Header Section */}
      <header className="fixed top-0 w-screen p-10 backdrop-blur-xs ">
        <nav className="flex justify-between">
          <h1 className="text-base sm:text-base md:text-xl lg:text-2xl text-amber-200">Pixel Frames</h1>
          <ul className="flex gap-10 sm:gap-8 md:gap-10 lg:gap-13 xl:gap-15  text-xs text-white">
            <li className="text-[0.9rem] sm:text-base md:text-xl lg:text-2xl">
              <Link to="/">Home</Link>
            </li>
            <li className="text-[0.9rem] sm:text-base md:text-xl lg:text-2xl">
              <Link to="/canvas">Canvas</Link>
            </li>
            <li className="text-[0.9rem] sm:text-base md:text-xl lg:text-2xl">
              <Link to="/saved">Saved<br />Animations</Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Conditional Toolbar Rendering */}
      {/* {location.pathname === "/canvas" && <Toolbar />} */}

      {/* Main Section */}
      <main className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-white p-25 mt-10 bg-transparent">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/canvas" element={<Canvas />} />
          <Route path="/saved" element={<SavedAnimations />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
import React from "react";
import { Link } from "react-router-dom";
import SpotlightCard from "../Components/SpotlightCard";

const Home = () => {
  return (
    <section className="flex flex-col items-center justify-center gap-5 sm:gap-10 text-white text-center pt-[6rem] sm:pt-[8rem] relative">
      {/* Main heading */}
      <h1 className="py-5 text-lg sm:text-xl md:text-2xl lg:text-4xl font-bold text-amber-300 drop-shadow-lg">
        Welcome to Pixel Frames
      </h1>
      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mt-2 sm:mt-4 max-w-xl">
        A simple yet powerful pixel animation tool inspired by classic
        flipbook-style animation. Create, edit, and save frame-by-frame pixel
        art animations seamlessly.
      </p>

      {/* Features Section */}
      <div className="text-[1rem] mt-6 sm:mt-10 flex flex-col sm:flex-row sm:flex-wrap justify-center gap-7 sm:gap-8 w-full">
        <FeatureCard
          title="🎨Pixel Canvas"
          description="Draw and animate frame by frame with a simple and intuitive canvas."
          link="/canvas"
          buttonText="Start Drawing"

        />
        <FeatureCard
          title="💾Saved Animations"
          description="Access your saved pixel animations anytime and continue your work."
          link="/saved"
          buttonText="View Animations"
        />
      </div>

      {/* About Button */}
      <SpotlightCard
        className="custom-spotlight-card text-sm sm:text-base md:text-lg lg:text-xl rounded-full px-5 py-3"
        spotlightColor="rgba(92, 237, 138, 0.2)"
      >
        <button className="cursor-pointer">About the Project</button>
      </SpotlightCard>
    </section>
  );
};

/* Feature Card Component */
const FeatureCard = ({ title, description, link, buttonText }) => (
  <div className="bg-gray-800 p-6 = rounded-4xl w-72 text-center transition-transform transform hover:scale-105">
    <h2 className="text-xl font-semibold text-amber-200">{title}</h2>
    <p className="text-gray-400 pt-4 pb-3">{description}</p>
    <Link
      to={link}
      className="inline-block mt-7 px-4 py-2 bg-amber-500 text-black font-semibold rounded-lg shadow-md hover:bg-amber-400"
    >
      {buttonText}
    </Link>
  </div>
);

export default Home;

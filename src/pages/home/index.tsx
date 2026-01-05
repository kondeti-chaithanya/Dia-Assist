import React from "react";
import HeroSection from "./components/HeroSection";
import Chatbot from "@/global/components/Chat bot/components/Chatbot";

const Home: React.FC = () => {
  return (
    <>
      <HeroSection />
      <Chatbot />
    </>
  );
};

export default Home;

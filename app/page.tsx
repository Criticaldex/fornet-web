import Header from "./components/Header";
import Hero from "./components/Hero";
import Modules from "./components/Modules";
import Carousel from "./components/Carousel";
import Benefits from "./components/Benefits";
import VideoSection from "./components/VideoSection";
import Values from "./components/Values";
import Contact from "./components/Contact";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Modules />
        <Carousel />
        <Benefits />
        <VideoSection />
        <Values />
        <Contact />
      </main>
      <footer
        style={{
          background: "#000",
          textAlign: "center",
          padding: "20px",
          fontSize: "0.85rem",
          color: "#fff",
        }}
      >
        <p>© ForNet 2026</p>
      </footer>
    </>
  );
}

import Hero from "@/components/sections/Hero";
import Capabilities from "@/components/sections/Capabilities";
import HowWeWork from "@/components/sections/HowWeWork";
import SelectedWork from "@/components/sections/SelectedWork";
import WhyTaskive from "@/components/sections/WhyTaskive";
import Pricing from "@/components/sections/Pricing";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Capabilities />
      <HowWeWork />
      <SelectedWork />
      <WhyTaskive />
      <Pricing />
      <FinalCTA />
    </>
  );
}

import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Method from "@/components/Method";
import Teardown from "@/components/Teardown";
import Services from "@/components/Services";
import Journey from "@/components/Journey";
import Proof from "@/components/Proof";
import Difference from "@/components/Difference";
import Questions from "@/components/Questions";
import FinalCTA from "@/components/FinalCTA";
import ScrollProgress from "@/components/ScrollProgress";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Hero />
      <Problem />
      <Method />
      <Teardown />
      <Services />
      <Journey />
      <Proof />
      <Difference />
      <Questions />
      <FinalCTA />
    </>
  );
}

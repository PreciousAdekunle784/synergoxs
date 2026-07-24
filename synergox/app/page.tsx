import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Method from "@/components/Method";
import Teardown from "@/components/Teardown";
import Paths from "@/components/Paths";
import Services from "@/components/Services";
import Journey from "@/components/Journey";
import Proof from "@/components/Proof";
import Difference from "@/components/Difference";
import Trust from "@/components/Trust";
import Questions from "@/components/Questions";
import LeadCapture from "@/components/LeadCapture";
import FinalCTA from "@/components/FinalCTA";
import ScrollProgress from "@/components/ScrollProgress";
import StickyCTA from "@/components/StickyCTA";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Hero />
      <Problem />
      <Method />
      <Teardown />
      <Paths />
      <Services />
      <Journey />
      <Proof />
      <Difference />
      <Trust />
      <Questions />
      <LeadCapture />
      <FinalCTA />
      <StickyCTA />
    </>
  );
}

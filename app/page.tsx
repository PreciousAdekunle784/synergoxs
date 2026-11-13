import Hero from "@/components/Hero";
import Problem from "@/components/Problem";
import Teardown from "@/components/Teardown";
import System from "@/components/System";
import Process from "@/components/Process";
import Proof from "@/components/Proof";
import Testimonials from "@/components/Testimonials";
import Difference from "@/components/Difference";
import Guarantee from "@/components/Guarantee";
import Questions from "@/components/Questions";
import FinalCTA from "@/components/FinalCTA";
import StickyCTA from "@/components/StickyCTA";

/**
 * The home page is one argument, in order. Each section answers the question
 * the one before it raises, and every green button goes to the same place:
 * the free growth teardown.
 *
 *   Hero          What is this, and what do I do next?
 *   Problem       Is this about me?
 *   Teardown      What is it costing me?           (their own number)
 *   System        What would you actually build?
 *   Process       How long, and how much of my time?
 *   Proof         Has it worked for anyone?
 *   Testimonials  What's it like to work with you?
 *   Difference    Why you and not another agency?
 *   Guarantee     What if it doesn't work?
 *   Questions     Everything else.
 *   FinalCTA      The ask, restated with what they get.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <Teardown />
      <System />
      <Process />
      <Proof />
      <Testimonials />
      <Difference />
      <Guarantee />
      <Questions />
      <FinalCTA />
      <StickyCTA />
    </>
  );
}

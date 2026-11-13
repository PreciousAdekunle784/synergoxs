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
import { getContent } from "@/lib/content/get";

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
 *   Proof         Has it worked for anyone?        (case studies; hidden if none)
 *   Testimonials  What do clients say?             (hidden if none published)
 *   Difference    Why you and not another agency?
 *   Guarantee     What if it doesn't work?
 *   Questions     Everything else.
 *   FinalCTA      The ask, restated with what they get.
 *
 * Headlines, case studies and testimonials come from the dashboard.
 */
export default async function Home() {
  const { copy, projects, testimonials } = await getContent();
  const head = (k: string) => ({
    title: copy[`${k}.title`],
    accent: copy[`${k}.accent`],
    lede: copy[`${k}.lede`] ?? copy[`${k}.sub`],
  });

  return (
    <>
      <Hero copy={copy} />
      <Problem copy={head("problem")} />
      <Teardown copy={head("teardown")} />
      <System copy={head("system")} />
      <Process copy={head("process")} />
      <Proof copy={head("results")} projects={projects} />
      <Testimonials copy={head("testimonials")} testimonials={testimonials} />
      <Difference copy={head("why")} />
      <Guarantee copy={head("guarantee")} />
      <Questions copy={head("faq")} />
      <FinalCTA copy={head("final")} />
      <StickyCTA />
    </>
  );
}

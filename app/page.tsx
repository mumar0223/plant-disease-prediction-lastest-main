import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { Steps } from "@/components/home/Steps";
import { Crops } from "@/components/home/Crops";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Steps />
      <Crops />
    </>
  );
}

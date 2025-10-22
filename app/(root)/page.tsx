import Features from "@/modules/landing/views/ui/features";
import Hero from "@/modules/landing/views/ui/hero";
import Preview from "@/modules/landing/views/ui/preview";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <Hero />
      <Features />
      <Preview />
    </div>
  );
}

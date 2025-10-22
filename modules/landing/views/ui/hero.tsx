import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <div className="max-w-3xl mx-auto py-20 md:py-24 px-6">
      <div className="text-center grid gap-4">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Encrypted Cloud For Environment Variables
        </h1>
        <p className="text-sm sm:text-lg md:text-xl text-foreground/80 leading-relaxed">
          I always loose my environment variables. So i built this tool to help
          me manage them securely. It allows you to store and retrieve
          environment variables securely in the cloud. free and self-hostable
        </p>
      </div>
      <div className="flex items-center gap-4 justify-center mt-10">
        <Button size="lg" variant="outline">
          View Repo
        </Button>
        <Button size="lg">Get Started</Button>
      </div>
    </div>
  );
}

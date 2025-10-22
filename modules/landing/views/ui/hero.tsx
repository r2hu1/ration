import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Hero() {
  return (
    <div className="max-w-4xl mx-auto py-20 md:py-24 px-6">
      <div className="sm:text-center grid gap-4">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Encrypted Cloud For Your Environment Variables
        </h1>
        <p className="text-sm sm:text-lg md:text-xl text-foreground/80 leading-relaxed">
          Securely store, sync, and manage environment variables across all your
          projects and teams with enterprise-grade encryption.
        </p>
      </div>
      <div className="flex items-center gap-4 sm:justify-center mt-10">
        <Button variant="outline" asChild>
          <Link href="https://github.com/r2hu1/ration">View Repo</Link>
        </Button>
        <Button>
          <Link href="/auth/login-or-create-account">Get Started</Link>
        </Button>
      </div>
    </div>
  );
}

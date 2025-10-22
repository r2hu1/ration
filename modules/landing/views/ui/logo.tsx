import { Container } from "lucide-react";
import Link from "next/link";

export const Logo = () => (
  <Link
    href="/"
    className="flex items-center gap-1 w-fit px-2 py-0.5 hover:bg-secondary"
  >
    <Container className="h-4! w-4!" />
    <h1 className="text-lg font-bold">Ration</h1>
  </Link>
);

import Link from "next/link";
import { Button } from "@/components/Button";

export default function NotFound() {
  return (
    <div className="relative mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-mono text-xs text-violet-300">404</p>
      <h1 className="mt-2 font-display text-4xl md:text-6xl font-bold leading-tight">
        Lost in the <span className="text-gradient">aether</span>.
      </h1>
      <p className="mt-3 max-w-md text-ink-300">
        This market does not exist — or has resolved off the radar.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/"><Button size="lg">Back to home</Button></Link>
        <Link href="/markets"><Button size="lg" variant="secondary">Browse markets</Button></Link>
      </div>
    </div>
  );
}

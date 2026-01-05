import Image from "next/image";
import { NotifyForm } from "@/components/NotifyForm";

const heroImage = "/hero.jpg";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-foreground">
      <header className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 pt-14 pb-8 text-center">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.28em] text-muted">Ashley Vaughan</p>
          <p className="font-display text-sm tracking-[0.2em] text-muted/80">and</p>
          <p className="text-sm uppercase tracking-[0.28em] text-muted">Matthew Robillard</p>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-4 pb-16 text-center sm:gap-10 sm:px-6">
        <div className="w-full overflow-hidden rounded-sm border border-[var(--border)] bg-white shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
          <Image
            src={heroImage}
            alt="Ashley and Matthew"
            width={1600}
            height={900}
            priority
            className="h-auto w-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <p className="font-script text-2xl text-muted">
            Charlottesville, Virginia
          </p>
          <p className="text-lg uppercase tracking-[0.22em] text-foreground">
            May 31, 2026
          </p>
        </div>

        <NotifyForm />
      </main>
    </div>
  );
}

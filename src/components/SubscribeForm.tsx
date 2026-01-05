"use client";

import { FormEvent, useState } from "react";

type FormState =
  | { status: "idle"; message?: string }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

const emailPattern =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>({ status: "idle" });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!emailPattern.test(email.trim())) {
      setState({
        status: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    try {
      setState({ status: "submitting" });
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const body = await response.json();
      if (!response.ok) {
        throw new Error(body?.error || "Something went wrong");
      }

      setEmail("");
      setState({
        status: "success",
        message:
          body?.message || "You're on the list. We'll keep you in the loop.",
      });
    } catch (error) {
      setState({
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "We couldn't save that. Please try again.",
      });
    }
  };

  const disabled = state.status === "submitting";

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full space-y-4"
      aria-label="Join our mailing list"
    >
      <label className="block text-sm uppercase tracking-[0.2em] text-muted">
        Email for updates
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="email"
          name="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-full border border-[var(--border)] bg-white/80 px-5 py-3 text-base text-foreground shadow-inner outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/30"
          aria-label="Email address"
        />
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex items-center justify-center rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:-translate-y-[1px] hover:bg-[#2a201a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent)] disabled:translate-y-0 disabled:opacity-60"
        >
          {state.status === "submitting" ? "Sending..." : "Join the list"}
        </button>
      </div>
      {state.status === "success" && (
        <p className="text-sm text-emerald-700">{state.message}</p>
      )}
      {state.status === "error" && (
        <p className="text-sm text-red-700">{state.message}</p>
      )}
    </form>
  );
}

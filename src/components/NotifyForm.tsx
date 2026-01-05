"use client";

import { FormEvent, useState } from "react";

type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

const emailPattern =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export function NotifyForm() {
  const [name, setName] = useState("");
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
        body: JSON.stringify({ email, name }),
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body?.error || "Something went wrong");
      }
      setName("");
      setEmail("");
      setState({
        status: "success",
        message: body?.message || "You’re on the list. Thank you!",
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
    <div className="w-full max-w-2xl text-center">
      <p className="mb-3 text-sm uppercase tracking-[0.24em] text-muted">
        Get notified when details are available
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
        aria-label="Get notified"
      >
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-sm border border-[var(--border)] bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/40"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-sm border border-[var(--border)] bg-white px-4 py-3 text-sm text-foreground outline-none transition focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/40"
        />
        <button
          type="submit"
          disabled={disabled}
          className="inline-flex items-center justify-center rounded-sm bg-[var(--foreground)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[#26211d] disabled:opacity-60 h-[44px] whitespace-nowrap sm:h-[44px]"
          style={{ minHeight: "44px" }}
        >
          {state.status === "submitting" ? "Sending..." : "Notify me"}
        </button>
      </form>
      {state.status === "success" && (
        <p className="mt-3 text-sm text-emerald-700">{state.message}</p>
      )}
      {state.status === "error" && (
        <p className="mt-3 text-sm text-red-700">{state.message}</p>
      )}
    </div>
  );
}

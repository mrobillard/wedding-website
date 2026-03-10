"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import "./page.css";

const navLinks = [
  { href: "#story", label: "Our Story" },
  { href: "#details", label: "Details" },
  { href: "#meetgreet", label: "Meet & Greet" },
  { href: "#rsvp", label: "RSVP" },
  { href: "#travel", label: "Travel" },
];

type Countdown = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

const targetDate = new Date("2026-05-31T16:00:00");

export default function Home() {
  const [rsvpFirst, setRsvpFirst] = useState("");
  const [rsvpLast, setRsvpLast] = useState("");
  const [rsvpEmail, setRsvpEmail] = useState("");
  const [rsvpAttending, setRsvpAttending] = useState("");
  const [rsvpGuestNames, setRsvpGuestNames] = useState("");
  const [rsvpMeal, setRsvpMeal] = useState("");
  const [rsvpDietary, setRsvpDietary] = useState("");
  const [rsvpState, setRsvpState] = useState<
    | { status: "idle" }
    | { status: "submitting" }
    | { status: "success"; message: string }
    | { status: "error"; message: string }
  >({ status: "idle" });
  const [cd, setCd] = useState<Countdown>({
    days: "--",
    hours: "--",
    minutes: "--",
    seconds: "--",
  });

  const observeRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const tick = () => {
      const diff = +targetDate - +new Date();
      if (diff <= 0) {
        setCd({ days: "0", hours: "00", minutes: "00", seconds: "00" });
        return;
      }
      setCd({
        days: Math.floor(diff / 864e5).toString(),
        hours: String(Math.floor((diff % 864e5) / 36e5)).padStart(2, "0"),
        minutes: String(Math.floor((diff % 36e5) / 6e4)).padStart(2, "0"),
        seconds: String(Math.floor((diff % 6e4) / 1e3)).padStart(2, "0"),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("on");
          }
        });
      },
      { threshold: 0.1 },
    );
    observeRefs.current.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const rsvpFormRef = useRef<HTMLFormElement>(null);
  const rsvpOkRef = useRef<HTMLDivElement>(null);

  const handleRSVPSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRsvpState({ status: "submitting" });
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: rsvpFirst,
          lastName: rsvpLast,
          email: rsvpEmail,
          attending: rsvpAttending,
          guestNames: rsvpGuestNames,
          mealPreference: rsvpMeal,
          dietaryNote: rsvpDietary,
        }),
      });
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body?.error || "Something went wrong");
      }
      setRsvpFirst("");
      setRsvpLast("");
      setRsvpEmail("");
      setRsvpAttending("");
      setRsvpGuestNames("");
      setRsvpMeal("");
      setRsvpDietary("");
      setRsvpState({
        status: "success",
        message: body?.message || "Thank you — we can’t wait to celebrate with you.",
      });
      if (rsvpFormRef.current) rsvpFormRef.current.style.display = "none";
      if (rsvpOkRef.current) rsvpOkRef.current.style.display = "block";
    } catch (error) {
      setRsvpState({
        status: "error",
        message:
          error instanceof Error ? error.message : "We couldn't save your RSVP. Please try again.",
      });
    }
  };

  const registerFi = (el: HTMLElement | null) => {
    if (el && !observeRefs.current.includes(el)) {
      observeRefs.current.push(el);
    }
  };

  return (
    <>
      <nav>
        <a className="nav-mono" href="#home">
          Ashley &amp; Matt
        </a>
        <ul className="nav-links">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </nav>

      <section className="hero" id="home">
        <p className="hero-eyebrow">Together with their families</p>
        <div className="hero-names">
          <h1 className="hero-name">Ashley</h1>
          <span className="hero-and">and</span>
          <h1 className="hero-name hero-name-second">Matt</h1>
        </div>
        <div className="hero-line" />
        <div className="hero-meta">
          <p className="hero-date">Sunday, the thirty-first of May</p>
          <p className="hero-date" style={{ fontSize: "1.5rem", letterSpacing: "0.14em", marginTop: "4px" }}>
            2026
          </p>
          <p className="hero-venue">The Clifton · Charlottesville, Virginia</p>
        </div>
        <div className="hero-cta">
          <a href="#rsvp" className="btn btn-fill">
            Kindly Reply
          </a>
        </div>
        <div className="scroll-cue">
          <span>Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>

      <div className="countdown">
        <div className="cd-item">
          <span className="cd-num">{cd.days}</span>
          <span className="cd-lbl">Days</span>
        </div>
        <div className="cd-sep">·</div>
        <div className="cd-item">
          <span className="cd-num">{cd.hours}</span>
          <span className="cd-lbl">Hours</span>
        </div>
        <div className="cd-sep">·</div>
        <div className="cd-item">
          <span className="cd-num">{cd.minutes}</span>
          <span className="cd-lbl">Minutes</span>
        </div>
        <div className="cd-sep">·</div>
        <div className="cd-item">
          <span className="cd-num">{cd.seconds}</span>
          <span className="cd-lbl">Seconds</span>
        </div>
      </div>

      <div className="story-wrap" id="story">
        <div className="story-grid fi" ref={registerFi}>
          <div className="s-img">
            <Image
              src="/mattash_clifton.png"
              alt="Ashley and Matt at The Clifton"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 40vw"
              priority
            />
          </div>
          <div className="body-stack">
            <span className="lbl">Our Story</span>
            <h2 className="hd">
              How it all <em>began</em>
            </h2>
            <p className="body-txt">
              We were introduced by some very dear friends in 2020 — right in the middle of a world that felt upside down. Since then, we’ve taken some big risks, navigated new chapters, racked up countless frequent-flyer miles, and collected more than a few new zip codes. Our path hasn’t been traditional, but it’s been ours — full of growth, laughter, and choosing each other again and again.
            </p>
            <p className="body-txt">
              We’re so grateful for the people who’ve supported us along the way, and we can’t wait to celebrate the beginning of our forever with you.
            </p>
          </div>
        </div>
      </div>

      <div className="details-wrap" id="details">
        <div className="details-intro fi" ref={registerFi}>
          <span className="lbl">Wedding Details</span>
          <h2 className="hd">
            The <em>Celebration</em>
          </h2>
          <p className="body-txt">We can’t wait to share this day with the people we love most.</p>
        </div>
        <div className="details-grid fi" ref={registerFi}>
          <div className="d-card">
            <span className="d-tag">Date</span>
            <p className="d-title">
              Sunday
              <br />
              May 31, 2026
            </p>
            <p className="d-body">We hope you’ll join us for this special celebration.</p>
          </div>
          <div className="d-card">
            <span className="d-tag">Ceremony</span>
            <p className="d-title">
              5:00 pm
              <br />
              The Clifton
            </p>
            <p className="d-body">
              1296 Clifton Inn Drive
              <br />
              Charlottesville, VA 22911
            </p>
            <p className="d-body" style={{ fontStyle: "italic", color: "var(--foreground-light)" }}>
              Reception to follow
            </p>
            <a href="https://maps.google.com/?q=The+Clifton+Charlottesville+VA" target="_blank" className="d-link" rel="noreferrer">
              Get Directions
            </a>
          </div>
          <div className="d-card">
            <span className="d-tag">Dress Code</span>
            <p className="d-title">
              Cocktail
              <br />
              Attire
            </p>
            <p className="d-body">Semi-formal dress encouraged. Garden-friendly footwear recommended.</p>
          </div>
        </div>
      </div>

      <div className="mg-wrap" id="meetgreet">
        <div className="mg-inner fi" ref={registerFi}>
          <div>
            <span className="lbl">The Night Before</span>
            <h2 className="hd">
              Meet &amp; <em>Greet</em>
            </h2>
            <p className="body-txt">
              Join us at Zocalo for a warm, casual welcome to kick off the weekend! We’ll have a reserved area marked with a sign, and the bar will be open with food and beverages available for
              individual purchase. We'd love the chance to say hello and catch up before the big day. Zocalo is located on the Downtown Mall, just a short walk from the Omni.
            </p>
          </div>
          <div className="mg-details">
            <div className="mg-item">
              <span className="d-tag">When</span>
              <p className="mg-val">
                Saturday, May 30, 2026
                <br />
                7:00 – 9:00 pm
              </p>
            </div>
            <div className="mg-item">
              <span className="d-tag">Where</span>
              <p className="mg-val">
                Zocalo
                <br />
                201 E Main St, Unit E
                <br />
                Charlottesville, VA 22902
              </p>
              <a
                href="https://maps.google.com/?q=201+E+Main+St+Charlottesville+VA"
                target="_blank"
                className="d-link"
                rel="noreferrer"
                style={{ marginTop: "10px", display: "inline-block" }}
              >
                Get Directions
              </a>
            </div>
            <div className="mg-item">
              <span className="d-tag">Details</span>
              <p className="mg-val">
                No RSVP required.
                <br />
                Food &amp; drinks available for purchase.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rsvp-wrap" id="rsvp">
        <div className="fi" ref={registerFi}>
          <span className="lbl">RSVP</span>
          <h2 className="hd">
            Will you <em>join us?</em>
          </h2>
          <p className="body-txt" style={{ maxWidth: "420px", margin: "0 auto 40px" }}>
            Kindly reply by March 31, 2026.
          </p>
          <form className="rsvp-form" onSubmit={handleRSVPSubmit} ref={rsvpFormRef}>
            <div className="rsvp-row">
              <input
                type="text"
                className="rsvp-input"
                placeholder="First Name"
                required
                value={rsvpFirst}
                onChange={(e) => setRsvpFirst(e.target.value)}
              />
              <input
                type="text"
                className="rsvp-input"
                placeholder="Last Name"
                required
                value={rsvpLast}
                onChange={(e) => setRsvpLast(e.target.value)}
              />
            </div>
            <input
              type="email"
              className="rsvp-input"
              placeholder="Email Address"
              required
              value={rsvpEmail}
              onChange={(e) => setRsvpEmail(e.target.value)}
            />
            <select
              className="rsvp-input"
              required
              value={rsvpAttending}
              onChange={(e) => setRsvpAttending(e.target.value)}
            >
              <option value="" disabled>
                Attending?
              </option>
              <option value="accepts">Joyfully accepts</option>
              <option value="declines">Regretfully declines</option>
            </select>
            {rsvpAttending === "accepts" && (
              <textarea
                className="rsvp-input"
                placeholder="Names of all attending guests"
                rows={2}
                required
                value={rsvpGuestNames}
                onChange={(e) => setRsvpGuestNames(e.target.value)}
                style={{ resize: "vertical" }}
              />
            )}
            <select
              className="rsvp-input"
              required={rsvpAttending === "accepts"}
              value={rsvpMeal}
              onChange={(e) => setRsvpMeal(e.target.value)}
            >
              <option value="" disabled>
                Meal Preference
              </option>
              <option value="filet">Filet Mignon, Roasted Potatoes, Green Beans, with a Bordelaise Sauce</option>
              <option value="crabcake">Maryland Crab Cake with Rice Pilaf and a Summer Vegetable Medley</option>
              <option value="risotto">Risotto Primavera (V)</option>
              <option value="dietary-note">Dietary restriction — please note below</option>
            </select>
            {rsvpMeal === "dietary-note" && (
              <textarea
                className="rsvp-input"
                placeholder="Dietary needs or restrictions"
                rows={3}
                required
                value={rsvpDietary}
                onChange={(e) => setRsvpDietary(e.target.value)}
                style={{ resize: "vertical" }}
              />
            )}
            <div style={{ textAlign: "center", marginTop: "10px" }}>
              <button type="submit" className="btn btn-fill" disabled={rsvpState.status === "submitting"}>
                {rsvpState.status === "submitting" ? "Sending..." : "Send RSVP"}
              </button>
            </div>
          </form>
          <div
            id="rsvp-ok"
            ref={rsvpOkRef}
            style={{
              display: "none",
              marginTop: "36px",
              fontFamily: "var(--font-display), serif",
              fontStyle: "italic",
              fontSize: "1.35rem",
              color: "var(--sage)",
            }}
          >
            Thank you — we can’t wait to celebrate with you. 
          </div>
          {rsvpState.status === "error" && (
            <p className="body-txt" style={{ marginTop: "20px", color: "#b00020", fontSize: "0.95rem" }}>
              {rsvpState.message}
            </p>
          )}
        </div>
      </div>

      <div className="travel-wrap" id="travel">
        <div className="travel-inner fi" ref={registerFi}>
          <span className="lbl">Getting Here</span>
          <h2 className="hd">
            Travel &amp; <em>Stay</em>
          </h2>
          <p className="body-txt" style={{ maxWidth: "500px" }}>
            We hope you’ll make a weekend of it — Charlottesville is a beautiful place to explore. 
          </p>
          <div className="travel-grid">
            <div className="t-card">
              <p className="t-title">Charlottesville Omni</p>
              <p className="t-body">
                212 Ridge McIntire Rd
                <br />
                Charlottesville, VA 22903
                <br />
                <br />
                Our recommended stay - central to the downtown mall in the heart of Charlottesville.
              </p>
              <a
                href="https://www.omnihotels.com/hotels/charlottesville"
                target="_blank"
                className="t-badge"
                rel="noreferrer"
              >
                View Website
              </a>
            </div>
            <div className="t-card">
              <p className="t-title">Residence Inn by Marriott Charlottesville Downtown</p>
              <p className="t-body">
                315 W Main St
                <br />
                Charlottesville, VA 22903
                <br />
                <br />
                A charming nearby alternative with easy access to the venue and local dining.
              </p>
              <a
                href="https://www.marriott.com/en-us/hotels/chodt-residence-inn-charlottesville-downtown/overview/"
                target="_blank"
                className="t-badge"
                rel="noreferrer"
              >
                View Website
              </a>
            </div>
            <div className="t-card">
              <p className="t-title">Getting There</p>
              <p className="t-body">
                <strong>By Air</strong> — We recommend flying into Charlottesville Albemarle (CHO), the closest option to the venue, or Richmond (RIC), about 45 minutes away. Dulles (IAD) is also an option, approximately 1.5 hours away.
                <br />
                <br />
              </p>
            </div>
            <div className="t-card">
              <p className="t-title">Parking &amp; Rideshare</p>
              <p className="t-body">
                Complimentary parking is available on-site at The Clifton, but limited. We encourage carpooling and ridesharing when possible.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <div className="ft-names">Ashley &amp; Matt</div>
        <div className="ft-rule" />
        <p className="ft-sub">May 31, 2026 · Charlottesville, Virginia</p>
      </footer>
    </>
  );
}

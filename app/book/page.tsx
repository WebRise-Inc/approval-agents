import type { Metadata } from "next";
import { ArrowDown, ArrowUpRight, Clock3, Video } from "lucide-react";
import BookingCalendar from "./booking-calendar";
import VslPlayer from "./vsl-player";
import styles from "./book.module.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://approvalagents.ca"),
  title: "Book a Free Consultation | Approval Agents",
  description:
    "Meet Approval Agents in 27 seconds, then book a free 15-minute consultation to talk about your next car, your budget, and your financing options.",
  openGraph: {
    title: "Your next car starts with a conversation. | Approval Agents",
    description:
      "Watch the short video and book your free 15-minute consultation.",
    images: [{ url: "/video/approval-agents-poster.jpg", width: 1920, height: 1080 }],
    type: "website",
  },
};

export default function BookPage() {
  return (
    <div className={styles.page}>
      <a className="skip-link" href="#watch">Skip to video</a>

      <header className={styles.header}>
        <a className={styles.logo} href="/" aria-label="Approval Agents home">
          {/* The supplied SVG is the original Approval Agents wordmark. */}
          <img src="/approval-horizontal-logo.svg" width="216" height="65" alt="Approval Agents" />
        </a>
        <a className={styles.headerLink} href="#book-a-time">
          Book a free call <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </header>

      <main className={styles.main}>
        <section className={styles.hero} aria-labelledby="page-title" id="watch">
          <h1 id="page-title">
            Your next car starts<br />
            <span>with a conversation.</span>
          </h1>
          <p className={styles.intro}>
            A car that fits your life. A payment that fits your budget.{" "}<br className={styles.desktopBreak} />
            Get to know Approval Agents, then let’s talk about your options.
          </p>

          <VslPlayer />

          <div className={styles.videoCaption}>
            <span>Meet Approval Agents</span>
            <span>27 seconds. See how we can help.</span>
          </div>

          <div className={styles.heroAction}>
            <a className={styles.primaryButton} href="#book-a-time">
              Book my free consultation <ArrowDown size={19} aria-hidden="true" />
            </a>
            <p>15 minutes to talk about your next car.</p>
          </div>
        </section>

        <section className={styles.booking} id="book-a-time" aria-labelledby="booking-title">
          <div className={styles.bookingIntro}>
            <div>
              <h2 id="booking-title">Let’s find your next car.</h2>
              <p>Pick a time that works for you. Bring your questions.{" "}<br className={styles.desktopBreak} />
                We’ll talk through your budget, vehicle needs, and next steps.</p>
            </div>
            <div className={styles.callDetails} aria-label="Consultation details">
              <span><Clock3 size={17} aria-hidden="true" /> 15 minutes</span>
              <span><Video size={18} aria-hidden="true" /> Google Meet</span>
            </div>
          </div>

          <BookingCalendar />
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerTop}>
          <span>© {new Date().getFullYear()} Approval Agents</span>
          <nav aria-label="Footer navigation">
            <a href="tel:+16139093884">(613) 909-3884</a>
            <a href="/privacy">Privacy policy</a>
          </nav>
        </div>
        <p>Financing and vehicle availability are subject to lender review and applicable conditions.</p>
      </footer>
    </div>
  );
}

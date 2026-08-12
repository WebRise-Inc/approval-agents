import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, PhoneCall } from "lucide-react";
import styles from "./privacy.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy | Approval Agents",
  description:
    "Learn what personal information Approval Agents collects, how it is used and shared, and how to make a privacy request.",
};

const phoneNumberDisplay = "(613) 909-3884";
const phoneNumberHref = "tel:+16139093884";

const sections = [
  { href: "#scope", label: "Scope" },
  { href: "#information", label: "Information we collect" },
  { href: "#use", label: "How we use it" },
  { href: "#sharing", label: "When we share it" },
  { href: "#choices", label: "Your choices" },
  { href: "#retention", label: "Retention and security" },
  { href: "#rights", label: "Your privacy rights" },
  { href: "#contact", label: "Contact us" },
];

function ApprovalLogo() {
  return (
    <span className="approval-logo">
      <img alt="Approval Agents" src="/approval-horizontal-logo.svg" />
    </span>
  );
}

export default function PrivacyPolicy() {
  return (
    <main className={styles.page}>
      <a className="skip-link" href="#privacy-content">
        Skip to privacy policy
      </a>

      <header className={`site-header ${styles.header}`}>
        <a href="/" aria-label="Approval Agents home">
          <ApprovalLogo />
        </a>
        <nav aria-label="Privacy page navigation">
          <a href="/">Home</a>
          <a href="/#faq">Questions</a>
          <a aria-current="page" href="/privacy">
            Privacy
          </a>
        </nav>
        <a className="header-action" href={phoneNumberHref}>
          <PhoneCall size={17} />
          Call us
        </a>
      </header>

      <section className={styles.hero}>
        <a className={styles.backLink} href="/">
          <ArrowLeft size={16} />
          Back to car search
        </a>
        <div className={styles.heroGrid}>
          <div>
            <h1>Privacy, in plain language.</h1>
            <p>
              This policy explains what personal information Approval Agents
              collects, why we need it, who may receive it, and the choices you
              have.
            </p>
          </div>
          <dl className={styles.policyDates}>
            <div>
              <dt>Effective</dt>
              <dd>
                <time dateTime="2026-08-12">August 12, 2026</time>
              </dd>
            </div>
            <div>
              <dt>Last updated</dt>
              <dd>
                <time dateTime="2026-08-12">August 12, 2026</time>
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <div className={styles.layout}>
        <aside className={styles.sectionNav} aria-label="Privacy policy sections">
          <strong>On this page</strong>
          <nav>
            {sections.map((section) => (
              <a href={section.href} key={section.href}>
                {section.label}
              </a>
            ))}
          </nav>
        </aside>

        <article className={styles.content} id="privacy-content">
          <section className={styles.summary} aria-labelledby="summary-title">
            <h2 id="summary-title">The short version</h2>
            <ul>
              <li>
                We collect the details you provide to understand your car search
                and respond with possible vehicle and financing next steps.
              </li>
              <li>
                We may use service providers and, where needed, share relevant
                details with participating vehicle or financing providers.
              </li>
              <li>
                You can ask about, access, or correct your personal information by
                calling our privacy contact.
              </li>
            </ul>
          </section>

          <section id="scope">
            <h2>1. Scope and our role</h2>
            <p>
              This policy applies when you use approvalagents.ca, submit a car
              search request, call us, or otherwise communicate with Approval
              Agents. In this policy, “we,” “us,” and “our” mean Approval Agents.
            </p>
            <p>
              Approval Agents helps people explore vehicle and auto-financing
              options. Where appropriate, we may help connect a shopper with a
              dealership, lender, broker, or other provider. Approval Agents is
              not the lender and does not make the final credit decision.
            </p>
          </section>

          <section id="information">
            <h2>2. Information we collect</h2>
            <p>We collect information in the following ways.</p>
            <div className={styles.dataList}>
              <div>
                <h3>Contact information</h3>
                <p>Your name, phone number, and email address.</p>
              </div>
              <div>
                <h3>Vehicle preferences</h3>
                <p>
                  The type of vehicle you want, whether you prefer new or used,
                  your purchase timeline, and whether you have a trade-in.
                </p>
              </div>
              <div>
                <h3>Budget and application context</h3>
                <p>
                  Your preferred monthly payment, planned down payment,
                  approximate monthly income, employment situation, and your own
                  description of your credit situation.
                </p>
              </div>
              <div>
                <h3>Request and source details</h3>
                <p>
                  The page where you submitted the request, campaign or referral
                  information in that page address, submission time, and a unique
                  request identifier used to prevent duplicates.
                </p>
              </div>
              <div>
                <h3>Follow-up information</h3>
                <p>
                  Details you choose to provide during calls, emails, or later
                  steps if you decide to continue with a vehicle or financing
                  option.
                </p>
              </div>
              <div>
                <h3>Technical records</h3>
                <p>
                  Our hosting and security providers may process standard request
                  records such as an IP address, browser or device information,
                  and access times to operate and protect the site.
                </p>
              </div>
            </div>
            <div className={styles.note}>
              <h3>What the website does not ask for</h3>
              <p>
                Do not send a social insurance number, online banking password,
                payment-card number, or government identification through this
                website. Submitting the website form does not itself authorize a
                credit-bureau check. If one is needed later, separate authorization
                may be requested.
              </p>
            </div>
          </section>

          <section id="use">
            <h2>3. How we use personal information</h2>
            <p>We may use your information to:</p>
            <ul>
              <li>respond to your request and contact you about next steps;</li>
              <li>
                understand the vehicle, timing, budget, and financing options that
                may fit your circumstances;
              </li>
              <li>confirm information and coordinate your request;</li>
              <li>
                route the request, avoid duplicate submissions, and maintain
                accurate business records;
              </li>
              <li>operate, secure, troubleshoot, and improve our services; and</li>
              <li>meet legal, regulatory, and fraud-prevention obligations.</li>
            </ul>
            <p>
              If we want to use your personal information for a materially new
              purpose, we will explain that purpose and obtain consent where
              required.
            </p>
          </section>

          <section id="sharing">
            <h2>4. When we share personal information</h2>
            <p>We may disclose relevant personal information to:</p>
            <ul>
              <li>
                Approval Agents personnel and representatives who need it to
                respond to your request;
              </li>
              <li>
                participating dealerships, lenders, brokers, or other vehicle and
                financing providers when needed to evaluate or provide options;
              </li>
              <li>
                service providers that host, route, store, secure, or help us
                communicate about your request; and
              </li>
              <li>
                regulators, law-enforcement bodies, courts, or transaction parties
                where disclosure is permitted or required by law, including in a
                business reorganization or sale.
              </li>
            </ul>
            <p>
              Service providers are expected to handle personal information only
              for the services they provide to us. We do not use or disclose your
              information for an unrelated purpose without additional consent,
              unless the law permits or requires it.
            </p>
          </section>

          <section id="choices">
            <h2>5. Consent and your choices</h2>
            <p>
              When you submit the website form and select the contact option, you
              consent to Approval Agents using the information to respond to your
              request and contacting you using the phone number or email address
              you provided. This may include coordinating with participating
              vehicle and financing providers as described above.
            </p>
            <p>
              You can withdraw consent for future contact or another optional use
              by calling us. Withdrawal does not undo handling that already took
              place with valid consent, and we may retain or use certain records
              where the law allows or requires it. Withdrawing consent may also
              limit our ability to continue helping with your request.
            </p>
            <p>
              You may choose not to provide information, but we may not be able to
              assess or respond to the request without the details needed for that
              purpose.
            </p>
          </section>

          <section id="retention">
            <h2>6. Retention, safeguards, and processing location</h2>
            <h3>Retention</h3>
            <p>
              Retention periods depend on why the information was collected and
              any legal or regulatory requirements. We retain it only as long as
              reasonably needed for the purposes described in this policy,
              including follow-up, recordkeeping, dispute resolution, and fraud
              prevention, then take reasonable steps to dispose of it securely.
            </p>
            <h3>Safeguards</h3>
            <p>
              We take reasonable administrative, technical, and organizational
              measures to protect personal information, taking its sensitivity
              into account. No method of electronic transmission or storage is
              completely secure, so we cannot guarantee absolute security.
            </p>
            <h3>Processing outside your province</h3>
            <p>
              Some service providers may process or store information outside your
              province or outside Canada. When that happens, the information may
              be subject to the laws of the place where it is processed.
            </p>
            <h3>Cookies and analytics</h3>
            <p>
              This website does not currently use advertising cookies or
              third-party analytics code. Essential hosting and security
              infrastructure may still process standard technical request records
              as described above. We will update this policy if our website
              practices materially change.
            </p>
          </section>

          <section id="rights">
            <h2>7. Your privacy rights</h2>
            <p>Subject to applicable law, you may ask us to:</p>
            <ul>
              <li>confirm whether we hold personal information about you;</li>
              <li>explain how it has been used and disclosed;</li>
              <li>give you access to it;</li>
              <li>correct information that is inaccurate or incomplete; or</li>
              <li>review a concern about how we handled it.</li>
            </ul>
            <p>
              We may need to verify your identity before completing a request.
              Legal exceptions may limit access in some cases; if so, we will
              explain the reason where permitted.
            </p>
            <p>
              If you are not satisfied after raising a concern with us, you can
              learn about available options from the{" "}
              <a
                className={styles.inlineLink}
                href="https://www.priv.gc.ca/en/report-a-concern/"
                rel="noreferrer"
                target="_blank"
              >
                Office of the Privacy Commissioner of Canada
                <ArrowUpRight aria-hidden="true" size={15} />
              </a>
              .
            </p>
          </section>

          <section id="contact">
            <h2>8. Contact us about privacy</h2>
            <p>
              For an access or correction request, to withdraw consent, or to ask
              a question or make a complaint about this policy, call Approval
              Agents and ask for the person responsible for privacy inquiries.
            </p>
            <a className={styles.contactLink} href={phoneNumberHref}>
              <span>Privacy inquiries, Approval Agents</span>
              <strong>{phoneNumberDisplay}</strong>
              <PhoneCall aria-hidden="true" size={20} />
            </a>
          </section>

          <section id="updates">
            <h2>9. Changes to this policy</h2>
            <p>
              We may update this policy as our services or privacy practices
              change. The “Last updated” date shows when this version was revised.
              If a change requires new consent, we will request it before applying
              the new use or disclosure.
            </p>
          </section>
        </article>
      </div>

      <footer className={styles.footer}>
        <ApprovalLogo />
        <p>
          Submitting a request does not guarantee financing or reserve a vehicle.
          Approval, rates, terms, payments, and vehicle availability depend on
          lender review and other applicable conditions.
        </p>
        <nav aria-label="Footer navigation">
          <a href="/">Home</a>
          <a href="/#apply">Get started</a>
          <a href={phoneNumberHref}>Call {phoneNumberDisplay}</a>
          <a aria-current="page" href="/privacy">
            Privacy
          </a>
        </nav>
      </footer>
    </main>
  );
}

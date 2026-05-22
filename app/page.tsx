"use client";

import {
  ArrowLeft,
  ArrowRight,
  BadgeDollarSign,
  Banknote,
  Car,
  Check,
  CheckCircle2,
  CircleAlert,
  CreditCard,
  FileCheck2,
  FileText,
  Gauge,
  Handshake,
  MapPinned,
  MessageSquareText,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  WalletCards,
} from "lucide-react";
import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";

type ApplicationState = {
  fullName: string;
  phone: string;
  email: string;
  income: string;
  employment: string;
  creditSituation: string;
  downPayment: string;
  budget: string;
  consent: boolean;
};

type ApplicationField = keyof ApplicationState;
type ChoiceField = "employment" | "creditSituation" | "downPayment" | "budget";

type Choice = {
  label: string;
  value: string;
};

type InputQuestion = {
  id: Exclude<ApplicationField, ChoiceField | "consent">;
  kind: "input";
  question: string;
  placeholder: string;
  type: string;
  autoComplete?: string;
  inputMode?: "decimal" | "email" | "numeric" | "search" | "tel" | "text" | "url";
};

type ChoiceQuestion = {
  id: ChoiceField;
  kind: "choice";
  question: string;
  options: Choice[];
};

type ConsentQuestion = {
  id: "consent";
  kind: "consent";
  question: string;
};

type FormQuestion = InputQuestion | ChoiceQuestion | ConsentQuestion;

const defaultApplication: ApplicationState = {
  fullName: "",
  phone: "",
  email: "",
  income: "",
  employment: "",
  creditSituation: "",
  downPayment: "",
  budget: "",
  consent: false,
};

const phoneNumberDisplay = "(613) 909-3884";
const phoneNumberHref = "tel:+16139093884";

const creditSituations = [
  {
    title: "Bad credit",
    text: "Missed payments, collections, or a score that has made other places say no.",
  },
  {
    title: "No credit yet",
    text: "First car, new to credit, student, newcomer, or not much history yet.",
  },
  {
    title: "Consumer proposal",
    text: "You are rebuilding and need someone to look at where you are now.",
  },
  {
    title: "Past bankruptcy",
    text: "A fresh start can still include a reliable vehicle.",
  },
  {
    title: "Self-employed income",
    text: "Your income may not fit a standard pay-stub-only application.",
  },
  {
    title: "Previous repossession",
    text: "A tougher situation, but still worth checking before assuming no.",
  },
];

const approvalSignals = [
  {
    icon: Banknote,
    title: "What you earn",
    text: "A rough monthly income number helps us understand what payment may fit.",
  },
  {
    icon: WalletCards,
    title: "What you can put down",
    text: "$0 is okay to choose. A down payment can help, but it is not always required.",
  },
  {
    icon: Gauge,
    title: "What feels affordable",
    text: "Start with the monthly payment you can live with.",
  },
  {
    icon: CreditCard,
    title: "What happened with credit",
    text: "Tell us the situation. No lectures, no awkward explanation.",
  },
];

const process = [
  {
    icon: FileText,
    title: "Answer a few questions",
    text: "Name, phone, income, credit situation, down payment, and budget.",
  },
  {
    icon: UserRoundCheck,
    title: "We look it over",
    text: "A real person checks what may work before calling you.",
  },
  {
    icon: MapPinned,
    title: "You get next steps",
    text: "We explain what is realistic and what may help your approval.",
  },
  {
    icon: Car,
    title: "Pick a vehicle",
    text: "Once the numbers make sense, you can talk about the car.",
  },
];

const vehiclePaths = [
  {
    icon: BadgeDollarSign,
    title: "Keep payment low",
    text: "For people who need the car and want the monthly payment controlled.",
  },
  {
    icon: ShieldCheck,
    title: "Rebuild while driving",
    text: "For people trying to move forward and build better payment history.",
  },
  {
    icon: Handshake,
    title: "Make the approval stronger",
    text: "Sometimes a down payment, co-signer, or different vehicle makes the difference.",
  },
];

const documents = [
  "Driver's licence",
  "Recent pay stub or income proof",
  "Proof of address",
  "Down payment amount, if any",
  "Trade-in details, if applicable",
  "A quick note about your credit situation",
];

const deliveryProofs = [
  {
    image: "/deliveries/approved-delivered-21.jpg",
    vehicle: "Mazda CX-5",
  },
  {
    image: "/deliveries/approved-delivered-22.jpg",
    vehicle: "Volkswagen Taos",
  },
  {
    image: "/deliveries/approved-delivered-23.jpg",
    vehicle: "Toyota RAV-4",
  },
  {
    image: "/deliveries/approved-delivered-24.jpg",
    vehicle: "Mazda 3",
  },
  {
    image: "/deliveries/approved-delivered-25.jpg",
    vehicle: "Hyundai Tucson Hybrid",
  },
  {
    image: "/deliveries/approved-delivered-26.jpg",
    vehicle: "Nissan Leaf",
  },
  {
    image: "/deliveries/approved-delivered-28.jpg",
    vehicle: "Subaru Crosstrek",
  },
  {
    image: "/deliveries/approved-delivered-29.jpg",
    vehicle: "Jeep Compass Trailhawk",
  },
];

const faqs = [
  {
    question: "Is this only for bad credit?",
    answer:
      "No. You can apply with bad credit, no credit, new credit, past bankruptcy, a proposal, or self-employed income.",
  },
  {
    question: "Am I approved after submitting?",
    answer:
      "No. The form starts the process. Final approval, payment, rate, and vehicle options depend on lender review and income verification.",
  },
  {
    question: "Do I need money down?",
    answer:
      "Not always. Some people can start with $0 down. Others have better options with a deposit.",
  },
  {
    question: "What happens after I apply?",
    answer:
      "Someone follows up, confirms the basics, and tells you what options may be realistic.",
  },
];

const formQuestions: FormQuestion[] = [
  {
    id: "fullName",
    kind: "input",
    question: "What's your name?",
    placeholder: "Alex Martin",
    type: "text",
    autoComplete: "name",
  },
  {
    id: "phone",
    kind: "input",
    question: "Phone number?",
    placeholder: "(613) 555-0194",
    type: "tel",
    autoComplete: "tel",
    inputMode: "tel",
  },
  {
    id: "email",
    kind: "input",
    question: "Email?",
    placeholder: "alex@email.com",
    type: "email",
    autoComplete: "email",
    inputMode: "email",
  },
  {
    id: "income",
    kind: "input",
    question: "Monthly income?",
    placeholder: "$3,500",
    type: "text",
    inputMode: "decimal",
  },
  {
    id: "employment",
    kind: "choice",
    question: "Employment?",
    options: [
      { label: "Full-time", value: "Full-time" },
      { label: "Part-time", value: "Part-time" },
      { label: "Self-employed", value: "Self-employed" },
      { label: "Other", value: "Other income source" },
    ],
  },
  {
    id: "creditSituation",
    kind: "choice",
    question: "Credit situation?",
    options: [
      { label: "Rebuilding", value: "Rebuilding credit" },
      { label: "No credit", value: "No credit history" },
      { label: "Proposal", value: "Consumer proposal" },
      { label: "Bankruptcy", value: "Past bankruptcy" },
    ],
  },
  {
    id: "downPayment",
    kind: "choice",
    question: "Down payment?",
    options: [
      { label: "$0", value: "$0" },
      { label: "$500-$1k", value: "$500 - $1,000" },
      { label: "$1k-$2.5k", value: "$1,000 - $2,500" },
      { label: "$2.5k+", value: "$2,500+" },
    ],
  },
  {
    id: "budget",
    kind: "choice",
    question: "Monthly payment?",
    options: [
      { label: "Lowest", value: "Lowest payment possible" },
      { label: "$300-$450", value: "$300 - $450 / month" },
      { label: "$450-$650", value: "$450 - $650 / month" },
      { label: "$650+", value: "$650+ / month" },
    ],
  },
  {
    id: "consent",
    kind: "consent",
    question: "Can we contact you?",
  },
];

function getFirstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] || "there";
}

function getQuestionCopy(question: FormQuestion, firstName: string) {
  switch (question.id) {
    case "phone":
      return `Best number to reach you, ${firstName}?`;
    case "email":
      return "Where should we send matches?";
    case "income":
      return "Monthly income before tax?";
    case "employment":
      return "What are you up to for work?";
    case "creditSituation":
      return "What are we working with?";
    case "downPayment":
      return "Putting anything down?";
    case "budget":
      return "What payment feels comfortable?";
    case "consent":
      return "Can we contact you about your options?";
    default:
      return question.question;
  }
}

function getBanter(question: FormQuestion, firstName: string) {
  switch (question.id) {
    case "fullName":
      return "Quick intro first.";
    case "phone":
      return `Good to meet you, ${firstName}.`;
    case "email":
      return "We will keep the next step clear.";
    case "income":
      return "A ballpark number is fine.";
    case "employment":
      return "This helps us understand your situation.";
    case "creditSituation":
      return "No judgment here.";
    case "downPayment":
      return "Zero is a real answer.";
    case "budget":
      return "Comfort beats stretch.";
    case "consent":
      return "Last one.";
  }
}

function getFieldError(field: ApplicationField) {
  switch (field) {
    case "phone":
      return "Enter a phone number so we can follow up.";
    case "email":
      return "Enter a valid email address.";
    case "consent":
      return "Consent is required before an agent can contact you.";
    default:
      return "Need this one to keep rolling.";
  }
}

function ApprovalLogo({ decorative = false }: { decorative?: boolean }) {
  return (
    <span className="approval-logo">
      <img alt={decorative ? "" : "Approval Agents"} src="/approval-horizontal-logo.svg" />
    </span>
  );
}

function ApprovalMap() {
  return (
    <div className="approval-map">
      <img
        alt="Approval Agents showing multiple car financing options from one application"
        src="/agent-approvals-routing.png"
      />
      <div className="map-copy">
        <span>More options</span>
        <strong>One application can open more than one door.</strong>
      </div>
    </div>
  );
}

function ApplyForm() {
  const [application, setApplication] = useState<ApplicationState>(defaultApplication);
  const [errors, setErrors] = useState<ApplicationField[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(0);
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = formQuestions[step];
  const firstName = getFirstName(application.fullName);
  const questionCopy = getQuestionCopy(currentQuestion, firstName);
  const banter = getBanter(currentQuestion, firstName);
  const progress = ((step + 1) / formQuestions.length) * 100;

  useEffect(() => {
    if (window.location.search) {
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.hash}`);
    }
  }, []);

  function updateField(name: ApplicationField, value: string | boolean) {
    setApplication((current) => ({ ...current, [name]: value }));
    setErrors((current) => current.filter((field) => field !== name));
    setSubmitError("");
  }

  function isMissing(field: ApplicationField = currentQuestion.id) {
    const value = application[field];
    return typeof value === "boolean" ? !value : value.trim().length === 0;
  }

  function validateQuestion() {
    if (isMissing()) {
      setErrors([currentQuestion.id]);
      return false;
    }

    if (
      currentQuestion.id === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(application.email.trim())
    ) {
      setErrors(["email"]);
      return false;
    }

    if (
      currentQuestion.id === "phone" &&
      application.phone.replace(/\D/g, "").length < 10
    ) {
      setErrors(["phone"]);
      return false;
    }

    return true;
  }

  async function submitApplication(nextApplication = application) {
    const missingField = formQuestions.find((question) => {
      const value = nextApplication[question.id];
      return typeof value === "boolean" ? !value : value.trim().length === 0;
    });

    if (missingField) {
      setStep(formQuestions.findIndex((question) => question.id === missingField.id));
      setErrors([missingField.id]);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(nextApplication.email.trim())) {
      setStep(formQuestions.findIndex((question) => question.id === "email"));
      setErrors(["email"]);
      return;
    }

    if (nextApplication.phone.replace(/\D/g, "").length < 10) {
      setStep(formQuestions.findIndex((question) => question.id === "phone"));
      setErrors(["phone"]);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const idempotencyKey =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? `agent-approvals-${crypto.randomUUID()}`
          : `agent-approvals-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const response = await fetch("/api/applications", {
        body: JSON.stringify({
          ...nextApplication,
          idempotencyKey,
          pageUrl: window.location.href,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Application submission failed");
      }

      setSubmitted(true);
    } catch {
      setSubmitError(
        "We could not send the application. Please try again or call the number below."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function goToNextStep() {
    if (isSubmitting) {
      return;
    }

    if (!validateQuestion()) {
      return;
    }

    if (step === formQuestions.length - 1) {
      void submitApplication();
      return;
    }

    setStep((current) => current + 1);
    setErrors([]);
  }

  function goToPreviousStep() {
    if (isSubmitting) {
      return;
    }

    setStep((current) => Math.max(current - 1, 0));
    setErrors([]);
  }

  function chooseOption(name: ChoiceField, value: string) {
    if (isSubmitting) {
      return;
    }

    updateField(name, value);

    window.setTimeout(() => {
      setStep((current) => Math.min(current + 1, formQuestions.length - 1));
    }, 140);
  }

  function acceptContact() {
    if (isSubmitting) {
      return;
    }

    const nextApplication = { ...application, consent: true };

    setApplication(nextApplication);
    setErrors((current) => current.filter((field) => field !== "consent"));
    setSubmitError("");
    void submitApplication(nextApplication);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    goToNextStep();
  }

  if (submitted) {
    return (
      <div className="application-card success-card" id="apply" aria-live="polite">
        <div className="success-icon">
          <CheckCircle2 size={38} />
        </div>
        <span>Application received</span>
        <h2>{firstName}, we have your details.</h2>
        <p>
          The next step is a quick follow-up to confirm details and talk through
          what vehicle options may fit.
        </p>
        <dl className="summary-list">
          <div>
            <dt>Credit</dt>
            <dd>{application.creditSituation}</dd>
          </div>
          <div>
            <dt>Income</dt>
            <dd>{application.income}</dd>
          </div>
          <div>
            <dt>Budget</dt>
            <dd>{application.budget}</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={() => {
            setApplication(defaultApplication);
            setStep(0);
            setSubmitError("");
            setSubmitted(false);
          }}
        >
          Start another application
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <section
      aria-labelledby="active-question-title"
      className="application-card typeform-card"
      id="apply"
      role="form"
    >
      <div className="typeform-top" aria-label="Application progress">
        <span>
          Step {step + 1} of {formQuestions.length}
        </span>
        <div className="progress-track">
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="typeform-body" key={currentQuestion.id}>
        <p className="form-banter">{banter}</p>
        <h2 id="active-question-title">{questionCopy}</h2>

        {currentQuestion.kind === "input" ? (
          <div className="typeform-input-wrap">
            <label className="sr-only" htmlFor={currentQuestion.id}>
              {questionCopy}
            </label>
            <input
              aria-invalid={errors.includes(currentQuestion.id)}
              autoComplete={currentQuestion.autoComplete}
              className={errors.includes(currentQuestion.id) ? "typeform-input has-error" : "typeform-input"}
              disabled={isSubmitting}
              id={currentQuestion.id}
              inputMode={currentQuestion.inputMode}
              onKeyDown={handleInputKeyDown}
              onChange={(event) => updateField(currentQuestion.id, event.target.value)}
              placeholder={currentQuestion.placeholder}
              type={currentQuestion.type}
              value={application[currentQuestion.id] as string}
            />
          </div>
        ) : null}

        {currentQuestion.kind === "choice" ? (
          <fieldset className="typeform-options">
            <legend className="sr-only">{currentQuestion.question}</legend>
            {currentQuestion.options.map((option) => {
              const selected = application[currentQuestion.id] === option.value;
              return (
                <label className={selected ? "typeform-option selected" : "typeform-option"} key={option.value}>
                  <input
                    checked={selected}
                    disabled={isSubmitting}
                    name={currentQuestion.id}
                    onChange={() => chooseOption(currentQuestion.id, option.value)}
                    type="radio"
                    value={option.value}
                  />
                  <span>{option.label}</span>
                  <Check size={18} />
                </label>
              );
            })}
          </fieldset>
        ) : null}

        {currentQuestion.kind === "consent" ? (
          <button
            className="typeform-option consent-option"
            disabled={isSubmitting}
            onClick={acceptContact}
            type="button"
          >
            <span>
              {isSubmitting
                ? "Sending application..."
                : "Yes, contact me about financing options"}
            </span>
            <ArrowRight size={18} />
          </button>
        ) : null}

        {errors.includes(currentQuestion.id) ? (
          <p className="field-error">
            <CircleAlert size={15} />
            {getFieldError(currentQuestion.id)}
          </p>
        ) : null}

        {submitError ? (
          <p className="field-error submit-error" role="alert">
            <CircleAlert size={15} />
            {submitError}
          </p>
        ) : null}
      </div>

      <div className="typeform-controls">
        {step > 0 ? (
          <button
            className="back-button"
            disabled={isSubmitting}
            onClick={goToPreviousStep}
            type="button"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        ) : (
          <span />
        )}
        {currentQuestion.kind === "input" ? (
          <button
            className="primary-button"
            disabled={isSubmitting}
            onClick={goToNextStep}
            type="button"
          >
            {step === 0 ? "Start" : "Next"}
            <ArrowRight size={18} />
          </button>
        ) : null}
      </div>
    </section>
  );
}

function DeliveryCarousel() {
  const viewportRef = useRef<HTMLDivElement>(null);

  function scrollDeliveries(direction: -1 | 1) {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    viewport.scrollBy({
      behavior: "smooth",
      left: direction * viewport.clientWidth * 0.82,
    });
  }

  return (
    <section className="delivery-section" id="deliveries">
      <div className="delivery-heading">
        <h2>Recent deliveries</h2>
        <div className="delivery-controls" aria-label="Delivery gallery controls">
          <button aria-label="Previous deliveries" onClick={() => scrollDeliveries(-1)} type="button">
            <ArrowLeft size={20} />
          </button>
          <button aria-label="Next deliveries" onClick={() => scrollDeliveries(1)} type="button">
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
      <div className="delivery-viewport" ref={viewportRef}>
        {deliveryProofs.map((proof, index) => (
          <img
            alt={`${proof.vehicle} approved and delivered`}
            key={proof.vehicle}
            loading={index < 3 ? "eager" : "lazy"}
            src={proof.image}
          />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <a className="skip-link" href="#apply">
        Skip to application
      </a>

      <header className="site-header">
        <a href="#top" aria-label="Agent Approvals home">
          <ApprovalLogo decorative />
        </a>
        <nav aria-label="Primary navigation">
          <a href="#deliveries">Deliveries</a>
          <a href="#situations">Credit</a>
          <a href="#process">Process</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="header-action" href="#apply">
          <FileText size={17} />
          Apply
        </a>
      </header>

      <section className="hero-section" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Car loans for rebuilding credit</p>
          <h1>Bad credit should not stop you from getting a car.</h1>
          <p className="hero-text">
            Answer a few quick questions and see what may be possible.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#apply">
              Check my options
              <ArrowRight size={18} />
            </a>
          </div>
          <div className="hero-note">
            <ShieldCheck size={17} />
            <span>No judgment. No commitment.</span>
          </div>
        </div>

        <ApplyForm />
      </section>

      <DeliveryCarousel />

      <section className="problem-section">
        <div className="section-kicker">
          <span>Simple start</span>
          <h2>You do not need to explain everything over and over.</h2>
        </div>
        <div className="proof-grid">
          <article>
            <MessageSquareText size={24} />
            <h3>Short questions</h3>
            <p>
              The form asks for the basics only: who you are, what you earn,
              and what kind of payment feels realistic.
            </p>
          </article>
          <article>
            <FileCheck2 size={24} />
            <h3>Real person after</h3>
            <p>
              After you apply, someone can follow up and talk through next
              steps in plain English.
            </p>
          </article>
          <article>
            <Sparkles size={24} />
            <h3>No pressure start</h3>
            <p>
              You are checking options first. You are not committing to a
              vehicle by filling out the form.
            </p>
          </article>
        </div>
      </section>

      <section className="routing-section" aria-label="Agent Approvals routing network">
        <div className="routing-copy">
          <p className="eyebrow">Better options</p>
          <h2>Different situations need different lenders.</h2>
          <p>
            If one place said no, that does not always mean every place will.
            The goal is to find a vehicle and payment that make sense for where
            you are now.
          </p>
          <ul className="route-list">
            <li>
              <CheckCircle2 size={18} />
              Tell us what happened with credit.
            </li>
            <li>
              <CheckCircle2 size={18} />
              Share your budget and down payment.
            </li>
            <li>
              <CheckCircle2 size={18} />
              Get a realistic next step before picking a car.
            </li>
          </ul>
        </div>
        <ApprovalMap />
      </section>

      <section className="credit-section" id="situations">
        <div className="section-kicker">
          <span>Credit situations</span>
          <h2>If this sounds like you, apply anyway.</h2>
        </div>
        <div className="situation-grid">
          {creditSituations.map((situation) => (
            <article className="situation-card" key={situation.title}>
              <CheckCircle2 size={20} />
              <h3>{situation.title}</h3>
              <p>{situation.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="fit-section">
        <div className="section-kicker">
          <span>What matters</span>
          <h2>A few details can change what is possible.</h2>
        </div>
        <div className="signal-grid">
          {approvalSignals.map((item) => {
            const Icon = item.icon;
            return (
              <article className="signal-card" key={item.title}>
                <Icon size={26} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="vehicle-section">
        <div className="section-kicker">
          <span>Vehicle fit</span>
          <h2>Start with the payment, then choose the car.</h2>
          <p>
            The best car is the one you can actually get approved for and afford
            every month.
          </p>
        </div>
        <div className="vehicle-paths">
          {vehiclePaths.map((path) => {
            const Icon = path.icon;
            return (
              <article className="vehicle-card" key={path.title}>
                <Icon size={28} />
                <h3>{path.title}</h3>
                <p>{path.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="process-section" id="process">
        <div className="section-kicker">
          <span>How it works</span>
          <h2>Four steps to see what may work.</h2>
        </div>
        <div className="process-grid">
          {process.map((item, index) => {
            const Icon = item.icon;
            return (
              <article className="process-card" key={item.title}>
                <div className="step-number">0{index + 1}</div>
                <Icon size={28} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="documents-section">
        <div className="documents-copy">
          <p className="eyebrow">Before the call</p>
          <h2>Have these ready if we call you.</h2>
          <p>
            You do not need perfect credit. These details just make the follow-up
            faster.
          </p>
        </div>
        <div className="document-list">
          {documents.map((item) => (
            <div key={item}>
              <Check size={18} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="faq-section" id="faq">
        <div className="section-kicker">
          <span>Questions</span>
          <h2>Clear answers before you apply.</h2>
        </div>
        <div className="faq-grid">
          {faqs.map((faq) => (
            <article key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="closing-section">
        <div>
          <Sparkles size={24} />
          <h2>Ready to check your options?</h2>
          <p>
            Start with the short form. We can follow up and let you know what
            may be realistic before you commit to anything.
          </p>
        </div>
        <div className="closing-actions">
          <a className="primary-button" href="#apply">
            Start application
            <ArrowRight size={18} />
          </a>
          <a className="secondary-button" href={phoneNumberHref}>
            <PhoneCall size={17} />
            Call {phoneNumberDisplay}
          </a>
        </div>
      </section>

      <footer>
        <ApprovalLogo />
        <p>
          Final terms, rates, approvals, and vehicle availability depend on
          lender review, income verification, vehicle selection, and required
          consent.
        </p>
        <nav aria-label="Footer navigation">
          <a href="#apply">Apply</a>
          <a href={phoneNumberHref}>Call {phoneNumberDisplay}</a>
          <a href="#situations">Credit situations</a>
          <a href="#faq">Questions</a>
        </nav>
      </footer>
    </main>
  );
}

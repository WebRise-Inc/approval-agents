"use client";

import {
  ArrowLeft,
  ArrowRight,
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
  Search,
  ShieldCheck,
  UserRoundCheck,
  WalletCards,
} from "lucide-react";
import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";

type ApplicationState = {
  vehicleType: string;
  vehicleCondition: string;
  purchaseTimeline: string;
  fullName: string;
  phone: string;
  email: string;
  tradeInStatus: string;
  income: string;
  employment: string;
  creditSituation: string;
  downPayment: string;
  budget: string;
  consent: boolean;
};

type ApplicationField = keyof ApplicationState;
type ChoiceField =
  | "vehicleType"
  | "vehicleCondition"
  | "purchaseTimeline"
  | "tradeInStatus"
  | "employment"
  | "creditSituation"
  | "downPayment"
  | "budget";

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
  vehicleType: "",
  vehicleCondition: "",
  purchaseTimeline: "",
  fullName: "",
  phone: "",
  email: "",
  tradeInStatus: "",
  income: "",
  employment: "",
  creditSituation: "",
  downPayment: "",
  budget: "",
  consent: false,
};

const phoneNumberDisplay = "(613) 909-3884";
const phoneNumberHref = "tel:+16139093884";

const buyerSituations = [
  {
    title: "Buying your first car",
    text: "Get help understanding your budget, the details you may need, and what happens next.",
  },
  {
    title: "Replacing your vehicle",
    text: "Explore a practical next car without starting the process on your own.",
  },
  {
    title: "Trading in",
    text: "Bring your current vehicle details and talk through how a trade-in may factor in.",
  },
  {
    title: "Keeping payments comfortable",
    text: "Start with a monthly payment that works for your day-to-day life.",
  },
  {
    title: "Rebuilding credit",
    text: "Past credit challenges do not stop you from asking what may be possible.",
  },
  {
    title: "Self-employed",
    text: "Share how you earn so a reviewer can understand your application.",
  },
];

const approvalSignals = [
  {
    icon: Gauge,
    title: "Your monthly budget",
    text: "Tell us what payment range feels comfortable.",
  },
  {
    icon: Banknote,
    title: "Your income",
    text: "A rough monthly amount helps us understand affordability.",
  },
  {
    icon: WalletCards,
    title: "Your down payment",
    text: "Choose $0 if that is your plan. Requirements vary by application.",
  },
  {
    icon: CreditCard,
    title: "Your credit picture",
    text: "Credit is one part of the review, not the whole story.",
  },
];

const process = [
  {
    icon: FileText,
    title: "Tell us what you need",
    text: "Start with the vehicle and timing, then share the contact and budget details needed for a useful follow-up.",
  },
  {
    icon: UserRoundCheck,
    title: "We review your application",
    text: "A real person looks at the details and considers what options may fit.",
  },
  {
    icon: MapPinned,
    title: "Talk through next steps",
    text: "We explain the vehicle and financing paths that may be realistic.",
  },
  {
    icon: Car,
    title: "Choose when you are ready",
    text: "If an option works for you, move forward with a car that fits your needs and budget.",
  },
];

const vehiclePaths = [
  {
    icon: Gauge,
    title: "Comfortable payment",
    text: "Start with a monthly amount that leaves room for the rest of life.",
  },
  {
    icon: Car,
    title: "Right vehicle",
    text: "Talk through the size, use, and features that matter before you commit.",
  },
  {
    icon: Handshake,
    title: "Clear next steps",
    text: "Understand what may be available before deciding whether to move forward.",
  },
];

const documents = [
  "Driver's licence",
  "Recent pay stub or income proof",
  "Proof of address",
  "Down payment amount, if any",
  "Trade-in details, if applicable",
  "Your preferred monthly payment range",
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
    question: "Do I need to know exactly which car I want?",
    answer:
      "No. You can start with a budget and talk through possible vehicle options during the follow-up. Vehicle availability varies.",
  },
  {
    question: "Does submitting mean I am approved?",
    answer:
      "No. The form starts the process. Final approval, payment, rate, and vehicle options depend on lender review and income verification.",
  },
  {
    question: "Do I need money down?",
    answer:
      "Not always. Requirements vary by lender, application, and vehicle. We can talk through what may be available.",
  },
  {
    question: "Is this only for challenged credit?",
    answer:
      "No. Approval Agents is for people shopping for a vehicle across a range of credit situations, including established credit, new credit, and past credit challenges.",
  },
  {
    question: "What happens after I submit?",
    answer:
      "An Approval Agent follows up, confirms the basics, and talks through what vehicle and financing options may be realistic.",
  },
];

const formQuestions: FormQuestion[] = [
  {
    id: "vehicleType",
    kind: "choice",
    question: "What type of vehicle are you looking for?",
    options: [
      { label: "SUV", value: "SUV" },
      { label: "Sedan", value: "Sedan" },
      { label: "Truck", value: "Truck" },
      { label: "Van", value: "Van" },
      { label: "Electric / hybrid", value: "Electric or hybrid" },
      { label: "Not sure yet", value: "Not sure yet" },
    ],
  },
  {
    id: "vehicleCondition",
    kind: "choice",
    question: "Are you looking for new or used?",
    options: [
      { label: "New", value: "New" },
      { label: "Used", value: "Used" },
      { label: "Open to either", value: "Open to either" },
    ],
  },
  {
    id: "purchaseTimeline",
    kind: "choice",
    question: "When would you like your next vehicle?",
    options: [
      { label: "As soon as possible", value: "As soon as possible" },
      { label: "Within 30 days", value: "Within 30 days" },
      { label: "Within 1-3 months", value: "Within 1 to 3 months" },
      { label: "Just browsing", value: "Just browsing" },
    ],
  },
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
    id: "budget",
    kind: "choice",
    question: "Monthly payment?",
    options: [
      { label: "Under $350", value: "Under $350 / month" },
      { label: "$350-$500", value: "$350 - $500 / month" },
      { label: "$500-$700", value: "$500 - $700 / month" },
      { label: "$700+", value: "$700+ / month" },
      { label: "Not sure", value: "Not sure" },
    ],
  },
  {
    id: "tradeInStatus",
    kind: "choice",
    question: "Do you have a vehicle to trade in?",
    options: [
      { label: "Yes", value: "Yes" },
      { label: "No", value: "No" },
      { label: "Not sure", value: "Not sure" },
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
      { label: "Good / established", value: "Established credit" },
      { label: "Building / new", value: "No credit history" },
      { label: "Rebuilding", value: "Rebuilding credit" },
      { label: "Proposal", value: "Consumer proposal" },
      { label: "Past bankruptcy", value: "Past bankruptcy" },
      { label: "Not sure", value: "Not sure" },
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
    case "vehicleType":
      return "What kind of vehicle are you looking for?";
    case "vehicleCondition":
      return "New, used, or open to either?";
    case "purchaseTimeline":
      return "When would you like your next vehicle?";
    case "phone":
      return `Best number to reach you, ${firstName}?`;
    case "email":
      return "Where should we send your next steps?";
    case "budget":
      return "What monthly payment feels comfortable?";
    case "tradeInStatus":
      return "Do you have a vehicle to trade in?";
    case "downPayment":
      return "Planning a down payment?";
    case "income":
      return "Approximate monthly income before tax?";
    case "employment":
      return "How do you currently earn income?";
    case "creditSituation":
      return "How would you describe your credit today?";
    case "consent":
      return "Can we contact you about your car search?";
    default:
      return question.question;
  }
}

function getBanter(question: FormQuestion, firstName: string) {
  switch (question.id) {
    case "vehicleType":
      return "Start with the car.";
    case "vehicleCondition":
      return "Either works if you are flexible.";
    case "purchaseTimeline":
      return "A rough timeline is enough.";
    case "fullName":
      return "Now, a quick introduction.";
    case "phone":
      return `Good to meet you, ${firstName}.`;
    case "email":
      return "We will keep the next step clear.";
    case "budget":
      return "Start with what works for you.";
    case "tradeInStatus":
      return "A trade-in may help shape the options.";
    case "downPayment":
      return "Zero is a real answer.";
    case "income":
      return "A ballpark number is fine.";
    case "employment":
      return "This helps us understand the full picture.";
    case "creditSituation":
      return "Every starting point is welcome.";
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
        alt="Approval Agents connecting a car shopper with potential financing options"
        src="/agent-approvals-routing.png"
      />
      <div className="map-copy">
        <span>Connected options</span>
        <strong>Your application can be considered across more than one path.</strong>
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
  const sourcePageUrl = useRef("");
  const submissionId = useRef("");

  const currentQuestion = formQuestions[step];
  const firstName = getFirstName(application.fullName);
  const questionCopy = getQuestionCopy(currentQuestion, firstName);
  const banter = getBanter(currentQuestion, firstName);
  const progress = ((step + 1) / formQuestions.length) * 100;

  useEffect(() => {
    sourcePageUrl.current = window.location.href;

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
      if (!submissionId.current) {
        submissionId.current =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? `approval-agents-${crypto.randomUUID()}`
            : `approval-agents-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      }

      const response = await fetch("/api/applications", {
        body: JSON.stringify({
          ...nextApplication,
          idempotencyKey: submissionId.current,
          pageUrl: sourcePageUrl.current || window.location.href,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Request submission failed");
      }

      setSubmitted(true);
    } catch {
      setSubmitError(
        "We could not send your request. Please try again or call the number below."
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
        <span>Request received</span>
        <h2>{firstName}, we have your details.</h2>
        <p>
          An Approval Agent can follow up to confirm the basics and talk through
          vehicle and financing options that may fit.
        </p>
        <dl className="summary-list">
          <div>
            <dt>Vehicle</dt>
            <dd>{application.vehicleType}</dd>
          </div>
          <div>
            <dt>Timing</dt>
            <dd>{application.purchaseTimeline}</dd>
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
            submissionId.current = "";
          }}
        >
          Start another search
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
          <fieldset
            className={
              currentQuestion.options.length > 4
                ? "typeform-options typeform-options-compact"
                : "typeform-options"
            }
          >
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
          <div className="consent-wrap">
            <p className="consent-disclosure" id="consent-disclosure">
              By continuing, you consent to Approval Agents using your details
              to respond and, where needed, sharing them with participating
              vehicle or financing providers. We may contact you by phone or
              email. Read our{" "}
              <a href="/privacy" rel="noreferrer" target="_blank">
                Privacy Policy
              </a>
              .
            </p>
            <button
              aria-describedby="consent-disclosure"
              className="typeform-option consent-option"
              disabled={isSubmitting}
              onClick={acceptContact}
              type="button"
            >
              <span>
                {isSubmitting
                  ? "Sending application..."
                  : "Yes, contact me about vehicle and financing options"}
              </span>
              <ArrowRight size={18} />
            </button>
          </div>
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
        <h2>Cars our customers drove home in</h2>
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
            alt={`${proof.vehicle} delivered to an Approval Agents customer`}
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
        Skip to car search
      </a>

      <header className="site-header">
        <a href="#top" aria-label="Approval Agents home">
          <ApprovalLogo decorative />
        </a>
        <nav aria-label="Primary navigation">
          <a href="#deliveries">Deliveries</a>
          <a href="#situations">Who we help</a>
          <a href="#process">How it works</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="header-action" href="#apply">
          <Search size={17} />
          Get started
        </a>
      </header>

      <section className="hero-section" id="top">
        <div className="hero-copy">
          <p className="eyebrow">A simpler way to buy your next car</p>
          <h1>Find a car that fits your life and your budget.</h1>
          <p className="hero-text">
            Tell us what you are looking for and an Approval Agent will help you
            understand the vehicle and financing options that may fit, without
            pressure or guesswork.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#apply">
              Start my car search
              <ArrowRight size={18} />
            </a>
          </div>
          <div className="hero-note">
            <ShieldCheck size={17} />
            <span>No pressure. No commitment to buy.</span>
          </div>
        </div>

        <ApplyForm />
      </section>

      <DeliveryCarousel />

      <section className="problem-section">
        <div className="section-kicker">
          <span>Car shopping, made simpler</span>
          <h2>Start with what works for you.</h2>
        </div>
        <div className="proof-grid">
          <article>
            <Gauge size={24} />
            <h3>Your budget first</h3>
            <p>
              Choose a monthly payment range that feels comfortable.
            </p>
          </article>
          <article>
            <MessageSquareText size={24} />
            <h3>Real guidance</h3>
            <p>
              A real person follows up to talk through possible next steps in
              plain language.
            </p>
          </article>
          <article>
            <FileCheck2 size={24} />
            <h3>No-pressure start</h3>
            <p>
              Submitting the form starts a conversation. It does not commit you
              to a vehicle.
            </p>
          </article>
        </div>
      </section>

      <section className="credit-section" id="situations">
        <div className="section-kicker">
          <span>Who we help</span>
          <h2>A starting point for all kinds of car buyers.</h2>
        </div>
        <div className="situation-grid">
          {buyerSituations.map((situation) => (
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
          <span>What helps us understand the fit</span>
          <h2>The right car starts with the right numbers.</h2>
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
          <span>The right fit</span>
          <h2>The car matters. So do the numbers.</h2>
          <p>
            The goal is to find a vehicle you feel good about and a payment you
            can realistically manage.
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
          <h2>Four simple steps toward your next car.</h2>
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

      <section className="routing-section" aria-label="Approval Agents financing network">
        <div className="routing-copy">
          <p className="eyebrow">Financing support</p>
          <h2>One application. More ways to move forward.</h2>
          <p>
            Share your details once and we can explore financing paths that may
            fit your budget and situation.
          </p>
          <ul className="route-list">
            <li>
              <CheckCircle2 size={18} />
              Tell us what monthly payment feels comfortable.
            </li>
            <li>
              <CheckCircle2 size={18} />
              Share a few income and financing details.
            </li>
            <li>
              <CheckCircle2 size={18} />
              Get realistic next steps before you commit to a car.
            </li>
          </ul>
        </div>
        <ApprovalMap />
      </section>

      <section className="documents-section">
        <div className="documents-copy">
          <p className="eyebrow">If you move forward</p>
          <h2>A few details can make the next step faster.</h2>
          <p>
            You do not need these to start. Having them ready can help when an
            agent follows up.
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
          <h2>Clear answers before you get started.</h2>
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
          <Search size={24} />
          <h2>Ready to start your car search?</h2>
          <p>
            Share a few basics and we will follow up to talk through vehicle and
            financing options that may fit, before you commit to anything.
          </p>
        </div>
        <div className="closing-actions">
          <a className="primary-button" href="#apply">
            Start my car search
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
          Submitting this form starts a conversation and does not guarantee
          financing or reserve a vehicle. Approval, rates, terms, payments,
          and vehicle availability depend on lender review, income
          verification, vehicle selection, and other applicable conditions.
        </p>
        <nav aria-label="Footer navigation">
          <a href="#apply">Get started</a>
          <a href={phoneNumberHref}>Call {phoneNumberDisplay}</a>
          <a href="#situations">Who we help</a>
          <a href="#faq">Questions</a>
          <a href="/privacy">Privacy</a>
        </nav>
      </footer>
    </main>
  );
}

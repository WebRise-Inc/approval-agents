import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ApplicationPayload = {
  budget?: unknown;
  consent?: unknown;
  creditSituation?: unknown;
  downPayment?: unknown;
  email?: unknown;
  employment?: unknown;
  fullName?: unknown;
  idempotencyKey?: unknown;
  income?: unknown;
  pageUrl?: unknown;
  phone?: unknown;
};

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getConfiguredIntake() {
  const url = process.env.LEAD_INTAKE_URL?.trim();
  const apiKey = process.env.LEAD_INTAKE_API_KEY?.trim();
  const clientId = process.env.LEAD_INTAKE_CLIENT_ID?.trim();

  if (!url || !apiKey) {
    return undefined;
  }

  return {
    apiKey,
    clientId,
    url,
  };
}

export async function POST(request: Request) {
  const intake = getConfiguredIntake();

  if (!intake) {
    console.error("[applications] missing lead intake configuration");
    return NextResponse.json(
      { error: "Lead intake is not configured" },
      { status: 500 }
    );
  }

  let payload: ApplicationPayload;

  try {
    payload = (await request.json()) as ApplicationPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const fullName = readString(payload.fullName);
  const phone = readString(payload.phone);
  const email = readString(payload.email);
  const income = readString(payload.income);
  const employment = readString(payload.employment);
  const creditSituation = readString(payload.creditSituation);
  const downPayment = readString(payload.downPayment);
  const budget = readString(payload.budget);
  const pageUrl = readString(payload.pageUrl);

  if (
    !fullName ||
    !phone ||
    phone.replace(/\D/g, "").length < 10 ||
    !email ||
    !isValidEmail(email) ||
    !income ||
    !employment ||
    !creditSituation ||
    !downPayment ||
    !budget ||
    payload.consent !== true
  ) {
    return NextResponse.json(
      { error: "Application is missing required fields" },
      { status: 400 }
    );
  }

  const idempotencyKey =
    readString(payload.idempotencyKey) || `approval-agents-${crypto.randomUUID()}`;

  const upstreamPayload = {
    ...(intake.clientId ? { clientId: intake.clientId } : {}),
    externalLeadId: idempotencyKey,
    fields: {
      budget,
      contact_consent: "Yes",
      credit_situation: creditSituation,
      down_payment: downPayment,
      email,
      employment_status: employment,
      full_name: fullName,
      monthly_income: income,
      page_url: pageUrl,
      phone_number: phone,
    },
    source: "Approval Agents Website Application",
    submittedAt: new Date().toISOString(),
  };

  try {
    const response = await fetch(intake.url, {
      body: JSON.stringify(upstreamPayload),
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${intake.apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
      },
      method: "POST",
    });

    if (!response.ok) {
      const upstreamText = await response.text();

      console.error("[applications] lead intake rejected submission", {
        status: response.status,
        upstreamText: upstreamText.slice(0, 500),
      });

      return NextResponse.json(
        { error: "Application could not be sent" },
        { status: 502 }
      );
    }

    const result = (await response.json().catch(() => ({}))) as {
      leadId?: string;
      ok?: boolean;
      sourceLeadId?: string;
    };

    return NextResponse.json({
      leadId: result.leadId,
      ok: true,
      sourceLeadId: result.sourceLeadId,
    });
  } catch (error) {
    console.error("[applications] lead intake request failed", { error });

    return NextResponse.json(
      { error: "Application could not be sent" },
      { status: 502 }
    );
  }
}

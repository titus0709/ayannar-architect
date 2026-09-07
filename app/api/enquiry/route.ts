import { NextResponse } from "next/server"

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 })
  }

  const name = String(body.name ?? "").trim()
  const email = String(body.email ?? "").trim()
  const message = String(body.message ?? "").trim()

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  if (!name || !emailValid || !message) {
    return NextResponse.json(
      { error: "Please provide your name, a valid email, and a message." },
      { status: 422 },
    )
  }

  // Enquiry received. Connect an email or CRM integration here to route it.
  console.log("[v0] Enquiry received:", {
    name,
    email,
    phone: String(body.phone ?? "").trim(),
    projectType: String(body.projectType ?? "").trim(),
  })

  return NextResponse.json({ ok: true })
}

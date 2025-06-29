import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  // Mock validation
  if (email === "user@example.com" && password === "password") {
    return NextResponse.json({
      user: { id: "1", email, name: "Test User" },
      token: "mock-token-123",
    });
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  try {
    // Replace with your actual API call
    const response = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: email, password }),
    });

    const result = await response.json();

    // console.log("API LOGIN Result:", result);

    if (!result.success) {
      // Return the actual error message from the backend
      return NextResponse.json(
        {
          success: false,
          error: result?.message || "Authentication failed",
          data: result?.data, // Include any additional data (like requiresVerification)
        },
        { status: response.status }
      );
    }

    // Don't call response.json() again - use the result we already have
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Authentication failed",
      },
      { status: 401 }
    );
  }
}

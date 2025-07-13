import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  const { imei } = await request.json();

  try {
    // Replace with your actual API call
    const response = await fetch(
      `${process.env.API_BASE_URL}/subscriptions/check-device`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ imei }),
      }
    );

    const result = await response.json();

    // console.log("API LOGIN Result:", result);

    if (!result.success) {
      // Return the actual error message from the backend
      return NextResponse.json(
        {
          success: false,
          error: result?.message || "Device Check failed",
          data: result?.data, // Include any additional data (like requiresVerification)
        },
        { status: response.status }
      );
    }

    // Don't call response.json() again - use the result we already have
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("DeviceCheck API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Device Check failed",
      },
      { status: 401 }
    );
  }
}

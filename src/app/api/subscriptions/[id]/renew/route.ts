import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  try {
    const { id } = params;
    const { newPlan, paymentMethod } = await request.json();

    // Validate ID format (optional)
    if (!id || id.trim() === "") {
      return NextResponse.json(
        { error: "Invalid subscription ID" },
        { status: 400 }
      );
    }

    if (!newPlan || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required details" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${process.env.API_BASE_URL}/subscriptions/${id}/renew`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subscriptionId: id, newPlan, paymentMethod }),
      }
    );

    const optionsResult = await response.json();

    console.log("RENEW API response", optionsResult);

    if (!optionsResult.success) {
      throw new Error(optionsResult?.message.toString() || "Renewing Failed");
    }

    return NextResponse.json(optionsResult);
  } catch (error) {
    console.error("Error renewing subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

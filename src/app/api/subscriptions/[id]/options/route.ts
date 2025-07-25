import { NextRequest, NextResponse } from "next/server";

export async function GET(
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

    // Validate ID format (optional)
    if (!id || id.trim() === "") {
      return NextResponse.json(
        { error: "Invalid subscription ID" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${process.env.API_BASE_URL}/subscriptions/${id}/renewal-options`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const optionsResult = await response.json();

    console.log("USER API response", optionsResult);

    if (!optionsResult.success) {
      throw new Error(
        optionsResult?.message.toString() || "Fetching User Profile Failed"
      );
    }

    return NextResponse.json(optionsResult);

 
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

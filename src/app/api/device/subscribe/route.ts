import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest
) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  try {
    // const { id } = params;
    const formData = await request.formData();

    const encryptionData = {
      imei: formData.get("imei"),
      plan: formData.get("plan"),
    };

    const files: File[] = [];
    for (let i = 0; i < 10; i++) {
      const file = formData.get(`file_${i}`) as File;
      if (file) files.push(file);
    }

    const apiFormData = new FormData();
    Object.entries(encryptionData).forEach(([key, value]) => {
      if (value) apiFormData.append(key, value as string);
    });

    files.forEach((file, index) => {
      apiFormData.append(`files`, file);
    });
  

    const response = await fetch(
      `${process.env.API_BASE_URL}/subscriptions/new`,
      {
        method: "POST",
        headers: {
        //   "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: apiFormData,
      }
    );

    const optionsResult = await response.json();

    console.log("NEW SUBSCRIPTION API response", optionsResult);

    if (!optionsResult.success) {
      throw new Error(optionsResult?.message.toString() || "Encrypting Failed");
    }

    return NextResponse.json(optionsResult);
  } catch (error) {
    console.error("Error encrypting:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

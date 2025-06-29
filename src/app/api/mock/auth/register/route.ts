import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const deviceName = formData.get("deviceName") as string;
    const deviceIMEI = formData.get("deviceIMEI") as string;
    const subscriptionPlan = formData.get("subscriptionPlan") as string;

    // Get uploaded files
    const files: File[] = [];
    for (let i = 0; i < 10; i++) {
      const file = formData.get(`file_${i}`) as File;
      if (file) files.push(file);
    }

    console.log("Registration data:", {
      name,
      email,
      password,
      phone,
      deviceName,
      deviceIMEI,
      subscriptionPlan,
      filesCount: files.length,
    });

    // Mock registration success
    return NextResponse.json({
      user: { id: "1", email, name, phone },
      token: "mock-token-123",
    });
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 400 });
  }
}

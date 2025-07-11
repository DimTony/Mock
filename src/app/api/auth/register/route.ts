import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // console.log("ggg", formData);

    // Extract all form data
    const registrationData = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      deviceName: formData.get("deviceName"),
      imei: formData.get("imei"),
      phoneNumber: formData.get("phoneNumber"),
      plan: formData.get("plan"),
    };

    // Handle file uploads
    const files: File[] = [];
    for (let i = 0; i < 10; i++) {
      const file = formData.get(`file_${i}`) as File;
      if (file) files.push(file);
    }

    // Send to your actual API
    const apiFormData = new FormData();
    Object.entries(registrationData).forEach(([key, value]) => {
      if (value) apiFormData.append(key, value as string);
    });

    files.forEach((file, index) => {
      apiFormData.append(`files`, file);
    });

    const response = await fetch(`${process.env.API_BASE_URL}/auth/create`, {
      method: "POST",
      body: apiFormData,
    });

    // console.log("REg API response", await response.json());

    if (!response.ok) {
      const result = await response.json();

      throw new Error(result?.message.toString() || "Registration failed");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { schema } from "./schema";
import prisma from "@/prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@/interfaces";

export async function POST(request: NextRequest) {
  try {
    const loginDetails: User = await request.json();

    // 1. Validation
    const validation = schema.safeParse(loginDetails);
    if (!validation.success) {
      return NextResponse.json(validation.error.message, { status: 400 });
    }

    // 2. Check if user exists
    const user = await prisma.user.findFirst({
      where: {
        email: loginDetails.email,
      },
    });

    if (!user) {
      return NextResponse.json("User does not exist", { status: 404 });
    }

    // 3. Compare passwords
    const result = await bcrypt.compare(loginDetails.password, user.password);
    if (!result) {
      return NextResponse.json("Incorrect credentials", { status: 401 });
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      { userId: user.id, userEmail: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "30d" } // Token expires in 30 days
    );

    // 5. Return token in response headers
    const response = NextResponse.json(
      { message: "Login successful" },
      { status: 200 }
    );
    response.headers.set("Authorization", `Bearer ${token}`);
    return response;
  } catch (error) {
    console.error("Error in login endpoint:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

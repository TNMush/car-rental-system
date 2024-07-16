import { User } from "@/interfaces";
import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import bycrpt from "bcrypt";
import { schema } from "./schema";

export async function POST(request: NextRequest) {
  const newUser: User = await request.json();
  //Check if user already exists
  let user = await prisma.user.findFirst({
    where: {
      email: newUser.email,
    },
  });

  if (user) return NextResponse.json("User already exists", { status: 409 });
  //validation
  const validation = schema.safeParse(newUser);

  if (!validation.success)
    return NextResponse.json(validation.error.message, { status: 400 });
  //Otherwise save user
  const hashedPassword = await bycrpt.hash(newUser.password, 10);

  user = await prisma.user.create({
    data: {
      email: newUser.email,
      password: hashedPassword,
    },
  });

  return NextResponse.json(user, { status: 201 });
}

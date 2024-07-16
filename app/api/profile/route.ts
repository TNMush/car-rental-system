import { Profile } from "@/interfaces";
import { NextRequest, NextResponse } from "next/server";
import { ProfileSchema } from "./schema";
import prisma from "@/prisma/client";

export async function POST(request: NextRequest) {
  const requestBody: Profile = await request.json();
  //1. Validation
  const validation = ProfileSchema.safeParse(requestBody);

  if (!validation.success)
    return NextResponse.json(
      { message: validation.error.message },
      { status: 400 }
    );
  //2.Check if user exists
  const user = prisma.user.findFirst({
    where: {
      id: requestBody.id,
    },
  });
  if (!user) return NextResponse.json("User doen't exist", { status: 404 });

  //3.If location details provided, create location

  //4.Create Profile
  //5.Return
}

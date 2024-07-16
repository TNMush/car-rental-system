import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { IdentityVerificationSchema } from "./schema";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();

    // 1. Validation
    const validation = IdentityVerificationSchema.safeParse(requestBody);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors },
        { status: 400 }
      );
    }

    // 2. Check if profile exists
    const profile = await prisma.profile.findFirst({
      where: {
        id: requestBody.id,
      },
    });
    if (!profile) {
      return NextResponse.json(
        { message: "Profile doesn't exist" },
        { status: 404 }
      );
    }

    // 3. Check if identity verification already submitted
    const existingVerification = await prisma.identityVerification.findFirst({
      where: {
        id: requestBody.id,
      },
    });

    let newIdentityVerification;

    if (existingVerification) {
      // 4. Update existing IdentityVerification
      newIdentityVerification = await prisma.identityVerification.update({
        where: {
          id: requestBody.id,
        },
        data: {
          cameraImage: requestBody.cameraImage,
          identityDocument: requestBody.identityDocument,
        },
      });
    } else {
      // 4. Create new IdentityVerification
      newIdentityVerification = await prisma.identityVerification.create({
        data: {
          id: requestBody.id,
          cameraImage: requestBody.cameraImage,
          identityDocument: requestBody.identityDocument,
          profile: {
            connect: {
              id: requestBody.id,
            },
          },
        },
      });
    }

    // 5. Return the created or updated identity verification
    return NextResponse.json(newIdentityVerification, { status: 201 });
  } catch (error) {
    console.log("Unexpected error occurred", error);
    return NextResponse.json(
      { error: `Unexpected error occurred: ${error}` },
      { status: 500 }
    );
  }
}

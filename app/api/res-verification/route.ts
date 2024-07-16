import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ResidenceVerificationSchema } from "./schema";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();

    // 1. Validation
    const validation = ResidenceVerificationSchema.safeParse(requestBody);
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

    // 3. Check if residence verification already submitted
    const existingVerification = await prisma.residenceVerification.findFirst({
      where: {
        id: requestBody.id,
      },
    });

    let newResidenceVerification;

    if (existingVerification) {
      // 4. Update existing ResidenceVerification
      newResidenceVerification = await prisma.residenceVerification.update({
        where: {
          id: requestBody.id,
        },
        data: {
          utilityBill: requestBody.utilityBill,
          affidavity: requestBody.affidavity,
          status: "PENDING",
        },
      });
    } else {
      // 4. Create new ResidenceVerification
      newResidenceVerification = await prisma.residenceVerification.create({
        data: {
          id: requestBody.id,
          utilityBill: requestBody.utilityBill,
          affidavity: requestBody.affidavity,
          profileId: requestBody.id,
        },
      });
    }

    // 5. Return the created or updated residence verification
    return NextResponse.json(newResidenceVerification, { status: 201 });
  } catch (error) {
    console.log("Unexpected error occurred", error);
    return NextResponse.json(
      { error: `Unexpected error occurred: ${error}` },
      { status: 500 }
    );
  }
}

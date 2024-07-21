import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import {
  AdminResidenceVerificationInterface,
  AdminResidenceVerificationSchema,
  ResidenceVerification,
  ResidenceVerificationSchema,
} from "./schema";

export async function POST(request: NextRequest) {
  try {
    const requestBody: ResidenceVerification = await request.json();

    //get the user id from the request
    const id = new URL(request.url).searchParams.get("id");

    if (!id) {
      console.log("User id is required", id);
      return NextResponse.json(
        { message: "User id is required" },
        { status: 400 }
      );
    }

    // Check if profile exists
    const profile = await prisma.profile.findFirst({
      where: {
        id,
      },
    });
    if (!profile) {
      return NextResponse.json(
        { message: "Profile doesn't exist" },
        { status: 404 }
      );
    }
    // Check if residence verification already submitted
    const existingVerification = await prisma.residenceVerification.findFirst({
      where: {
        profileId: id,
      },
    });

    if (existingVerification) {
      return NextResponse.json(
        { message: "Residence verification under progress" },
        { status: 400 }
      );
    }

    // Validation
    const validation = ResidenceVerificationSchema.safeParse(requestBody);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors },
        { status: 400 }
      );
    }

    let newResidenceVerification;

    //  Create new ResidenceVerification
    newResidenceVerification = await prisma.residenceVerification.create({
      data: {
        profileId: id,
        utilityBill: requestBody.utilityBill,
        affidavity: requestBody.affidavity,
      },
    });

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

export async function PATCH(request: NextRequest) {
  try {
    const requestBody: AdminResidenceVerificationInterface =
      await request.json();

    //get the user id from the request
    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "User id is required" },
        { status: 400 }
      );
    }

    //  Check if profile exists
    const profile = await prisma.profile.findFirst({
      where: {
        id,
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
        profileId: id,
      },
    });

    if (!existingVerification) {
      return NextResponse.json(
        { message: "Residence verification doesn't exist" },
        { status: 404 }
      );
    }

    //  Validation
    const validation = AdminResidenceVerificationSchema.safeParse(requestBody);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors },
        { status: 400 }
      );
    }

    //  Update the residence verification
    const updatedResidenceVerification =
      await prisma.residenceVerification.update({
        where: {
          profileId: existingVerification.profileId,
        },
        data: {
          status: requestBody.status,
        },
      });

    return NextResponse.json(updatedResidenceVerification, { status: 200 });
  } catch (error) {
    console.log("Unexpected error occurred", error);
    return NextResponse.json(
      { error: `Unexpected error occurred: ${error}` },
      { status: 500 }
    );
  }
}

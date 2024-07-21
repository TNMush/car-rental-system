import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import {
  AdminIdentityVerificationInterface,
  AdminIdentityVerificationSchema,
  IdentityVerification,
  IdentityVerificationSchema,
} from "./schema";

export async function POST(request: NextRequest) {
  try {
    const requestBody: IdentityVerification = await request.json();
    //get id from search params
    const id = new URL(request.url).searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Profile id is required" },
        { status: 400 }
      );
    }

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
        id,
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
        profileId: id,
      },
    });

    let newIdentityVerification;

    if (existingVerification) {
      // 4. Update existing IdentityVerification
      newIdentityVerification = await prisma.identityVerification.update({
        where: {
          profileId: id,
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
          profileId: id,
          cameraImage: requestBody.cameraImage,
          identityDocument: requestBody.identityDocument,
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

export async function PATCH(request: NextRequest) {
  try {
    const requestBody: AdminIdentityVerificationInterface =
      await request.json();
    //get id from search params
    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "Identity verification id is required" },
        { status: 400 }
      );
    }

    // 1. Validation
    const validation = AdminIdentityVerificationSchema.safeParse(requestBody);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors },
        { status: 400 }
      );
    }

    // 2. Check if identity verification exists
    const existingVerification = await prisma.identityVerification.findFirst({
      where: {
        profileId: id,
      },
    });
    if (!existingVerification) {
      return NextResponse.json(
        { message: "Identity verification doesn't exist" },
        { status: 404 }
      );
    }

    // 3. Update the status of the identity verification
    const updatedVerification = await prisma.identityVerification.update({
      where: {
        profileId: id,
      },
      data: {
        status: requestBody.status,
      },
    });

    // 4. Return the updated identity verification
    return NextResponse.json(updatedVerification, { status: 200 });
  } catch (error) {
    console.log("Unexpected error occurred", error);
    return NextResponse.json(
      { error: `Unexpected error occurred: ${error}` },
      { status: 500 }
    );
  }
}

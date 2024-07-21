import { NextRequest, NextResponse } from "next/server";
import {
  AdminCarVerification,
  AdminCarVerificationSchema,
  CarVerification,
  CarVerificationSchema,
} from "./schema";
import prisma from "@/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const requestBody: CarVerification = await request.json();

    //get if from search params
    const id = new URL(request.url).searchParams.get("id");

    if (!id) {
      return NextResponse.json("Profile ID is required", { status: 400 });
    }

    //Does profile exist?
    const profile = await prisma.profile.findFirst({
      where: {
        id,
      },
    });

    if (!profile) {
      return NextResponse.json("Profile does not exist", { status: 404 });
    }

    //get carId from search params
    const carId = new URL(request.url).searchParams.get("carId");

    if (!carId) {
      return NextResponse.json("Car ID is required", { status: 400 });
    }

    const existingCar = await prisma.car.findFirst({
      where: {
        id: carId,
      },
    });

    //Does Car exist?

    if (!existingCar) {
      return NextResponse.json("Car does not exist", { status: 404 });
    }

    //Does CarVerification already exist?
    const existingCarVerification = await prisma.carVerification.findFirst({
      where: {
        id: carId,
      },
    });

    if (existingCarVerification) {
      return NextResponse.json("Car verification under progress", {
        status: 400,
      });
    }

    //Validate the request body
    const validation = CarVerificationSchema.safeParse(requestBody);

    if (!validation.success) {
      return NextResponse.json(validation.error.message, { status: 400 });
    }

    //Create new car verification
    const newCarVerification = await prisma.carVerification.create({
      data: {
        id: carId,
        proofOfRadioLicense: requestBody.proofOfRadioLicense,
        proofOfInsurance: requestBody.proofOfInsurance,
      },
    });

    return NextResponse.json(newCarVerification, { status: 201 });
  } catch (error) {
    console.error("Error in car verification endpoint:", error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const requestBody: AdminCarVerification = await request.json();
    //get id from search params
    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json("Car verification ID is required", {
        status: 400,
      });
    }
    //get carId from search params
    const carId = new URL(request.url).searchParams.get("carId");
    if (!carId) {
      return NextResponse.json("Car ID is required", { status: 400 });
    }

    //Does CarVerification exist?
    const existingCarVerification = await prisma.carVerification.findFirst({
      where: {
        id: carId,
      },
    });

    if (!existingCarVerification) {
      return NextResponse.json("Car verification does not exist", {
        status: 404,
      });
    }
    //Validate the request body
    const validation = AdminCarVerificationSchema.safeParse(requestBody);

    if (!validation.success) {
      return NextResponse.json(validation.error.message, { status: 400 });
    }

    //Update CarVerification
    const updatedCarVerification = await prisma.carVerification.update({
      where: {
        id: carId,
      },
      data: {
        status: requestBody.status,
      },
    });

    return NextResponse.json(updatedCarVerification, { status: 200 });
  } catch (error) {
    console.error("Error in car verification endpoint:", error);
    return NextResponse.json("Internal server error", { status: 500 });
  }
}

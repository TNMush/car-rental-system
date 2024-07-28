import { NextRequest, NextResponse } from "next/server";
import { Experience, ExperienceSchema } from "./schema";
import prisma from "@/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const requestBody: Experience = await request.json();
    // get id from search params
    const reviewerId = new URL(request.url).searchParams.get("id");
    if (!reviewerId) {
      return NextResponse.json(
        { message: "Reviewer ID is required" },
        { status: 400 }
      );
    }
    //rentalId from search params
    const rentalId = new URL(request.url).searchParams.get("rental-id");
    if (!rentalId) {
      return NextResponse.json(
        { message: "Rental ID is required" },
        { status: 400 }
      );
    }

    // Validate the request body against the schema
    const validation = ExperienceSchema.safeParse(requestBody);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors },
        { status: 400 }
      );
    }

    // profile exists?
    const profile = await prisma.profile.findFirst({
      where: {
        id: reviewerId,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { message: "Profile doesn't exist" },
        { status: 404 }
      );
    }

    // rental doesnt exist?
    const existingRental = await prisma.rental.findFirst({
      where: {
        id: rentalId,
      },
    });

    if (!existingRental) {
      return NextResponse.json(
        { message: "Rental doesn't exist" },
        { status: 404 }
      );
    }

    // Create the experience
    const experience = await prisma.experience.create({
      data: {
        ...requestBody,
        reviewerId: reviewerId,
        rentalId: rentalId,
      },
    });

    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get rentalId from query params;
    const rentalId = new URL(request.url).searchParams.get("rental-id");

    if (!rentalId) {
      return NextResponse.json(
        { message: "Rental ID is required" },
        { status: 400 }
      );
    }

    // Get all experiences for a rental
    const experiences = await prisma.experience.findMany({
      where: {
        rentalId: rentalId,
      },
    });

    return NextResponse.json(experiences, { status: 200 });
  } catch (error) {
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const experienceId = new URL(request.url).searchParams.get("experience-id");
    const reviewerId = new URL(request.url).searchParams.get("id");

    if (!reviewerId) {
      return NextResponse.json(
        { message: "Reviewer ID is required" },
        { status: 400 }
      );
    }

    if (!experienceId) {
      return NextResponse.json(
        { message: "Experience ID is required" },
        { status: 400 }
      );
    }

    // Check if the experience exists
    const existingExperience = await prisma.experience.findUnique({
      where: { id: experienceId, reviewerId: reviewerId },
    });

    if (!existingExperience) {
      return NextResponse.json(
        { message: "Experience doesn't exist" },
        { status: 404 }
      );
    }

    // Delete the experience
    await prisma.experience.delete({
      where: { id: experienceId },
    });

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error("Error deleting experience:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

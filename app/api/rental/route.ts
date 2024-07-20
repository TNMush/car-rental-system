import { NextRequest, NextResponse } from "next/server";
import { Rental, RentalSchema } from "./schema";
import prisma from "@/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const requestBody: Rental = await request.json();

    //validation
    const validation = RentalSchema.safeParse(requestBody);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors },
        { status: 400 }
      );
    }

    //Profile exists?
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
    //Rental already submitted?
    const existingRental = await prisma.rental.findFirst({
      where: {
        id: requestBody.id,
      },
    });
    //don't update existing rental
    if (existingRental) {
      return NextResponse.json(
        { message: "Rental already exists" },
        { status: 409 }
      );
    }

    //Create new rental
    const newRental = await prisma.rental.create({
      data: {
        id: requestBody.id,
        listingId: requestBody.listingId,
        renterId: requestBody.renterId,
        dateOfCollection: requestBody.dateOfCollection,
        dateOfReturn: requestBody.dateOfReturn,
        priceCharged: requestBody.priceCharged,
      },
    });
    //return new rental
    return NextResponse.json(newRental, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    //Get profile id from search params
    const profileId = new URL(request.url).searchParams.get("id");

    if (!profileId) {
      return NextResponse.json(
        { message: "Profile ID not provided" },
        { status: 400 }
      );
    }

    //if rental-id, get rental id from search params
    const rentalId = new URL(request.url).searchParams.get("rental-id");

    //Get all rentals if rental-id is not provided
    if (!rentalId) {
      const rentals = await prisma.rental.findMany({
        where: {
          renterId: profileId,
        },
      });
      return NextResponse.json(rentals, { status: 200 });
    }

    //Get rental by rental-id
    const rental = await prisma.rental.findFirst({
      where: {
        id: rentalId,
      },
    });
    return NextResponse.json(rental, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    //Get profile id from search params
    const profileId = new URL(request.url).searchParams.get("id");

    if (!profileId) {
      return NextResponse.json(
        { message: "Profile ID not provided" },
        { status: 400 }
      );
    }

    //Get rental id from search params
    const rentalId = new URL(request.url).searchParams.get("rental-id");

    if (!rentalId) {
      return NextResponse.json(
        { message: "Rental ID not provided" },
        { status: 400 }
      );
    }

    //Delete rental
    await prisma.rental.delete({
      where: {
        id: rentalId,
      },
    });
    return NextResponse.json({ message: "Rental deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

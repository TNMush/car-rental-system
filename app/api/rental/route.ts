import { NextRequest, NextResponse } from "next/server";
import { Rental, RentalSchema } from "./schema";
import prisma from "@/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const requestBody: Rental = await request.json();
    //get profile id from search params
    const profileId = new URL(request.url).searchParams.get("id");
    if (!profileId) {
      return NextResponse.json(
        { message: "Profile ID not provided" },
        { status: 400 }
      );
    }
    //get listing id from search params
    const listingId = new URL(request.url).searchParams.get("listing-id");
    if (!listingId) {
      return NextResponse.json(
        { message: "Listing ID not provided" },
        { status: 400 }
      );
    }
    //check if profile exists
    const profileExists = await prisma.profile.findFirst({
      where: {
        id: profileId,
      },
    });

    if (!profileExists) {
      return NextResponse.json(
        { message: "Profile does not exist" },
        { status: 404 }
      );
    }

    //check if identity is verified
    const idVerification = await prisma.identityVerification.findFirst({
      where: {
        profileId: profileId,
      },
    });
    if (!idVerification) {
      return NextResponse.json(
        { message: "Identity not verified" },
        { status: 403 }
      );
    }

    if (idVerification.status !== "SUCCESS") {
      return NextResponse.json(
        { message: "Identity not verified" },
        { status: 403 }
      );
    }
    //check if residence is verified
    const residenceVerification = await prisma.residenceVerification.findFirst({
      where: {
        profileId: profileId,
      },
    });
    if (!residenceVerification) {
      return NextResponse.json(
        { message: "Residence not verified" },
        { status: 403 }
      );
    }
    if (residenceVerification.status !== "SUCCESS") {
      return NextResponse.json(
        { message: "Residence not verified" },
        { status: 403 }
      );
    }

    //check if listing exists
    const listingExists = await prisma.listing.findFirst({
      where: {
        id: listingId,
      },
    });

    if (!listingExists) {
      return NextResponse.json(
        { message: "Listing does not exist" },
        { status: 404 }
      );
    }
    //Rental already submitted?
    const existingRental = await prisma.rental.findFirst({
      where: {
        listingId: listingId,
      },
    });
    //don't update existing rental
    if (existingRental) {
      return NextResponse.json(
        { message: "Rental already exists" },
        { status: 409 }
      );
    }

    //validation
    const validation = RentalSchema.safeParse(requestBody);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors },
        { status: 400 }
      );
    }

    //Create new rental
    const newRental = await prisma.rental.create({
      data: {
        listingId: listingId,
        renterId: profileId,
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

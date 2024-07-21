import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ListingSchema } from "./schema";

export async function POST(request: NextRequest) {
  try {
    //get carId from search params
    const carId = new URL(request.url).searchParams.get("carId");
    if (!carId) {
      return NextResponse.json(
        { error: "Invalid request, carId is required" },
        { status: 400 }
      );
    }
    //get id from search params
    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Invalid request, id is required" },
        { status: 400 }
      );
    }
    //does profile exist
    const profile = await prisma.profile.findUnique({
      where: {
        id,
      },
    });
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    //get body from request
    const requestBody = await request.json();

    //validate
    const validation = ListingSchema.safeParse(requestBody);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    //check if user id verified
    const idVerification = await prisma.identityVerification.findFirst({
      where: {
        profileId: id,
      },
    });
    if (!idVerification) {
      return NextResponse.json(
        { error: "Identity not verified" },
        { status: 403 }
      );
    }
    //check if residence is verified
    if (profile.locationId === null) {
      return NextResponse.json(
        { error: "User did not enter residence" },
        { status: 403 }
      );
    }
    const residenceVerification = await prisma.residenceVerification.findFirst({
      where: {
        profileId: id,
      },
    });
    if (!residenceVerification) {
      return NextResponse.json(
        { error: "Residence not verified" },
        { status: 403 }
      );
    }

    //check if user has a car and it's verified
    const car = await prisma.car.findFirst({
      where: {
        id: carId,
        ownerId: id,
      },
    });
    if (!car) {
      return NextResponse.json({ error: "Car not found" }, { status: 404 });
    }

    //check if car is verified
    const carVerification = await prisma.carVerification.findFirst({
      where: {
        id: carId,
      },
    });

    if (carVerification?.status !== "SUCCESS") {
      return NextResponse.json({ error: "Car not verified" }, { status: 403 });
    }

    //create listing
    const listing = await prisma.listing.create({
      data: {
        ...validation.data,
        locationId: profile.locationId,
        carId: carId,
        listedBy: id,
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal server error : ${error}` },
      { status: 500 }
    );
  }
}
export async function PATCH(request: NextRequest) {
  try {
    //get id from search params
    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Invalid request, id is required" },
        { status: 400 }
      );
    }
    //get listing id from search params
    const listingId = new URL(request.url).searchParams.get("listingId");
    if (!listingId) {
      return NextResponse.json(
        { error: "Invalid request, listingId is required" },
        { status: 400 }
      );
    }

    //get body from request
    const requestBody = await request.json();

    //validate
    const validation = ListingSchema.safeParse(requestBody);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    //check if listing exists
    const listing = await prisma.listing.findFirst({
      where: {
        id: listingId,
        listedBy: id,
      },
    });
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    //update listing
    const updatedListing = await prisma.listing.update({
      where: {
        id: listingId,
      },
      data: validation.data,
    });

    return NextResponse.json(updatedListing, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal server error : ${error}` },
      { status: 500 }
    );
  }
}
export async function DELETE(request: NextRequest) {
  try {
    //get id from search params
    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "Invalid request, id is required" },
        { status: 400 }
      );
    }
    //get listing id from search params
    const listingId = new URL(request.url).searchParams.get("listingId");
    if (!listingId) {
      return NextResponse.json(
        { error: "Invalid request, listingId is required" },
        { status: 400 }
      );
    }
    //check if listing exists
    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
        listedBy: id,
      },
    });
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }
    //delete listing
    await prisma.listing.delete({
      where: {
        id: listingId,
      },
    });
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal server error : ${error}` },
      { status: 500 }
    );
  }
}
export async function GET(request: NextRequest) {
  try {
    //Get all listings
    const listings = await prisma.listing.findMany({
      include: {
        location: true,
      },
    });
    //will filter in frontend

    return NextResponse.json(listings, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Internal server error : ${error}` },
      { status: 500 }
    );
  }
}

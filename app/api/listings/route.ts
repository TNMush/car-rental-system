import {
  CreateListingInterface,
  PatchingListingInterface,
  listingRequestInterface,
} from "@/interfaces";
import prisma from "@/prisma/client";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import {
  createListingSchema,
  listingRequestSchema,
  patchingListingSchema,
} from "./schema";

export async function GET(request: NextRequest) {
  try {
    const requestBody: listingRequestInterface = await request.json();
    // Validation
    const validation = listingRequestSchema.safeParse(requestBody);
    if (!validation.success)
      return NextResponse.json({ message: validation.error }, { status: 400 });

    // Construct a where clause based on the provided query parameters
    const whereClause: any = {};

    if (requestBody.location) {
      whereClause.location = {
        location: requestBody.location,
      };
    }
    if (requestBody.color) {
      whereClause.listed = {
        car: {
          some: {
            color: requestBody.color,
          },
        },
      };
    }
    if (requestBody.model) {
      whereClause.listed = {
        car: {
          some: {
            model: requestBody.model,
          },
        },
      };
    }
    if (requestBody.year) {
      whereClause.listed = {
        car: {
          some: {
            year: requestBody.year,
          },
        },
      };
    }
    if (requestBody.make) {
      whereClause.listed = {
        car: {
          some: {
            make: requestBody.make,
          },
        },
      };
    }
    if (requestBody.type) {
      whereClause.listed = {
        car: {
          some: {
            type: requestBody.type,
          },
        },
      };
    }

    if (requestBody.from && requestBody.to) {
      whereClause.from = {
        gte: new Date(requestBody.from),
      };
      whereClause.upTo = {
        lte: new Date(requestBody.to),
      };
    } else if (requestBody.from) {
      whereClause.from = {
        gte: new Date(requestBody.from),
      };
    } else if (requestBody.to) {
      whereClause.upTo = {
        lte: new Date(requestBody.to),
      };
    }

    // Get all listings if no query params are provided
    const listings = await prisma.listing.findMany({
      where: whereClause,
      include: {
        listed: {
          include: {
            car: requestBody.type
              ? {
                  where: {
                    type: requestBody.type,
                  },
                }
              : true,
          },
        },
      },
    });

    // Filter out listings that don't match the car type if specified
    const filteredListings = requestBody.type
      ? listings.filter((listing) =>
          listing.listed.car.some((car) => car.type === requestBody.type)
        )
      : listings;

    return NextResponse.json(filteredListings, { status: 200 });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestBody: CreateListingInterface = await request.json();
    // Validation
    const validation = createListingSchema.safeParse(requestBody);
    if (!validation.success)
      return NextResponse.json(
        { message: validation.error.message },
        { status: 400 }
      );

    // Execute as transaction
    const newListing = await prisma.$transaction(async (prisma) => {
      const newLocation = await prisma.location.create({
        data: {
          city: requestBody.city,
          address: requestBody.address,
        },
      });

      const newListing = await prisma.listing.create({
        data: {
          from: new Date(requestBody.from),
          upTo: new Date(requestBody.upTo),
          pricing: new Prisma.Decimal(requestBody.pricing),
          listedBy: requestBody.listedBy,
          locationId: newLocation.id,
        },
      });

      return newListing;
    });

    return NextResponse.json(newListing, { status: 201 });
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const requestBody: PatchingListingInterface = await request.json();
    // Validation
    const validation = patchingListingSchema.safeParse(requestBody);
    if (!validation.success)
      return NextResponse.json({ message: validation.error }, { status: 400 });

    // Find the listing by ID
    const existingListing = await prisma.listing.findUnique({
      where: { id: requestBody.id },
      include: { location: true }, // Include location to check for changes
    });

    if (!existingListing) {
      return NextResponse.json(
        { error: `Listing with ID ${requestBody.id} not found` },
        { status: 404 }
      );
    }

    // Update the location if it has changed
    let updatedLocationId = existingListing.location.id;
    if (
      requestBody.city !== existingListing.location.city ||
      requestBody.address !== existingListing.location.address
    ) {
      const newLocation = await prisma.location.create({
        data: {
          city: requestBody.city,
          address: requestBody.address,
        },
      });
      updatedLocationId = newLocation.id;
    }

    // Update the listing
    const updateData: Prisma.ListingUpdateInput = {
      from: requestBody.from ? new Date(requestBody.from) : undefined,
      upTo: requestBody.upTo ? new Date(requestBody.upTo) : undefined,
      pricing: requestBody.pricing
        ? new Prisma.Decimal(requestBody.pricing)
        : undefined,
      location: { connect: { id: updatedLocationId } },
    };

    const updatedListing = await prisma.listing.update({
      where: { id: requestBody.id },
      data: updateData,
    });

    return NextResponse.json(updatedListing, { status: 200 });
  } catch (error) {
    console.error("Error updating listing:", error);
    return NextResponse.json(
      { error: "Failed to update listing" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const requestBody: { id: string } = await request.json();

    // Check if item exists
    const foundListing = await prisma.listing.findUnique({
      where: {
        id: requestBody.id,
      },
    });

    if (!foundListing) {
      return NextResponse.json("Listing does not exist", { status: 404 });
    }

    // Delete the listing
    await prisma.listing.delete({
      where: { id: requestBody.id },
    });

    return NextResponse.json({}, { status: 204 });
  } catch (error) {
    console.error("Error deleting listing:", error);
    return NextResponse.json(
      { error: "Failed to delete listing" },
      { status: 500 }
    );
  }
}

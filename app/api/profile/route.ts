import { NextRequest, NextResponse } from "next/server";
import { Profile, ProfileSchema } from "./schema";
import prisma from "@/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const requestBody: Profile = await request.json();
    //get id from search params
    const id = new URL(request.url).searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // 1. Validation
    const validation = ProfileSchema.safeParse(requestBody);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors },
        { status: 400 }
      );
    }

    // 2. Check if user exists
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (!user) {
      return NextResponse.json(
        { message: "User doesn't exist" },
        { status: 404 }
      );
    }
    //2.1 Check if profile already exists
    const profile = await prisma.profile.findFirst({
      where: {
        id,
      },
    });

    if (profile)
      return NextResponse.json("profile already exisits", { status: 400 });

    // 3. Create Profile and Location atomically
    const result = await prisma.$transaction(async (transaction) => {
      let locationId = null;

      // Create location if details are provided
      if (requestBody.city && requestBody.address) {
        const location = await transaction.location.create({
          data: {
            address: requestBody.address,
            city: requestBody.city,
          },
        });
        locationId = location.id;
      }

      // Create Profile
      const newProfile = await transaction.profile.create({
        data: {
          id: id,
          name: requestBody.name,
          bio: requestBody.bio ? requestBody.bio : null,
          locationId: locationId,
          profilePicture: requestBody.profilePicture
            ? requestBody.profilePicture
            : null,
        },
      });

      return newProfile;
    });

    // 4. Return the newly created profile
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.log("Unexpected error occured", error);
    return NextResponse.json(
      { error: `Unexpected error occured: ${error}` },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const requestBody: Profile = await request.json();

    //get id from search params
    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // 1. Validation
    const validation = ProfileSchema.safeParse(requestBody);
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors },
        { status: 400 }
      );
    }

    // 2. Check if user exists
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
    });
    if (!user) {
      return NextResponse.json(
        { message: "User doesn't exist" },
        { status: 404 }
      );
    }

    // 3. Check if profile exists
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

    // 4. Update Location and Profile atomically
    const result = await prisma.$transaction(async (transaction) => {
      let locationId = profile.locationId;

      // Update location if details are provided
      if (requestBody.city && requestBody.address) {
        if (locationId) {
          await transaction.location.update({
            where: {
              id: locationId,
            },
            data: {
              address: requestBody.address,
              city: requestBody.city,
            },
          });
        } else {
          const location = await transaction.location.create({
            data: {
              address: requestBody.address,
              city: requestBody.city,
            },
          });
          locationId = location.id;
        }
      }

      const updateData: any = {};
      if (requestBody.name !== undefined) updateData.name = requestBody.name;
      if (requestBody.bio !== undefined) updateData.bio = requestBody.bio;
      if (requestBody.profilePicture !== undefined)
        updateData.profilePicture = requestBody.profilePicture;
      if (locationId !== null) updateData.locationId = locationId;

      // Update Profile
      const updatedProfile = await transaction.profile.update({
        where: {
          id,
        },
        data: updateData,
      });

      return updatedProfile;
    });

    // 5. Return the updated profile
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log("Unexpected error occured", error);
    return NextResponse.json(
      { error: `Unexpected error occured: ${error}` },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    //get id from search params
    const userId = new URL(request.url).searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Check if the user exists
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User doesn't exist" },
        { status: 404 }
      );
    }

    // Fetch the profile along with the location details
    const profile = await prisma.profile.findFirst({
      where: {
        id: userId,
      },
      include: {
        location: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { message: "Profile doesn't exist" },
        { status: 404 }
      );
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.log("Unexpected error occurred", error);
    return NextResponse.json(
      { error: `Unexpected error occurred: ${error}` },
      { status: 500 }
    );
  }
}

import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import {
  createProfileSchema,
  editProfileInterface,
  editProfileSchema,
} from "./schema";

interface RequestDataInterface {
  userId: string;
  loggedIn: boolean;
}

export async function GET(request: NextRequest) {
  try {
    // Parse the request body
    const requestBody: RequestDataInterface = await request.json();

    // Validate request data
    if (!requestBody.loggedIn) {
      return NextResponse.json("User not logged in.", { status: 401 });
    }

    if (!requestBody.userId) {
      return NextResponse.json("User ID is required.", { status: 400 });
    }

    // Get user profile with the given ID
    const response = await prisma.profile.findUnique({
      where: {
        id: requestBody.userId,
      },
    });

    // Check if profile exists
    if (!response) {
      return NextResponse.json("Profile does not exist", { status: 404 });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Error in GET /profile:", error);
    return NextResponse.json("An unexpected error occurred.", { status: 500 });
  }
}

interface CreateProfileInterface {
  userId: string;
  name: string;
  profilePicture?: string;
  bio?: string;
  city?: string;
  address?: string;
  proofOfesidence?: string;
  proofOfIdentity?: string;
}

export async function POST(request: NextRequest) {
  try {
    const requestBody: CreateProfileInterface = await request.json();

    // Validate request data
    const validation = createProfileSchema.safeParse(requestBody);

    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }

    //does user exist
    const user = await prisma.user.findUnique({
      where: {
        id: requestBody.userId,
      },
    });

    if (!user) {
      return NextResponse.json("User does not exist", { status: 404 });
    }
    // Create location if city is provided
    if (requestBody.city) {
      const location = await prisma.location.create({
        data: {
          city: requestBody.city!,
          address: requestBody.address || "",
        },
      });

      // Create profile
      const profile = await prisma.profile.create({
        data: {
          id: requestBody.userId,
          name: requestBody.name,
          profilePicture: requestBody.profilePicture || "",
          bio: requestBody.bio || "",
          proofOfResidence: requestBody.proofOfesidence || "",
          proofOfIdentity: requestBody.proofOfIdentity || "",
          locationId: location.id,
        },
      });

      return NextResponse.json(profile, { status: 201 });
    }
  } catch (error) {
    console.error("Error in POST /profile:", error);
    return NextResponse.json("An unexpected error occurred.", { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const requestData: editProfileInterface = await request.json();

    //validation
    const validation = editProfileSchema.safeParse(requestData);

    if (!validation.success) {
      return NextResponse.json(validation.error, { status: 400 });
    }
    // does user exist
    const user = await prisma.user.findUnique({
      where: {
        id: requestData.userId,
      },
    });

    if (!user) {
      return NextResponse.json("User does not exist", { status: 404 });
    }

    // Update location if city is provided
    if (requestData.city) {
      const location = await prisma.location.create({
        data: {
          city: requestData.city!,
          address: requestData.address || "",
        },
      });
      //Update profile
      const profile = await prisma.profile.update({
        where: {
          id: requestData.userId,
        },
        data: {
          profilePicture: requestData.profilePicture || "",
          bio: requestData.bio || "",
          proofOfResidence: requestData.proofOfResidence || "",
          proofOfIdentity: requestData.proofOfIdentity || "",
          locationId: location.id,
        },
      });

      return NextResponse.json(profile, { status: 200 });
    }
  } catch (error) {
    console.error("Error in PATCH /profile:", error);
    return NextResponse.json("An unexpected error occurred.", { status: 500 });
  }
}

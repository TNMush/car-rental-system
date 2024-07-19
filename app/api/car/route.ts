import { NextRequest, NextResponse } from "next/server";
import { Car, carSchema } from "./schema";
import prisma from "@/prisma/client";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();

    //Validate the request body

    const validation = carSchema.safeParse(requestBody);
    if (!validation.success) {
      return NextResponse.json(validation.error.message, { status: 400 });
    }

    //Does profile exist?
    const profile = await prisma.profile.findFirst({
      where: {
        id: requestBody.id,
      },
    });

    if (!profile) {
      return NextResponse.json("Profile does not exist", { status: 404 });
    }

    //Does car already exist?
    const existingCar = await prisma.car.findFirst({
      where: {
        id: requestBody.id,
      },
    });

    if (existingCar) {
      return NextResponse.json("Car already exists", { status: 400 });
    }

    //Create new car
    const newCar = await prisma.car.create({
      data: {
        id: requestBody.id,
        ownerId: requestBody.ownerId,
        make: requestBody.make,
        model: requestBody.model,
        year: requestBody.year,
        type: requestBody.type,
        color: requestBody.color,
        regNumber: requestBody.regNumber,
        frontView: requestBody.frontView,
        backView: requestBody.backView,
        sideView: requestBody.sideView,
        interiorView1: requestBody.interiorView1,
        interiorView2: requestBody.interiorView2 || null,
        interiorView3: requestBody.interiorView3 || null,
      },
    });

    return NextResponse.json(newCar, { status: 201 });
  } catch (error) {
    console.error("Error in login endpoint:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Build a dynamic where clause based on query parameters
    const whereClause: { [key: string]: string | number } = {};

    if (searchParams.has("id")) {
      whereClause.id = searchParams.get("id")!;
    }
    if (searchParams.has("color")) {
      whereClause.color = searchParams.get("color")!;
    }
    if (searchParams.has("year")) {
      whereClause.year = parseInt(searchParams.get("year")!);
    }
    if (searchParams.has("model")) {
      whereClause.model = searchParams.get("model")!;
    }
    if (searchParams.has("make")) {
      whereClause.make = searchParams.get("make")!;
    }
    if (searchParams.has("type")) {
      whereClause.type = searchParams.get("type")!;
    }

    // If no search parameters are provided, return all cars
    if (Object.keys(whereClause).length === 0) {
      const cars = await prisma.car.findMany();
      return NextResponse.json(cars, { status: 200 });
    }

    // Otherwise, search for cars based on the where clause
    const car = await prisma.car.findMany({
      where: whereClause,
    });

    if (car.length === 0) {
      return NextResponse.json("Car does not exist", { status: 404 });
    }

    return NextResponse.json(car, { status: 200 });
  } catch (error) {
    console.error("Error in GET endpoint:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const requestBody = await request.json();

    if (requestBody.id === undefined) {
      return NextResponse.json("Car id is required", { status: 400 });
    }

    //Does car exist?
    const car = await prisma.car.findFirst({
      where: {
        id: requestBody.id,
      },
    });

    if (!car) {
      return NextResponse.json("Car does not exist", { status: 404 });
    }

    //Update car
    const updateData: Partial<Car> = {}; // Use Partial<Car> for type safety

    if (requestBody.make !== undefined) {
      updateData.make = requestBody.make;
    }

    if (requestBody.model !== undefined) {
      updateData.model = requestBody.model;
    }
    if (requestBody.year !== undefined) {
      updateData.year = requestBody.year;
    }
    if (requestBody.type !== undefined) {
      updateData.type = requestBody.type;
    }
    if (requestBody.color !== undefined) {
      updateData.color = requestBody.color;
    }
    if (requestBody.regNumber !== undefined) {
      updateData.regNumber = requestBody.regNumber;
    }
    if (requestBody.frontView !== undefined) {
      updateData.frontView = requestBody.frontView;
    }
    if (requestBody.backView !== undefined) {
      updateData.backView = requestBody.backView;
    }
    if (requestBody.sideView !== undefined) {
      updateData.sideView = requestBody.sideView;
    }
    if (requestBody.interiorView3 !== undefined) {
      // Ensure optional interiorView3 is handled
      updateData.interiorView3 = requestBody.interiorView3 || null;
    }
    const updatedCar = await prisma.car.update({
      where: {
        id: requestBody.id,
      },
      data: updateData,
    });

    return NextResponse.json(updatedCar, { status: 200 });
  } catch (error) {
    console.error("Error in login endpoint:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const requestBody = await request.json();

    if (requestBody.id === undefined) {
      return NextResponse.json("Car id is required", { status: 400 });
    }

    //Does car exist?
    const car = await prisma.car.findFirst({
      where: {
        id: requestBody.id,
      },
    });

    if (!car) {
      return NextResponse.json("Car does not exist", { status: 404 });
    }

    //Delete car
    await prisma.car.delete({
      where: {
        id: requestBody.id,
      },
    });

    return NextResponse.json("Car deleted", { status: 200 });
  } catch (error) {
    console.error("Error in login endpoint:", error);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}

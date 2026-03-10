import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/mongodb";

const emailPattern =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const databaseName = process.env.MONGODB_DB || "wedding";
const collectionName = process.env.MONGODB_RSVP_COLLECTION || "rsvps";

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, attending, guests } = await request.json();

    if (!email || !emailPattern.test(String(email).trim())) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const client = await getMongoClient();
    const db = client.db(databaseName);
    const collection = db.collection(collectionName);

    const guestEntries =
      Array.isArray(guests) && guests.length
        ? guests.map((g: any) => ({
            name: g?.name?.toString().trim() || "",
            meal: g?.meal?.toString().trim() || "",
            note: g?.note?.toString().trim() || "",
          }))
        : [];

    await collection.insertOne({
      firstName: firstName?.toString().trim() || "",
      lastName: lastName?.toString().trim() || "",
      email: normalizedEmail,
      attending: attending?.toString().trim() || "",
      guests: guestEntries,
      createdAt: new Date(),
    });

    return NextResponse.json({
      ok: true,
      message: "RSVP received. Thank you!",
    });
  } catch (error) {
    console.error("RSVP API error", error);
    return NextResponse.json(
      { error: "We couldn't save that right now. Please try again shortly." },
      { status: 500 },
    );
  }
}

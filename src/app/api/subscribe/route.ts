import { NextResponse } from "next/server";
import { getMongoClient } from "@/lib/mongodb";

const emailPattern =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const databaseName = process.env.MONGODB_DB || "wedding";
const collectionName = process.env.MONGODB_COLLECTION || "updates";

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    if (!email || !emailPattern.test(String(email).trim())) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const normalizedName =
      typeof name === "string" && name.trim().length > 0
        ? name.trim()
        : undefined;
    const client = await getMongoClient();
    const db = client.db(databaseName);
    const collection = db.collection(collectionName);

    const existing = await collection.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json({
        ok: true,
        message: "You're already on the list. Thank you!",
      });
    }

    await collection.insertOne({
      email: normalizedEmail,
      name: normalizedName,
      source: "splash",
      createdAt: new Date(),
    });

    return NextResponse.json({
      ok: true,
      message: "You're on the list. We'll send updates soon.",
    });
  } catch (error) {
    console.error("Subscribe API error", error);
    return NextResponse.json(
      { error: "We couldn't save that right now. Please try again shortly." },
      { status: 500 },
    );
  }
}

import mongoose from "mongoose";
import { PlayModel } from "../infrastructure/presistence/mongoose/models/play.model";

async function seedPlays() {
  await mongoose.connect(process.env.MONGO_URL!);

  const artistPraveen = new mongoose.Types.ObjectId(
    "697b46ed36a7c0b938dd93b2"
  );

  const artistRahman = new mongoose.Types.ObjectId(
    "697b4bbb6bc021d31be44044"
  );

  const userId = new mongoose.Types.ObjectId();
  const songId = new mongoose.Types.ObjectId();

  const plays: any[] = [];

  // 🔹 Artist Praveen → 40 plays
  for (let i = 0; i < 40; i++) {
    plays.push({
      userId,
      songId,
      artistId: artistPraveen,
      playedAt: new Date("2026-01-15T10:00:00Z"),
      duration: 180,
    });
  }

  // 🔹 AR Rahman → 90 plays
  for (let i = 0; i < 90; i++) {
    plays.push({
      userId,
      songId,
      artistId: artistRahman,
      playedAt: new Date("2026-01-20T12:00:00Z"),
      duration: 210,
    });
  }

  await PlayModel.insertMany(plays);

  console.log("✅ Dummy plays inserted successfully");
  process.exit();
}

seedPlays().catch(console.error);

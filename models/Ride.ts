// models/Ride.ts

import mongoose, { Document, Model, Schema } from "mongoose";

export interface IRide extends Document {
  pickupLocation: string;
  dropoffLocation: string;
  departureTime: Date;
  seats: number;
  vehicleType: string;
  vehicleNumber: string;
  status: string;
  bookedBy: mongoose.Types.ObjectId[];
}

const rideSchema: Schema = new Schema({
  pickupLocation: { type: String, required: true },
  dropoffLocation: { type: String, required: true },
  departureTime: { type: Date, required: true },
  seats: { type: Number, required: true },
  vehicleType: { type: String, required: true },
  vehicleNumber: { type: String, required: true },
  status: { type: String, default: "active" },
  bookedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Ride: Model<IRide> = mongoose.models.Ride || mongoose.model("Ride", rideSchema);
export default Ride;

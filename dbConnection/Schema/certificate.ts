import mongoose, { Schema, type Model } from "mongoose";

export interface CertificateDocument {
  name: string;
  fatherName: string;
  course: string;
  semester: string;
  collegeName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const certificateSchema = new Schema<CertificateDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    fatherName: {
      type: String,
      required: true,
      trim: true,
    },
    course: {
      type: String,
      required: true,
      trim: true,
    },
    semester: {
      type: String,
      required: true,
      trim: true,
    },
    collegeName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const CertificateModel =
  (mongoose.models.Certificate as Model<CertificateDocument>) ||
  mongoose.model<CertificateDocument>("Certificate", certificateSchema);

export default CertificateModel;
import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    degree: { type: String, required: true },
    institute: { type: String, required: true },
    year: { type: String, required: true },
    details: { type: String, required: true }
  },
  { _id: false }
);

const certificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    date: { type: String, required: true },
    url: { type: String, required: true },
    iconLabel: { type: String, required: true }
  },
  { _id: false }
);

const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true }
  },
  { _id: false }
);

const contactSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    url: { type: String, required: true },
    iconLabel: { type: String, required: true }
  },
  { _id: false }
);

const portfolioSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    role: { type: String, required: true },
    summary: { type: String, required: true },
    heroImageUrl: { type: String, required: true },
    cvUrl: { type: String, required: true },
    education: { type: [educationSchema], default: [] },
    certifications: { type: [certificationSchema], default: [] },
    achievements: { type: [achievementSchema], default: [] },
    contacts: { type: [contactSchema], default: [] }
  },
  { timestamps: true }
);

export const Portfolio = mongoose.model("Portfolio", portfolioSchema);

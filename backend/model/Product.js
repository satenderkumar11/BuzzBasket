const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    rating: { type: Number, min: 0, max: 5 },
    comment: { type: String },
    date: { type: Date },
    reviewerName: { type: String },
    reviewerEmail: { type: String },
  },
  { _id: false }
);

const dimensionsSchema = new Schema(
  {
    width: { type: Number },
    height: { type: Number },
    depth: { type: Number },
  },
  { _id: false }
);

const metaSchema = new Schema(
  {
    createdAt: { type: Date },
    updatedAt: { type: Date },
    barcode: { type: String },
    qrCode: { type: String },
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: [1, "wrong min price"] },
    discountPercentage: {
      type: Number,
      min: [1, "wrong min discount"],
      max: [99, "wrong max discount"],
    },
    rating: {
      type: Number,
      min: [0, "wrong min rating"],
      max: [5, "wrong max rating"],
      default: 0,
    },
    stock: { type: Number, min: [0, "wrong min stock"], default: 0 },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    thumbnail: { type: String, required: true },
    images: { type: [String], required: true },
    deleted: { type: Boolean, default: false },

    // New fields
    tags: { type: [String] },
    sku: { type: String },
    weight: { type: Number },
    dimensions: dimensionsSchema,
    warrantyInformation: { type: String },
    shippingInformation: { type: String },
    availabilityStatus: { type: String },
    reviews: [reviewSchema],
    returnPolicy: { type: String },
    minimumOrderQuantity: { type: Number },
    meta: metaSchema,
  },
  { timestamps: true }
);

exports.Product = mongoose.model("Product", productSchema);

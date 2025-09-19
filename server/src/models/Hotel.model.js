import mongoose from "mongoose";

// ------------------- Image Schema -------------------
const ImageSchema = new mongoose.Schema({
  publicId: { type: String, required: true }, // Cloudinary public_id
  url: { type: String, required: true }, // default secure_url at upload
  altText: { type: String },
  isCover: { type: Boolean, default: false }, // true = cover image
}, { timestamps: true });

// ------------------- Room Schema -------------------
const RoomSchema = new mongoose.Schema({
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
  roomType: { type: String, required: true }, // e.g., Deluxe, Suite, Standard
  pricePerNight: { type: Number, required: true },
  capacity: { type: Number, required: true }, // number of people
  totalRooms: { type: Number, required: true },
  availableRooms: { type: Number, required: true },
  amenities: [{ type: String }],
  images: [ImageSchema],
}, { timestamps: true });

// ------------------- Hotel Schema -------------------
const HotelSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
  name: { type: String, required: true },
  description: { type: String },
  address: { type: String, required: true },
  city: { type: String, required: true, index: true },
  state: { type: String },
  country: { type: String, default: "India" },
  location: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], index: "2dsphere" },
  },

  // Homepage ranking factors
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  adsPurchased: { type: Boolean, default: false },
  adExpiry: { type: Date },

  images: [ImageSchema], // hotel images (cover, gallery)

  slug: { type: String, unique: true, index: true },
}, { timestamps: true });

// Optimize homepage queries
HotelSchema.index({ adsPurchased: -1, isFeatured: -1, rating: -1 });

export const Hotel = mongoose.model("Hotel", HotelSchema);
export const Room = mongoose.model("Room", RoomSchema);
export const Image = mongoose.model("Image", ImageSchema);

// //{
//   "_id": "66ef1b2a9f1c3a001e8d9a01",
//   "seller": "66ef1a9b9f1c3a001e8d98f5",
//   "name": "The Grand Palace Hotel",
//   "description": "Luxury 5-star hotel with world-class amenities, located in the heart of Jaipur.",
//   "address": "MI Road, Jaipur, Rajasthan",
//   "city": "Jaipur",
//   "state": "Rajasthan",
//   "country": "India",
//   "location": {
//     "type": "Point",
//     "coordinates": [75.7873, 26.9124]
//   },
//   "rating": 4.6,
//   "totalReviews": 348,
//   "isFeatured": true,
//   "adsPurchased": true,
//   "adExpiry": "2025-12-31T23:59:59.000Z",
//   "slug": "the-grand-palace-hotel",
//   "images": [
//     {
//       "publicId": "hotels/grand-palace/cover123",
//       "url": "https://res.cloudinary.com/demo/image/upload/v1699999999/hotels/grand-palace/cover123.jpg",
//       "altText": "Grand Palace Hotel - Main Entrance",
//       "isCover": true
//     },
//     {
//       "publicId": "hotels/grand-palace/lobby456",
//       "url": "https://res.cloudinary.com/demo/image/upload/v1699999999/hotels/grand-palace/lobby456.jpg",
//       "altText": "Hotel Lobby",
//       "isCover": false
//     }
//   ],
//   "createdAt": "2025-09-19T10:20:00.000Z",
//   "updatedAt": "2025-09-19T10:20:00.000Z"
// }


/**
 * {
  "_id": "66ef1b9d9f1c3a001e8d9a05",
  "hotel": "66ef1b2a9f1c3a001e8d9a01",
  "roomType": "Deluxe Suite",
  "pricePerNight": 7500,
  "capacity": 3,
  "totalRooms": 20,
  "availableRooms": 15,
  "amenities": ["wifi", "air conditioning", "tv", "balcony"],
  "images": [
    {
      "publicId": "rooms/deluxe-suite/cover001",
      "url": "https://res.cloudinary.com/demo/image/upload/v1699999999/rooms/deluxe-suite/cover001.jpg",
      "altText": "Deluxe Suite - King Bed",
      "isCover": true
    },
    {
      "publicId": "rooms/deluxe-suite/bathroom002",
      "url": "https://res.cloudinary.com/demo/image/upload/v1699999999/rooms/deluxe-suite/bathroom002.jpg",
      "altText": "Deluxe Suite Bathroom",
      "isCover": false
    }
  ],
  "createdAt": "2025-09-19T10:22:00.000Z",
  "updatedAt": "2025-09-19T10:22:00.000Z"
}

 */
/**
 * {
  "_id": "66ef1bce9f1c3a001e8d9a0a",
  "hotel": "66ef1b2a9f1c3a001e8d9a01",
  "publicId": "hotels/grand-palace/pool789",
  "url": "https://res.cloudinary.com/demo/image/upload/v1699999999/hotels/grand-palace/pool789.jpg",
  "altText": "Outdoor Swimming Pool",
  "isCover": false,
  "createdAt": "2025-09-19T10:23:00.000Z",
  "updatedAt": "2025-09-19T10:23:00.000Z"
}

 */
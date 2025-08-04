import { Schema } from 'mongoose';

/**
 * Mongoose schema for User collection.
 * Defines the structure and constraints for user documents in MongoDB.
 */
export const UserSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    _id: false, // Disables automatic _id generation since we provide our own
    versionKey: false, // Disables __v version field
    collection: 'users', // Sets collection name explicitly
  },
);

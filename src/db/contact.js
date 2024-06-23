import { model, Schema } from 'mongoose';

const contactsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      optional: true,
    },
    isFavourite: {
      type: Boolean,
      default: false,
    },
    contactType: {
      type: String,
      enum: ['work', 'home', 'personal'],
      required: true,
      default: 'personal',
    },
    // parentId: { type: Schema.ObjectId, required: true },
    photo: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Contact = model('contacts', contactsSchema);

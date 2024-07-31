import { Schema, Types } from 'mongoose';

export interface SharedTaskDB {
  _id: Types.ObjectId;
  task: Types.ObjectId;
  account: Types.ObjectId;
  active: boolean;
}

export const SharedTaskDBSchema: Schema = new Schema<SharedTaskDB>(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      index: true,
      required: true,
    },

    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      index: true,
      required: true,
    },

    active: {
      type: Boolean,
      default: true,
    },

  },
  {
    collection: 'shared-tasks',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

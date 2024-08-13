import { Schema, Types } from 'mongoose';
import { ShareTaskRequestStatus } from '../../types';

export interface ShareTaskRequestDB  {
  _id: Types.ObjectId;
  task: Types.ObjectId;
  account: Types.ObjectId;
  status: ShareTaskRequestStatus;
}

export const ShareTaskRequestDBSchema: Schema = new Schema<ShareTaskRequestDB>(
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

    status: {
      type: String,
      enum: ShareTaskRequestStatus,
      required: true,
    },   
  },
  {
    collection: 'share-tasks-requests',
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  },
);

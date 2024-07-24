import { ApplicationError } from '../application';
import { HttpStatusCodes } from '../http';
import { Account } from '../account/types';

export class Comment {
  id: string;
  task: string;
  account: string | Account;
  comment: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    task: string,
    account: string | Account,
    comment: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.task = task;
    this.account = account;
    this.comment = comment;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

export interface CreateCommentParams {
  taskId: string;
  accountId: string;
  comment: string;
}

export interface UpdateCommentParams {
  taskId: string;
  commentId: string;
  accountId: string;
  comment: string;
}

export interface DeleteCommentParams {
  commentId: string;
  accountId: string;
}

export interface GetCommentParams {
  commentId: string;
  accountId: string;
}

export class CommentNotFoundError extends ApplicationError {
  code: string;

  constructor(commentId: string) {
    super(`Comment with commentId ${commentId} not found.`);
    this.code = 'COMMENT_NOT_FOUND';
    this.httpStatusCode = HttpStatusCodes.NOT_FOUND;
  }
}
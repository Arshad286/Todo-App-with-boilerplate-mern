import { ApplicationError } from '../application';
import { HttpStatusCodes } from '../http';
import { Task } from '../task/types';
import { Account } from '../account/types';

export class ShareTaskRequest  {
  id: string;
  task: string | Task;
  account: string | Account;
}

export type CreateShareTaskRequestParams = {
  taskId: string;
  accountId: string;
};

export type CreateShareTasksRequestParams = {
  taskId: string;
  accountIds: string[];
};

export type GetAllShareTasksRequestParams = {
  accountId: string,
  page: number,
  size: number,
};

export enum ShareTaskRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECT = 'reject',
}

export class ShareTaskRequestNotFoundError extends ApplicationError {
  code: string;

  constructor(shareTaskRequestId: string) {
    super(`Share task with ID ${shareTaskRequestId} not found.`);
    this.code = 'SHARE_TASK_NOT_FOUND';
    this.httpStatusCode = HttpStatusCodes.NOT_FOUND;
  }
}

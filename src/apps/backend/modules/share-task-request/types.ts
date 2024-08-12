import { ApplicationError } from '../application';
import { HttpStatusCodes } from '../http';
import { Task } from '../task/types';
import { Account } from '../account/types';

export class ShareTaskRequest  {
  id: string;
  task: string | Task;
  account: string | Account;
  status: ShareTaskRequestStatus;
}

export type CreateShareTaskRequestParams = {
  taskId: string;
  accountId: string;
  status: ShareTaskRequestStatus;
};

export type CreateShareTasksRequestParams = {
  taskId: string;
  accountIds: string[];
  status: ShareTaskRequestStatus;
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

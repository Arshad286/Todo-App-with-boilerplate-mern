import { Account } from '../account';
import { ApplicationError } from '../application';
import { HttpStatusCodes } from '../http';
import { Task } from '../task/types';

export class ShareTask {
  id: string;
  task: Task;
  account: string | Account;

  constructor(id: string, task: Task, account: Account) {
    this.id = id;
    this.task = task;
    this.account = account;
  }
}

export interface CreateSharedTaskParmas {
  taskId: string;
  accountId: string;
}

export interface CreateSharedTasksParams {
  taskId: string;
  accountIds: string[];
}

export interface GetSharedTaskParams {
  shareTaskId: string;
  accountId: string;
}

export interface GetAllSharedTaskParams {
  accountId: string;
}

export class SharedTaskNotFoundError extends ApplicationError {
  code: string;

  constructor(shareTaskId: string) {
    super(`Shared task with ID ${shareTaskId} not found`);
    this.code = 'SHARED_TASK_NOT_FOUND';
    this.httpStatusCode = HttpStatusCodes.NOT_FOUND;
  }
}

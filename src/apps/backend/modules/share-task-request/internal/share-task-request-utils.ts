import { ShareTaskRequest } from '../types';
import { ShareTaskRequestDB } from './store/share-task-request-db';
import { Task } from '../../task/types';
import { Account } from '../../account/types';
import { Types } from 'mongoose';

export default class ShareTaskRequestUtil {
  public static convertShareTaskDBRequestToShareTaskRequest(
    shareTaskRequestDb: ShareTaskRequestDB,
  ): ShareTaskRequest {
    return {
      id: shareTaskRequestDb._id.toString(),
      task: this.convertTask(shareTaskRequestDb.task),
      account: this.convertAccount(shareTaskRequestDb.account),
    } as ShareTaskRequest;
  }

  private static convertTask(task: Types.ObjectId | Task): string | Task {
    if (Types.ObjectId.isValid(task.toString())) {
      return task.toString();
    } else {
      const taskData = task as Task;
      return {
        id: taskData.id,
        account: taskData.account,
        description: taskData.description,
        title: taskData.title,
      };
    }
  }

  private static convertAccount(
    accountDb: Types.ObjectId | Account,
  ): string | Account {
    if (Types.ObjectId.isValid(accountDb.toString())) {
      return accountDb.toString();
    } else {
      const account = accountDb as Account;
      return {
        id: account.id,
        firstName: account.firstName,
        lastName: account.lastName,
        username: account.username,
        hashedPassword: account.hashedPassword,
        phoneNumber: account.phoneNumber,
      };
    }
  }
}

import { ShareTaskRequest } from '../types';
import { ShareTaskRequestDB } from './store/share-task-request-db';
import { Task } from '../../task/types';
import { Account } from '../../account/types';
import { Types } from 'mongoose';

export default class ShareTaskRequestUtil {
  public static convertShareTaskDBRequestToShareTaskRequest(
    shareTaskRequestDb: ShareTaskRequestDB,
  ): ShareTaskRequest {
    const shareTaskRequest = new ShareTaskRequest();
    shareTaskRequest.id = shareTaskRequestDb._id.toString();

    if (Types.ObjectId.isValid(shareTaskRequestDb.task.toString())) {
      shareTaskRequest.task = shareTaskRequestDb.task.toString();
    } else {
      shareTaskRequest.task = ShareTaskRequestUtil.convertTask(shareTaskRequestDb.task);
    }

    shareTaskRequest.account = ShareTaskRequestUtil.convertAccount(shareTaskRequestDb.account);
    shareTaskRequest.status = shareTaskRequestDb.status;
    return shareTaskRequest;
  }

  private static convertTask(task: Types.ObjectId | Task): string | Task {
    if (Types.ObjectId.isValid(task.toString())) {
      return task.toString();
    } else {
      const tsk = task as Task;
      return {
        id: tsk.id,
        account: tsk.account,
        description: tsk.description,
        title: tsk.title,
      } as Task;
    }
  }

  private static convertAccount(
    account: Types.ObjectId | Account,
  ): string | Account {
    if (Types.ObjectId.isValid(account.toString())) {
      return account.toString();
    } else {
      const acc = account as Account;
      return {
        id: acc.id,
        firstName: acc.firstName,
        lastName: acc.lastName,
        username: acc.username,
        hashedPassword: acc.hashedPassword,
        phoneNumber: acc.phoneNumber,
      } as Account;
    }
  }
}

import { SharedTask } from '../types';
import { SharedTaskDB } from './store/shared-task-db';
import { Task } from '../../task/types';
import { Account } from '../../account/types';
import { Types } from 'mongoose';

export default class SharedTaskUtil {
  public static convertSharedTaskDBToSharedTask(
    sharedTaskDb: SharedTaskDB,
  ): SharedTask {
    const sharedTask = new SharedTask();
    sharedTask.id = sharedTaskDb._id.toString();

    if (Types.ObjectId.isValid(sharedTaskDb.task.toString())) {
      sharedTask.task = sharedTaskDb.task.toString();
    } else {
      sharedTask.task = SharedTaskUtil.convertTask(sharedTaskDb.task);
    }

    sharedTask.account = SharedTaskUtil.convertAccount(sharedTaskDb.account);
    return sharedTask;
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

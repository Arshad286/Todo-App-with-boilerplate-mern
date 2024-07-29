import { ShareTask } from '../types';
import { SharedTaskDB } from './store/shared-task-db';
import { Types } from 'mongoose';

export default class SharedTaskUtil {
  public static convertSharedTaskDBToSharedTask(
    sharedTaskDb: SharedTaskDB,
  ): ShareTask {
    return {
      id: sharedTaskDb._id.toString(),
      task: this.convertTask(sharedTaskDb.task),
      account: sharedTaskDb.account.toString(),
    };
  }

  private static convertTask(task: Types.ObjectId | any): string | any {
    if (task instanceof Types.ObjectId) {
      return task.toString();
    } else {
      return task;
    }
  }
}

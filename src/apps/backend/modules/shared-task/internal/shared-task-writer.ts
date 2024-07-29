import { ShareTask, CreateSharedTaskParmas } from '../types';
import SharedTaskRepository from './store/shared-task-repository';
import SharedTaskUtil from './shared-task-utils';

export default class SharedTaskWriter {
  
  public static async createSharedTask(
    params:CreateSharedTaskParmas,
  ): Promise<ShareTask> {
 
      const newSharedTask = new SharedTaskRepository({
        task: params.taskId,
        account: params.accountId,
      });

      const createdSharedTask = await newSharedTask.save();
      return SharedTaskUtil.convertSharedTaskDBToSharedTask(createdSharedTask);
   
  }
}

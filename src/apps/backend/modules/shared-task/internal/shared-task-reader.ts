import {
    ShareTask,
   GetAllSharedTaskParams,
    SharedTaskNotFoundError,
    GetSharedTaskParams,
  } from '../types';
  import SharedTaskRepository from './store/shared-task-repository';
  import SharedTaskUtil from './shared-task-utils';
  
  export default class SharedTaskReader {
    public static async getSharedTaskForAccount(
      params: GetSharedTaskParams,
    ): Promise<ShareTask> {
      const sharedTask = await SharedTaskRepository.findOne({
        _id: params.shareTaskId,
        'task.account': params.accountId,
      });
  
      if (!sharedTask) {
        throw new SharedTaskNotFoundError(params.shareTaskId);
      }
  
      return SharedTaskUtil.convertSharedTaskDBToSharedTask(sharedTask);
    }

    public static async getSharedTasksForAccount(
      params: GetAllSharedTaskParams,
    ): Promise<ShareTask[]> {
      const sharedTasks = await SharedTaskRepository.find({
        account: params.accountId,
      }).populate('task.account');
  
      return sharedTasks.map((sharedTask) =>
        SharedTaskUtil.convertSharedTaskDBToSharedTask(sharedTask),
      );
    }
  }
  
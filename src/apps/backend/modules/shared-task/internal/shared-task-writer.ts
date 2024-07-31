import { SharedTask, CreateSharedTaskParams, DeleteSharedTaskParams } from '../types';

import SharedTaskRepository from './store/shared-task-repository';
import SharedTaskUtil from './shared-task-utils';
import SharedTaskReader from './shared-task-reader';

export default class SharedTaskWriter {
  public static async createSharedTask(
    params: CreateSharedTaskParams,
  ): Promise<SharedTask> {
    const createdSharedTask = await SharedTaskRepository.create({
      task: params.taskId,
      account: params.accountId,
    });
    return SharedTaskUtil.convertSharedTaskDBToSharedTask(createdSharedTask);
  }

  public static async deleteSharedTask(
    params: DeleteSharedTaskParams,
  ): Promise<void> {
    try {
      // Fetch the shared task to ensure it exists
      const sharedTask = await SharedTaskRepository.findOne({
        _id: params.sharedTaskId,
      });

      if (!sharedTask) {
        throw new Error('Shared task not found');
      }

      // Perform the deletion
      await SharedTaskRepository.deleteOne({
        _id: params.sharedTaskId,
      });

    } catch (error) {
      console.error('Error deleting shared task:', error);
      throw new Error(`Failed to delete shared task: ${error.message}`);
    }
  }
}

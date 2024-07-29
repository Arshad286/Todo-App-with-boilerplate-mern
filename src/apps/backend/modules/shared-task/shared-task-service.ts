import SharedTaskReader from './internal/shared-task-reader';
import SharedTaskWriter from './internal/shared-task-writer';
import {
  CreateSharedTaskParmas,
  GetAllSharedTaskParams,
  ShareTask,
} from './types';

export default class SharedTaskService {
  public static async createSharedTask(
    params: CreateSharedTaskParmas,
  ): Promise<ShareTask> {
    return await SharedTaskWriter.createSharedTask(params);
  }

  public static async getSharedTasksForAccount(
    params: GetAllSharedTaskParams,
  ): Promise<ShareTask[]> {
    return await SharedTaskReader.getSharedTasksForAccount(params);
  }
}

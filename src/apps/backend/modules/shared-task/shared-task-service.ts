import SharedTaskReader from './internal/shared-task-reader';
import SharedTaskWriter from './internal/shared-task-writer';
import {
  CreateSharedTaskParams,
  GetAllSharedTasksParams,
  SharedTask,
} from './types';

export default class SharedTaskService {
  public static async createSharedTask(
    params: CreateSharedTaskParams,
  ): Promise<SharedTask> {
    return SharedTaskWriter.createSharedTask(params);
  }

  public static async getSharedTasksForAccount(
    params: GetAllSharedTasksParams,
  ): Promise<SharedTask[]> {
    return SharedTaskReader.getSharedTasksForAccount(params);
  }

}

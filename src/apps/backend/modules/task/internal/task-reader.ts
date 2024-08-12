import { Types } from 'mongoose';
import {
  GetAllTaskParams,
  GetTaskParams,
  Task,
  TaskNotFoundError,
  PaginationParams,
  Query,
} from '../types';
import TaskRepository from './store/task-repository';
import TaskUtil from './task-util';
import SharedTaskRequestReader from '../../share-task-request/internal/share-task-request-reader';

export default class TaskReader {
  public static async getTaskForAccount(params: GetTaskParams): Promise<Task> {
    const taskId = new Types.ObjectId(params.taskId);

    const query: Query = {
      $or: [
        {
          account: params.accountId,
          active: true,
          _id: taskId,
        },
        {
          _id: taskId,
          sharedTask: true,
          active: true,
        },
      ],
    };

    const taskDb = await TaskRepository.findOne(query);

    if (!taskDb) {
      throw new TaskNotFoundError(params.taskId);
    }

    return TaskUtil.convertTaskDBToTask(taskDb);
  }

  public static async getTasksForAccount(
    params: GetAllTaskParams,
  ): Promise<Task[]> {
    const query: Query = {
      $or: [
        {
          account: params.accountId,
          active: true,
        },
        {
          _id: { $in: [] },
          active: true,
          sharedTask: true,
        },
      ],
    };

    if (params.sharedTask) {
      const approvedSharedTaskIds =
        await SharedTaskRequestReader.getApprovedSharedTasks(params.accountId);
      if (approvedSharedTaskIds.length > 0) {
        (query.$or[1] as { _id: { $in: Types.ObjectId[] } })._id.$in =
          approvedSharedTaskIds;
      } else {
        return [];
      }
    }

    const totalTasksCount = await TaskRepository.countDocuments(query);

    const paginationParams: PaginationParams = {
      page: params.page ? params.page : 1,
      size: params.size ? params.size : totalTasksCount,
    };
    const startIndex = (paginationParams.page - 1) * paginationParams.size;

    const tasksDb = await TaskRepository.find(query)
      .limit(paginationParams.size)
      .skip(startIndex);

    return tasksDb.map((taskDb) => TaskUtil.convertTaskDBToTask(taskDb));
  }
}

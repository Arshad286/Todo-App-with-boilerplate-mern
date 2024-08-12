import { Types } from 'mongoose';
import {
  GetAllTaskParams,
  GetTaskParams,
  Task,
  TaskNotFoundError,
  PaginationParams,
} from '../types';

import TaskRepository from './store/task-repository';
import TaskUtil from './task-util';
import SharedTaskRequestReader from '../../share-task-request/internal/share-task-request-reader';

export default class TaskReader {
  public static async getTaskForAccount(params: GetTaskParams): Promise<Task> {
    const taskDb = await TaskRepository.findOne({
      _id: params.taskId,
      account: params.accountId,
      sharedTask: params.sharedTask ?? true,
      active: true,
    });

    if (!taskDb) {
      throw new TaskNotFoundError(params.taskId);
    }

    return TaskUtil.convertTaskDBToTask(taskDb);
  }

  public static async getTasksForAccount(
    params: GetAllTaskParams,
  ): Promise<Task[]> {
    const query: {
      account: string;
      active: boolean;
      sharedTask?: boolean;
      _id?: { $in?: Types.ObjectId[] };
    } = {
      account: params.accountId,
      active: true,
    };

    if (params.sharedTask) {
      const approvedSharedTaskIds = await SharedTaskRequestReader.getApprovedSharedTasks(params.accountId);
      if (approvedSharedTaskIds.length > 0) {
        query._id = { $in: approvedSharedTaskIds };
      } else {
        return [];
      }
    } else {
      query.account = params.accountId;
      query.sharedTask = false;
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

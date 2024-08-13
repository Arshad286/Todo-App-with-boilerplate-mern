import { Types, FilterQuery } from 'mongoose';
import {
  GetAllTaskParams,
  GetTaskParams,
  Task,
  TaskNotFoundError,
  PaginationParams,
} from '../types';
import TaskRepository from './store/task-repository';
import TaskUtil from './task-util';
import {
  ShareTaskRequest,
  ShareTaskRequestService,
} from '../../share-task-request';
import { TaskDB } from './store/task-db';

export default class TaskReader {
  public static async getTaskForAccount(params: GetTaskParams): Promise<Task> {
    const taskId = new Types.ObjectId(params.taskId);

    const query: FilterQuery<TaskDB> = {
      $or: [
        {
          account: params.accountId,
          _id: taskId,
        },
        {
          _id: taskId,
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
    let query: FilterQuery<TaskDB> = {
      active: true,
    };

    const totalTasksCount = await TaskRepository.countDocuments(query);

    const paginationParams: PaginationParams = {
      page: params.page ? params.page : 1,
      size: params.size ? params.size : totalTasksCount,
    };

    if (params.sharedTask) {
      const shareTaskParams = {
        accountId: params.accountId,
        page: paginationParams.page,
        size: paginationParams.size,
      };

      const approvedSharedTaskRequests =
        await ShareTaskRequestService.getShareTaskRequest(shareTaskParams);

      if (approvedSharedTaskRequests.length > 0) {
        const approvedSharedTaskIds = approvedSharedTaskRequests.map(
          (request: ShareTaskRequest) => request.task,
        );

        query._id = { $in: approvedSharedTaskIds };
      } else {
        return [];
      }
    } else {
      query.account = params.accountId;
    }

    const startIndex = (paginationParams.page - 1) * paginationParams.size;

    const tasksDb = await TaskRepository.find(query)
      .limit(paginationParams.size)
      .skip(startIndex);

    return tasksDb.map((taskDb) => TaskUtil.convertTaskDBToTask(taskDb));
  }
}

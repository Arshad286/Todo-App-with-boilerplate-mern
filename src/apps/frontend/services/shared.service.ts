import { AccessToken, ApiResponse, ApiError } from '../types';
import APIService from './api.service';
import { SharedTask } from '../types/shared-task';

export default class SharedTaskService extends APIService {
  async shareTask(
    taskId: string,
    accountIds: string[],
  ): Promise<ApiResponse<void>> {
    const userAccessToken = JSON.parse(
      localStorage.getItem('access-token') || '{}'
    ) as AccessToken;
    try {
      await this.apiClient.post(
        '/shared-tasks/shared-task',
        { taskId, accountIds },
        {
          headers: {
            Authorization: `Bearer ${userAccessToken.token}`,
          },
        },
      );
      return new ApiResponse(undefined, undefined);
    } catch (e) {
      const error = e.response?.data || 'Unknown error';
      return new ApiResponse(undefined, new ApiError(error));
    }
  }

  async getSharedTasks(): Promise<ApiResponse<SharedTask[]>> {
    const userAccessToken = JSON.parse(
      localStorage.getItem('access-token') || '{}'
    ) as AccessToken;
    try {
      const response = await this.apiClient.get('/shared-tasks/shared-tasks', {
        headers: {
          Authorization: `Bearer ${userAccessToken.token}`,
        },
      });
      if (Array.isArray(response.data)) {
        const sharedTasks: SharedTask[] = response.data.map(
          (taskData: any) => new SharedTask(taskData),
        );
        return new ApiResponse(sharedTasks, undefined);
      } else {
        return new ApiResponse(undefined, new ApiError(response.data));
      }
    } catch (e) {
      const error = e.response?.data || 'Unknown error';
      return new ApiResponse(undefined, new ApiError(error));
    }
  }
}

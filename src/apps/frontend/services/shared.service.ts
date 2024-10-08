import { AccessToken, ApiResponse, ApiError } from '../types';
import APIService from './api.service';
import { SharedTask } from '../types/shared-task';
import { JsonObject } from '../types/common-types';


export default class SharedTaskService extends APIService {
  async shareTask(
    taskId: string,
    accountIds: string[],
  ): Promise<ApiResponse<SharedTask>> {
    const userAccessToken = JSON.parse(
      localStorage.getItem('access-token') || '{}'
    ) as AccessToken;
    try {
      await this.apiClient.post(
        `/tasks/${taskId}/share-task-requests`,
        { taskId, accountIds },
        {
          headers: {
            Authorization: `Bearer ${userAccessToken.token}`,
          },
        },
      );
      return new ApiResponse(undefined, undefined);
    } catch (e) {
      return new ApiResponse(undefined, new ApiError(e.response.data));
    }
  }

  async getSharedTasks(): Promise<ApiResponse<SharedTask[]>> {
    const userAccessToken = JSON.parse(
      localStorage.getItem('access-token') || '{}'
    ) as AccessToken;
    try {
      const response = await this.apiClient.get(`/tasks`, {
        headers: {
          Authorization: `Bearer ${userAccessToken.token}`,
        },
        params: {
          sharedTask: 'true',
        },
      });
    
      const sharedTasks: SharedTask[] = (response.data as JsonObject[]).map((taskData) => new SharedTask(taskData));
       return new ApiResponse(sharedTasks, undefined);
      
    } catch (e) {
      return new ApiResponse(undefined, new ApiError(e.response.data as JsonObject));
    }
  }
}

import ShareTaskRequestReader from './internal/share-task-request-reader';
import ShareTaskRequestWriter from './internal/share-task-request-writer';
import {
 CreateShareTaskRequestParams,
 GetAllShareTasksRequestParams,
  ShareTaskRequest,
} from './types';

export default class SharedTaskService {
  public static async createShareTaskRequest(
    params: CreateShareTaskRequestParams,
  ): Promise<ShareTaskRequest> {
    return ShareTaskRequestWriter.createShareTaskRequest(params);
  }

  public static async getShareTaskRequest(
    params: GetAllShareTasksRequestParams
  ): Promise<ShareTaskRequest[]> {
    return ShareTaskRequestReader.getDistinctApprovedSharedTaskRequestsByAccountId(params);
  }  
}

import ShareTaskRequestWriter from './internal/share-task-request-writer';
import {
 CreateShareTaskRequestParams,
ShareTaskRequest,
} from './types';

export default class SharedTaskService {
  public static async createShareTaskRequest(
    params: CreateShareTaskRequestParams,
  ): Promise<ShareTaskRequest> {
    return ShareTaskRequestWriter.createShareTaskRequest(params);
  }
}

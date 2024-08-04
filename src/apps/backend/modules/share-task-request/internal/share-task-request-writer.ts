import { ShareTaskRequest, CreateShareTaskRequestParams } from '../types';
import ShareTaskRequestRepository from './store/share-task-request-repository';
import ShareTaskRequestUtil from './share-task-request-utils';

export default class ShareTaskRequestWriter {
  public static async createShareTaskRequest(
    params: CreateShareTaskRequestParams,
  ): Promise<ShareTaskRequest> {
    const createShareTaskRequest = await ShareTaskRequestRepository.create({
      task: params.taskId,
      account: params.accountId,
      status: params.status,
    });
    return ShareTaskRequestUtil.convertShareTaskDBRequestToShareTaskRequest(createShareTaskRequest);
  }
}

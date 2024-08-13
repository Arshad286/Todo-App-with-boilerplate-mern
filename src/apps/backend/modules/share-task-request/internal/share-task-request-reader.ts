import ShareTaskRequestRepository from './store/share-task-request-repository';
import {
  ShareTaskRequest,
  ShareTaskRequestStatus,
  GetAllShareTasksRequestParams,
} from '../types';
import ShareTaskRequestUtil from './share-task-request-utils';

export default class ShareTaskRequestReader {
  public static async getDistinctApprovedSharedTaskRequestsByAccountId(
    params: GetAllShareTasksRequestParams,
  ): Promise<ShareTaskRequest[]> {
    const startIndex = (params.page - 1) * params.size;

    const shareTaskRequestsDb = await ShareTaskRequestRepository.find({
      account: params.accountId,
      status: ShareTaskRequestStatus.ACCEPTED,
    }).skip(startIndex)
      .limit(params.size)
      .exec();

    return shareTaskRequestsDb.map((shareTaskRequestsDb) =>
      ShareTaskRequestUtil.convertShareTaskDBRequestToShareTaskRequest(
        shareTaskRequestsDb,
      ),
    );
  }
}

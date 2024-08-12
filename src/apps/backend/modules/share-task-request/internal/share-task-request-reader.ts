import { Types } from 'mongoose';
import ShareTaskRequestRepository from './store/share-task-request-repository';
import { ShareTaskRequestStatus } from '../types';

export default class ShareTaskRequestReader {
  public static async getApprovedSharedTasks(accountId: string): Promise<Types.ObjectId[]> {
    return ShareTaskRequestRepository.find({
      account: accountId,
      status: ShareTaskRequestStatus.ACCEPTED,
      active: true,
    }).distinct('task');
  }
}

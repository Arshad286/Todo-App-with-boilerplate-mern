import { applicationController, Request, Response } from '../../application';
import { HttpStatusCodes } from '../../http';
import ShareTaskRequestService from '../share-task-Request-service';
import {
  ShareTaskRequest,
  CreateShareTasksRequestParams,
} from '../types';

import { serializeShareRequestTaskAsJSON } from './share-task-request-serializer';

export class ShareTaskRequestController {
  createShareRequestTask = applicationController(
    async (req: Request<CreateShareTasksRequestParams>, res: Response) => {
      const shareTasksRequest: ShareTaskRequest[] = await Promise.all(
        req.body.accountIds.map((accountId) =>
          ShareTaskRequestService.createShareTaskRequest({
            taskId: req.body.taskId,
            accountId,
            status: req.body.status,
          }),
        ),
      );
      const shareTasksRequestJSON = shareTasksRequest.map((shareTaskRequest) =>
        serializeShareRequestTaskAsJSON(shareTaskRequest),
      );

      res.status(HttpStatusCodes.CREATED).send(shareTasksRequestJSON);
    },
  );
}

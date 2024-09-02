import { applicationController, Request, Response } from '../../application';
import { HttpStatusCodes } from '../../http';
import ShareTaskRequestService from '../share-task-request-service';
import {
  ShareTaskRequest,
  CreateShareTasksRequestParams,
} from '../types';

import { serializeShareRequestTaskAsJSON } from './share-task-request-serializer';

export class ShareTaskRequestController {
  createShareTaskRequest = applicationController(
    async (req: Request<CreateShareTasksRequestParams>, res: Response) => {
      const { taskId, accountIds } = req.body;

      const shareTasksRequest: ShareTaskRequest[] = await Promise.all(
        accountIds.map((accountId) =>
          ShareTaskRequestService.createShareTaskRequest({
            taskId,
            accountId,
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

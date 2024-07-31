import { applicationController, Request, Response } from '../../application';
import { HttpStatusCodes } from '../../http';
import SharedTaskService from '../shared-task-service';
import {
  SharedTask,
  GetAllSharedTasksParams,
  CreateSharedTasksParams,
} from '../types';

import { serializeSharedTaskAsJSON } from './shared-task-serializer';

export class SharedTaskController {
  createSharedTask = applicationController(
    async (req: Request<CreateSharedTasksParams>, res: Response) => {
      const sharedTasks: SharedTask[] = await Promise.all(
        req.body.accountIds.map((accountId) =>
          SharedTaskService.createSharedTask({
            taskId: req.body.taskId,
            accountId,
          }),
        ),
      );
      const sharedTasksJSON = sharedTasks.map((sharedTask) =>
        serializeSharedTaskAsJSON(sharedTask),
      );

      res.status(HttpStatusCodes.CREATED).send(sharedTasksJSON);
    },
  );

  getSharedTasks = applicationController(
    async (req: Request, res: Response) => {
      const params: GetAllSharedTasksParams = {
        accountId: req.accountId,
      };

      const sharedTasks = await SharedTaskService.getSharedTasksForAccount(
        params,
      );
      const sharedTasksJSON = sharedTasks.map((sharedTask) =>
        serializeSharedTaskAsJSON(sharedTask),
      );

      res.status(HttpStatusCodes.OK).send(sharedTasksJSON);
    },
  );
}

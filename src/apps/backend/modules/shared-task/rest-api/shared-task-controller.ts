import { applicationController, Request, Response } from '../../application';
import { HttpStatusCodes } from '../../http';
import SharedTaskService from '../shared-task-service';
import { CreateSharedTasksParams } from '../types';
import { serializeSharedTaskAsJSON } from './shared-task-serializer';

export class SharedTaskController {
  private readonly sharedTaskService = SharedTaskService;
  private readonly serializeSharedTaskAsJSON = serializeSharedTaskAsJSON;

  createSharedTask = applicationController(
    async (req: Request<CreateSharedTasksParams>, res: Response) => {
      const sharedTasks = await Promise.all(
        req.body.accountIds.map((accountId) =>
          this.sharedTaskService.createSharedTask({
            taskId: req.body.taskId,
            accountId,
          }),
        ),
      );

      const sharedTasksJSON = sharedTasks.map(this.serializeSharedTaskAsJSON);

      res.status(HttpStatusCodes.CREATED).send(sharedTasksJSON);
    },
  );

  getSharedTasks = applicationController(
    async (req: Request, res: Response) => {
      const params = { accountId: req.accountId };

      const sharedTasks = await this.sharedTaskService.getSharedTasksForAccount(
        params,
      );

      const sharedTasksJSON = sharedTasks.map(this.serializeSharedTaskAsJSON);

      res.status(HttpStatusCodes.OK).send(sharedTasksJSON);
    },
  );
}

import { accessAuthMiddleware } from '../../access-token';
import { ApplicationRouter } from '../../application';
import { SharedTaskController } from './shared-task-controller';

export default class SharedTaskRouter extends ApplicationRouter {
  configure(): void {
    const { router } = this;
    const controller = new SharedTaskController();

    router.use(accessAuthMiddleware);

    router.post('/shared-task', controller.createSharedTask);
    router.get('/shared-tasks', controller.getSharedTasks);
  }
}

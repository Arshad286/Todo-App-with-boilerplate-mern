import { ApplicationServer } from '../../application';

import SharedTaskRouter from './shared-task-router';

export default class SharedTaskServer extends ApplicationServer {
  configure(): void {
    const { server } = this;
    const router = new SharedTaskRouter();

    server.use('/shared-tasks', router.router);
  }
}

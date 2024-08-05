import chai, { expect } from 'chai';
import { AccessToken } from '../../../src/apps/backend/modules/access-token';
import { createAccount } from '../../helpers/account';
import { app } from '../../helpers/app';
import { Account } from '../../../src/apps/backend/modules/account';
import { TaskService } from '../../../dist/modules/task';
import SharedTaskService from '../../../dist/modules/shared-task/shared-task-service';

describe('Shared Task API', () => {
  let account: Account;
  let accessToken: AccessToken;

  beforeEach(async () => {
    ({ account, accessToken } = await createAccount());
  });

  describe('POST /tasks/:taskId/share-task-requests', () => {
    it('should be able to share a task with multiple accounts', async () => {
      const task = await TaskService.createTask({
        accountId: account.id,
        title: 'my-task',
        description: 'This is a test description.',
      });

      const { account: anotherAccount } = await createAccount();

      const res = await chai
        .request(app)
        .post(`/api/tasks/${task.id}/share-task-requests`)
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${accessToken.token}`)
        .send({
          taskId: task.id,
          accountIds: [anotherAccount.id],
        });

      expect(res.status).to.eq(201);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.eq(1);
      expect(res.body[0].task).to.eq(task.id);
      expect(res.body[0].account).to.eq(anotherAccount.id);
      expect(res.body[0].status).to.eq('accepted');
    });

    it('should return error if trying to share task without taskId or accountIds', async () => {
      const res = await chai
        .request(app)
        .post('api/tasks')
        .set('content-type', 'application/json')
        .set('Authorization', `Bearer ${accessToken.token}`)
        .send({
          accountIds: [],
        });

      expect(res.status).to.eq(400);
    });
  });

  describe(`GET /tasks?sharedTask=true`, () => {
    it('should retrieve shared tasks for the authenticated account', async () => {
      const task1 = await TaskService.createTask({
        accountId: account.id,
        title: 'Task 1',
        description: 'Description for task 1',
      });

      const task2 = await TaskService.createTask({
        accountId: account.id,
        title: 'Task 2',
        description: 'Description for task 2',
      });

      const { account: anotherAccount } = await createAccount();

      await SharedTaskService.createSharedTask({
        taskId: task1.id,
        accountId: anotherAccount.id,
      });

      await SharedTaskService.createSharedTask({
        taskId: task2.id,
        accountId: anotherAccount.id,
      });

      const res = await chai
        .request(app)
        .get(`/api/tasks?sharedTask=true`)
        .set('Authorization', `Bearer ${accessToken.token}`);

      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.eq(2);
      expect(res.body[0]).to.have.property('task');
      expect(res.body[0]).to.have.property('account');
    });

    it('should return 401 if no authorization token is provided', async () => {
      const res = await chai.request(app).get('/api/shared-tasks/shared-tasks');

      expect(res.status).to.eq(401);
    });

    it('should return 403 if the token is invalid or expired', async () => {
      const res = await chai
        .request(app)
        .get(`/api/tasks?sharedTask=true`)
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).to.eq(403);
    });
  });
});

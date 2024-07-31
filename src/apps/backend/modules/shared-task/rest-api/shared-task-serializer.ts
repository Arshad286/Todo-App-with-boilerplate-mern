import { Account } from '../../account/types';
import { Task } from '../../task/types';
import { SharedTask } from '../types';

export function serializeSharedTaskAsJSON(sharedTask: SharedTask): object {
  const task = sharedTask.task as Task;
  const account = sharedTask.account as Account;

  return {
    id: sharedTask.id,
    task:
      typeof sharedTask.task === 'string'
        ? sharedTask.task
        : {
            id: task.id,
            title: task.title,
            description: task.description,
            account:
              typeof task.account === 'string'
                ? task.account
                : {
                    id: (task.account as Account).id,
                    firstName: (task.account as Account).firstName,
                    lastName: (task.account as Account).lastName,
                    username: (task.account as Account).username,
                  },
          },
    account:
      typeof sharedTask.account === 'string'
        ? sharedTask.account
        : {
            id: account.id,
            firstName: account.firstName,
            lastName: account.lastName,
            username: account.username,
          },
  };
}
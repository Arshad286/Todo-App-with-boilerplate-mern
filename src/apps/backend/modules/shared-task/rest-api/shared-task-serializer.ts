import { ShareTask } from '../types';

export function serializeSharedTaskAsJSON(sharedTask: ShareTask): object {
  return {
    id: sharedTask.id,
    task: {
      id: sharedTask.task.id,
      title: sharedTask.task.title,
      description: sharedTask.task.description,
      account: {
        id: sharedTask.task.id,
      },
    },
    account: sharedTask.account,
  };
}

import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';
import { AsyncError, AsyncResult } from '../types';
import { SharedTask } from '../types/shared-task';
import SharedTaskService from '../services/shared.service';
import useAsync from './async.hook';

type SharedTaskContextType = {
  sharedTasks: SharedTask[];
  isGetSharedTasksLoading: boolean;
  getSharedTasks: () => Promise<void>;
  getSharedTasksError: AsyncError;
};

const SharedTaskContext = createContext<SharedTaskContextType | null>(null);

const sharedTaskService = new SharedTaskService();

export const useSharedTaskContext = (): SharedTaskContextType => {
  const context = useContext(SharedTaskContext);
  if (!context) {
    throw new Error(
      'useSharedTaskContext must be used within a SharedTaskProvider',
    );
  }
  return context;
};

export const SharedTaskProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [sharedTasks, setSharedTasks] = useState<SharedTask[]>([]);

  const getSharedTasksFn = async (): Promise<AsyncResult<SharedTask[]>> => {
    try {
      const response = await sharedTaskService.getSharedTasks();
      setSharedTasks(response.data);
      return { data: response.data };
    } catch (error) {
      return { error: error as AsyncError };
    }
  };

  const {
    asyncCallback: getSharedTasks,
    error: getSharedTasksError,
    isLoading: isGetSharedTasksLoading,
  } = useAsync(getSharedTasksFn);

  return (
    <SharedTaskContext.Provider
      value={{
        sharedTasks,
        isGetSharedTasksLoading,
        getSharedTasks: async () => {
          await getSharedTasks();
        },
        getSharedTasksError,
      }}
    >
      {children}
    </SharedTaskContext.Provider>
  );
};

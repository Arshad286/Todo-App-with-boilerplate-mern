import React, { useEffect, useState } from 'react';
import {
  HeadingMedium,
  VerticalStackLayout,
  Spinner,
  LabelLarge,
  ParagraphSmall,
} from '../../components';
import SharedTaskService from '../../services/shared.service';
import { SharedTask } from '../../types/shared-task';
import { AsyncError } from '../../types';
import { toast } from 'react-hot-toast';
import CommentList from '../comment/comment';
import AddComment from '../comment/new-comment';


const sharedTaskService = new SharedTaskService();

const SharedTasks: React.FC = () => {
  const [sharedTasks, setSharedTasks] = useState<SharedTask[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSharedTasks = async () => {
      setIsLoading(true);
      try {
        const response = await sharedTaskService.getSharedTasks();
        setSharedTasks(response.data);        
      } catch (error) {
        toast.error((error as AsyncError).message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedTasks();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="mx-auto h-screen max-w-screen-2xl overflow-y-auto p-4 md:p-6 2xl:p-10">
      <div className="mx-auto max-w-5xl">
        <VerticalStackLayout gap={7}>
          <HeadingMedium>Shared Tasks</HeadingMedium>
          { sharedTasks.length > 0 ? (
            sharedTasks.map((sharedTask) => (
              <div
                className="relative rounded-sm border border-stroke bg-white p-9 shadow-default"
                key={sharedTask.id}
              >
                <VerticalStackLayout gap={3}>
                  <LabelLarge>{sharedTask.title}</LabelLarge>
                  <ParagraphSmall>{sharedTask.description}</ParagraphSmall>
                  <ParagraphSmall>
                    Shared by:{' '}
                    {`${sharedTask.account.firstName} ${sharedTask.account.lastName} (${sharedTask.account.username})`}
                  </ParagraphSmall>
                  <CommentList taskId={sharedTask.id} />
                  <AddComment taskId={sharedTask.id} />
                </VerticalStackLayout>
              </div>
            ))
          ) : (
            <ParagraphSmall>No shared tasks available.</ParagraphSmall>
          )}
        </VerticalStackLayout>
      </div>
    </div>
  );
};

export default SharedTasks;

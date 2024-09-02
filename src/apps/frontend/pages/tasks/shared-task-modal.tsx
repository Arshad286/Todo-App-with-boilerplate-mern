import React, { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  Input,
  VerticalStackLayout,
} from '../../components';
import Modal from '../../components/modal';
import { ButtonKind } from '../../types/button';
import { Account } from '../../types/account';
import AccountService from '../../services/account.service';
import SharedTaskService from '../../services/shared.service';
import { Task } from '../../types/task';
import { toast } from 'react-hot-toast';

const sharedTaskService = new SharedTaskService();

interface ShareTaskModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  task: Task;
}

const ShareTaskModal: React.FC<ShareTaskModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  task,
}) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isModalOpen) {
      fetchAccounts();
    }
  }, [isModalOpen, search, page]);

  const fetchAccounts = async () => {
    setIsLoading(true);
    try {
      const response = await new AccountService().getAccounts({
        search,
        page,
        size: 10,
      });
      if (response.data.length === 0) {
        setError('No accounts match your search');
      } else {
        setError('');
      }
      setAccounts(response.data);
    } catch (error) {
      toast.error('Failed to load accounts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareTask = async () => {
    try {
      await sharedTaskService.shareTask(task.id, selectedAccounts);
      toast.success('Task shared successfully');
      closeModal();
    } catch (error) {
      console.log('ERROR', error);
      toast.error('Failed to share task');
    }
  };

  const handleAccountSelect = (accountId: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(accountId)
        ? prev.filter((id) => id !== accountId)
        : [...prev, accountId],
    );
  };

  const resetModal = () => {
    setAccounts([]);
    setSelectedAccounts([]);
    setSearch('');
    setPage(1);
    setError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetModal();
  };

  return (
    <Modal isOpen={isModalOpen}>
      <div className="absolute right-1 top-1 sm:right-5 sm:top-5">
        <Button
          onClick={closeModal}
          kind={ButtonKind.TERTIARY}
          startEnhancer={
            <img
              src="assets/svg/close-icon.svg"
              alt="close-icon"
              className="fill-current"
            />
          }
        ></Button>
      </div>
      <VerticalStackLayout gap={5}>
        <FormControl label="Search Accounts" error={error}>
          <Input
            data-testid="search"
            disabled={isLoading}
            name="search"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or username"
            type="text"
            value={search}
            error={error ? error : ''}
          />
        </FormControl>
        <div className="account-list">
          {isLoading ? (
            <div>Loading...</div>
          ) : accounts.length === 0 ? (
            <div>No accounts match your search</div>
          ) : (
            accounts.map((account) => (
              <div key={account.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedAccounts.includes(account.id)}
                    onChange={() => handleAccountSelect(account.id)}
                  />
                  {account.firstName} {account.lastName} ({account.username})
                </label>
              </div>
            ))
          )}
        </div>
        <div className="pagination-controls flex justify-between">
          <Button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </Button>
          <Button
            disabled={accounts.length < 10}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
        <Button
          onClick={handleShareTask}
          disabled={selectedAccounts.length === 0}
        >
          Share Task
        </Button>
      </VerticalStackLayout>
    </Modal>
  );
};

export default ShareTaskModal;

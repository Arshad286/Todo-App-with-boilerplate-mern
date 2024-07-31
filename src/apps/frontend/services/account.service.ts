import { AccessToken, ApiResponse, ApiError } from '../types';
import { Account } from '../types/account';

import APIService from './api.service';

export default class AccountService extends APIService {
  getAccountDetails = async (): Promise<ApiResponse<Account>> => {
    const userAccessToken = JSON.parse(
      localStorage.getItem('access-token'),
    ) as AccessToken;

    return this.apiClient.get(`/accounts/${userAccessToken.accountId}`, {
      headers: {
        Authorization: `Bearer ${userAccessToken.token}`,
      },
    });
  };

  getAccounts = async (params: {
    page: number;
    size: number;
    search: string;
  }): Promise<ApiResponse<Account[]>> => {
    try {
      // Get the user access token from local storage
      const userAccessToken = JSON.parse(localStorage.getItem('access-token') || '{}') as AccessToken;
  
      // Make the API request
      const response = await this.apiClient.get('/accounts', {
        headers: {
          Authorization: `Bearer ${userAccessToken.token}`,
        },
        params, // Query parameters for the request
      });
  
      // Map the response data to Account objects
      const accounts: Account[] = response.data.map(
        (accountData: any) => new Account(accountData)
      );
  
      // Return a successful ApiResponse
      return new ApiResponse(accounts, undefined);
    } catch (error) {
      // Handle errors
      console.error('Error fetching accounts:', error);
      return new ApiResponse(
        undefined,
        new ApiError(error.response?.data || 'An error occurred')
      );
    }
  };
}

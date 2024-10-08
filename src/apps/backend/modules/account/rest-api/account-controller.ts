import { applicationController, Request, Response } from '../../application';
import { HttpStatusCodes } from '../../http';
import AccountService from '../account-service';
import {
  Account,
  CreateAccountParams,
  CreateAccountParamsByPhoneNumber,
  CreateAccountParamsByUsernameAndPassword,
  GetAccountParams,
  GetAllAccountsParams,
  PhoneNumber,
  ResetPasswordParams,
  UpdateAccountDetailsParams,
  UpdateAccountParams,
} from '../types';

import { serializeAccountAsJSON } from './account-serializer';

export class AccountController {
  createAccount = applicationController(
    async (req: Request<CreateAccountParams>, res: Response) => {
      let account: Account;
      const {
        firstName,
        lastName,
        password,
        username,
      } = req.body as CreateAccountParamsByUsernameAndPassword;
      const {
        phoneNumber,
      } = req.body as CreateAccountParamsByPhoneNumber;

      if (username && password) {
        account = await AccountService.createAccountByUsernameAndPassword(
          firstName,
          lastName,
          password,
          username,
        );
      } else if (phoneNumber) {
        account = await AccountService.getOrCreateAccountByPhoneNumber(
          new PhoneNumber(phoneNumber.countryCode, phoneNumber.phoneNumber),
        );
      }

      const accountJSON = serializeAccountAsJSON(account);

      res.status(HttpStatusCodes.CREATED).send(accountJSON);
    },
  );

  getAccountById = applicationController(
    async (req: Request<GetAccountParams>, res: Response) => {
      const account = await AccountService.getAccountById({
        accountId: req.params.accountId,
      });
      const accountJSON = serializeAccountAsJSON(account);

      res.status(HttpStatusCodes.OK).send(accountJSON);
    },
  );
  
  getAllAccounts = applicationController(
     async (req: Request, res: Response) => {
      try {
        const search = (req.query.search as string) || '';
        const page = +(req.query.page as string) || 1;
        const size = +(req.query.size as string) || 10;
  
        const params: GetAllAccountsParams = { search, page, size };
        const accounts = await AccountService.getAllAccounts(params);
        const accountsJSON = accounts.map((account) =>
          serializeAccountAsJSON(account)
        );
  
        res.status(HttpStatusCodes.OK).send(accountsJSON);
      } catch (error) {
        res.status(HttpStatusCodes.SERVER_ERROR).send({
          message: 'Failed to fetch accounts',
          error: error.message,
        });
      }
    }
  );

  updateAccount = applicationController(
    async (req: Request<UpdateAccountParams>, res: Response) => {
      const { accountId } = req.params;
      let account: Account;
      const {
        firstName,
        lastName,
      } = req.body as UpdateAccountDetailsParams;

      const {
        newPassword,
        token,
      } = req.body as ResetPasswordParams;

      if (newPassword && token) {
        account = await AccountService.resetAccountPassword({
          accountId,
          newPassword,
          token,
        });
      } else {
        account = await AccountService.updateAccountDetails({
          accountId,
          firstName,
          lastName,
        });
      }

      const accountJSON = serializeAccountAsJSON(account);

      res.status(HttpStatusCodes.OK).send(accountJSON);
    },
  );
}

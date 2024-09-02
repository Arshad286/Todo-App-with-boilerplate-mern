import { ApplicationRepository } from "../../../application";
import { ShareTaskRequestDB,ShareTaskRequestDBSchema } from "./share-task-request-db";

const ShareTaskRequestRepository = ApplicationRepository<ShareTaskRequestDB>(
    'ShareTaskRequest',
    ShareTaskRequestDBSchema,
);

export default ShareTaskRequestRepository;

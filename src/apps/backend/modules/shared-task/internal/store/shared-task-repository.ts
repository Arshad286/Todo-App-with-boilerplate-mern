import { ApplicationRepository } from "../../../application";
import { SharedTaskDB,SharedTaskDBSchema } from "./shared-task-db";

const SharedTaskRepository = ApplicationRepository<SharedTaskDB>(
    'SharedTask',
    SharedTaskDBSchema,
);

export default SharedTaskRepository;

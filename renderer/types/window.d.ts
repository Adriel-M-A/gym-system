import { IPCAPI } from '../../shared/types/ipc-types';

export { };

declare global {
    interface Window {
        api: IPCAPI;
    }
}

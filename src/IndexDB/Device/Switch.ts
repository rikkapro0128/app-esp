import { Storage, Drivers } from '@ionic/storage';

class DBSwitchInfo {
    storage: Storage;
    constructor() {
        this.storage = new Storage({
            name: 'switch_info',
            driverOrder: [Drivers.IndexedDB]
        });
        this.storage.create();
    }
}

export default new DBSwitchInfo;
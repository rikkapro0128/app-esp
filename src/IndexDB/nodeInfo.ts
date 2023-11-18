import { Storage, Drivers } from '@ionic/storage';

class DBNodeInfo {
	storage: Storage;
	constructor() {
		this.storage = new Storage({
			name: 'node_info',
			driverOrder: [Drivers.IndexedDB]
		});
		this.storage.create();
	}
}

export default new DBNodeInfo;
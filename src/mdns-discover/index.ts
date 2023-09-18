import { Zeroconf } from '@ionic-native/zeroconf';

import { useCommonStore } from '@/store';

export const checkServiceDNS = (cb: (ip: string | undefined) => void) => {

  const commonStore = useCommonStore();
  
  Zeroconf.watch("_http._tcp.", "local.").subscribe(result => {
    console.log("Zeroconf Service Changed:");
    console.log(result);
    if(result.action === 'resolved') {
      if(result.service.name.includes('esp-skytech') && result.service.ipv4Addresses.length > 0) {
        localStorage.setItem('ip-dns-root', result.service.ipv4Addresses[0]);
        commonStore.ipMeshRoot = result.service.ipv4Addresses[0];
        cb(result.service.ipv4Addresses[0]);
      }
    }else if(result.action === 'added' ) {
      if(result.service.name.includes('esp-skytech') && result.service.ipv4Addresses.length === 0) {
        const loadIP = localStorage.getItem('ip-dns-root');
        commonStore.ipMeshRoot = loadIP ?? undefined;
        cb(loadIP ?? undefined);
      }
    }
  });
  
}

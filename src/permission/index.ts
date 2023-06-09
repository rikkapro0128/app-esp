import { WifiWizard2 } from '@awesome-cordova-plugins/wifi-wizard-2';
import { LocalNotifications } from '@capacitor/local-notifications';

export const checkPermission = async () => {
  const response: Array<Promise<any>> | [] = [];
  
  response.push(LocalNotifications.requestPermissions() as never);
  response.push(WifiWizard2.requestPermission() as never);

  const resultCheck = await Promise.allSettled(response);

  console.log(resultCheck);
  
}

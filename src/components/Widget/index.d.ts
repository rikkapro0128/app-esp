
export type WidgetType = 'dimmer' | 'switch' | 'color' | 'touch_1' | 'touch_2' | 'touch_3' | 'touch_4' | 'light_dimmer'; 

export type TypeControll = 'controll';
export type TypeCron = 'cron';
export type TypeConfig = 'config';

export type PacketType = TypeControll | TypeCron | TypeConfig; // this is type of packet will be send

interface TouchProps {
  position: number, // 1, 2, 3, 4
  state: boolean,
}

interface PacketControll<T extends TouchProps> {
  pType: TypeControll,
  dType: WidgetType,
  value: T,
}

export type PacketProps<T extends PacketControll<Y>> = {
  target: string;
  payload: T<Y>;
}

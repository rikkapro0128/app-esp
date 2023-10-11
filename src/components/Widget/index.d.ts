export type WidgetType =
  | "dimmer"
  | "switch"
  | "color"
  | "touch_1"
  | "touch_2"
  | "touch_3"
  | "touch_4"
  | "light_dimmer";

export type TypeControll = "controll";
export type TypeCron = "cron";
export type TypeConfig = "config";
export type TypeOTA = "ota";

export type PacketType = TypeControll | TypeCron | TypeConfig | TypeOTA; // this is type of packet will be send

interface TouchProps {
  position: number; // 1, 2, 3, 4
  state: boolean;
}

interface PacketControll<T extends TouchProps> {
  pType: TypeControll;
  dType: WidgetType;
  value: T;
}

export type PacketProps<T extends PacketControll<Y>> = {
  target: string;
  payload: T<Y>;
};

export interface NodeProps {
  macAddress: string;
  ipAddress: string;
  port: number;
  deviceType: WidgetType;
  value: Array<TouchProps>;
}

interface MessageSocketProps {
  target: string;
  payload: {
    dType: WidgetType;
    pType: PacketType;
    position?: number;
    state?: boolean;
    status?: string;
    numSuccessed?: number;
    numUnfinished?: number;
    timeDone?: number;
    restartAfter?: number;
    value?: number;
    total?: number;
    present?: number;
  };
}

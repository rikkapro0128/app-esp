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
export type TypeCountdown = "countdown";
export type TypeSchedule = "schedule";
export type TypeTimeStamp = "timestamp";

export type TypeMenu = "schedule" | "countdown";
export type LoadType = "ws" | "mqtt";
export type PacketType =
  | TypeControll
  | TypeCron
  | TypeConfig
  | TypeOTA
  | TypeSchedule
  | TypeCountdown | TypeTimeStamp; // this is type of packet will be send
export type PacketAction = "READ" | "CREATE" | "UPDATE" | "DELETE"; // this is type of packet will be send

interface TouchProps {
  position: number; // 1, 2, 3, 4
  state: boolean;
}

interface PacketControll<T extends TouchProps> {
  pType: TypeControll;
  dType: WidgetType;
  value: T;
}

export type PickerTouch = {
  position?: number;
  state: number | boolean;
  mode: number;
};

export type PacketProps<T extends PacketControll<Y>> = {
  target: string;
  payload: T<Y>;
};

export interface NodeProps {
  target: string;
  ipAddress: string;
  port: number;
  deviceType: WidgetType;
  value: Array<TouchProps>;
}

export interface MenuProps {
  id: string;
  dType: WidgetType;
  select: TypeMenu;
}

export interface ScheduleProps {
  mode: number;
  expression: string;
  percent_white?: number;
  percent_yellow?: number;
  loop: boolean;
  state?: boolean | number;
  position?: boolean | number;
  id: string;
}

export interface CountdownProps {
  mode: number;
  timestamp: number;
  percent_white?: number;
  percent_yellow?: number;
  state?: boolean | number;
  position?: boolean | number;
  id: string;
}

interface MessageSocketProps {
  target: string;
  payload: {
    dType: WidgetType;
    pType: PacketType;
    pAction: PacketAction;
    expression?: string;
    timestamp?: number;
    message?: string;
    mode?: number;
    position?: number;
    id?: string;
    schedule?: Array<ScheduleProps>;
    countdown?: Array<CountdownProps>;
    loop?: boolean;
    state?: boolean;
    status?: string;
    numSuccessed?: number;
    numUnfinished?: number;
    timeDone?: number;
    restartAfter?: number;
    value?: number;
    total?: number;
    present?: number;
    createAt?: number;
  };
}

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
export type TypeInfoNode = "info_node";
export type TypeCron = "cron";
export type TypeConfig = "config";
export type TypeOTA = "ota";
export type TypeCountdown = "countdown";
export type TypeSchedule = "schedule";
export type TypeTimeStamp = "timestamp";
export type TypeNodeEnter = "node_enter";
export type TypeNodeOuter = "node_outer";
export type TypeScene = "scene";
export type TypeAutomation = "automation";
export type TypeStateAll = "state_all";

export type TypeTouchPadState = "touchpad_state";

export type TypeMenu = "schedule" | "countdown" | "scene" | "info_node" | 'automation';
export type LoadType = "ws" | "mqtt";
export type PacketType =
  | TypeControll
  | TypeInfoNode
  | TypeCron
  | TypeConfig
  | TypeOTA
  | TypeSchedule
  | TypeCountdown
  | TypeTimeStamp
  | TypeNodeEnter
  | TypeNodeOuter
  | TypeScene
  | TypeTouchPadState | TypeStateAll | TypeAutomation; // this is type of packet will be send
export type PacketAction = "READ" | "CREATE" | "UPDATE" | "DELETE" | "NOTIFY"; // this is type of packet will be send

interface TouchProps {
  position: number; // 1, 2, 3, 4
  state: boolean;
  name?: string;
}
export interface ResponseNode {
  nodes: Array<string>;
  message: string;
}

interface PacketControll<T extends TouchProps> {
  pType: TypeControll;
  dType: WidgetType;
  value: T;
}

export interface MessageRequireProps {
  pType: TypeControll;
  dType: WidgetType;
  pAction: PacketAction;
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
  createAt: number;
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
    value?: number | Array<TouchProps>;
    total?: number;
    present?: number;
    createAt?: number;
  };
}

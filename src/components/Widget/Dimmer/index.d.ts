
export type colorChannel = 'white' | 'yellow' | 'blue' | 'green' | 'red';
export interface TrackingResponse { 'epoch-time': number }
export type BrightnessColor = {
  [key in colorChannel]?: number;
};

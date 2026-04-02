import type { SceneId, WidgetType } from '../stores/widgetStore';

export const WIDGET_DEFAULTS: Record<WidgetType, { width: number; height: number; minWidth: number; minHeight: number }> = {
  clock:     { width: 180, height: 185, minWidth: 175, minHeight: 180 },
  todo:      { width: 220, height: 240, minWidth: 180, minHeight: 158 },
  quote:     { width: 215, height: 220, minWidth: 185, minHeight: 216 },
  countdown: { width: 175, height: 215, minWidth: 160, minHeight: 210 },
  memo:      { width: 210, height: 190, minWidth: 185, minHeight: 138 },
};

export const SCENE_LIST: { id: SceneId; name: string }[] = [
  { id: 'rain',    name: '夜雨' },
  { id: 'snow',    name: '初雪' },
  { id: 'sunset',  name: '暮色' },
  { id: 'night',   name: '星夜' },
  { id: 'aurora',  name: '极光' },
  { id: 'sakura',  name: '花见' },
  { id: 'mist',    name: '晨雾' },
  { id: 'firefly', name: '流萤' },
];

export const WIDGET_LABELS: Record<WidgetType, { icon: string; name: string }> = {
  clock:     { icon: '🕐', name: '时钟' },
  todo:      { icon: '✓',  name: '待办' },
  quote:     { icon: '✎',  name: '心语' },
  countdown: { icon: '⏳', name: '倒计时' },
  memo:      { icon: '📝', name: '便签' },
};
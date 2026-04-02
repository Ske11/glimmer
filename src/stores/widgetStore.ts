import { create } from 'zustand';

export type WidgetType = 'clock' | 'todo' | 'quote' | 'countdown' | 'memo';
export type SceneId = 'rain' | 'snow' | 'sunset' | 'night' | 'aurora' | 'sakura' | 'mist' | 'firefly';

export interface TodoItem {
  text: string;
  done: boolean;
}

export interface ClockContent {}

export interface TodoContent {
  items: TodoItem[];
}

export interface QuoteContent {
  text: string;
  author: string;
  saved: boolean;
}

export interface CountdownContent {
  label: string;
  date: string;
  set: boolean;
}

export interface MemoContent {
  text: string;
}

export type WidgetContent = ClockContent | TodoContent | QuoteContent | CountdownContent | MemoContent;

export interface WidgetState {
  wid: string;
  type: WidgetType;
  scene: SceneId;
  collapsed: boolean;
  content: WidgetContent;
}

interface WidgetStore extends WidgetState {
  setScene: (scene: SceneId) => void;
  setCollapsed: (collapsed: boolean) => void;
  updateContent: (content: Partial<WidgetContent>) => void;
}

const SCENES: SceneId[] = ['rain', 'snow', 'sunset', 'night', 'aurora', 'sakura', 'mist', 'firefly'];

function defaultContent(type: WidgetType): WidgetContent {
  switch (type) {
    case 'clock': return {};
    case 'todo': return { items: [] } as TodoContent;
    case 'quote': return { text: '', author: '', saved: false } as QuoteContent;
    case 'countdown': return { label: '', date: '', set: false } as CountdownContent;
    case 'memo': return { text: '' } as MemoContent;
  }
}

function storageKey(wid: string) {
  return `glimmer-${wid}`;
}

function loadWidget(wid: string): Partial<WidgetState> | null {
  try {
    const raw = localStorage.getItem(storageKey(wid));
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return null;
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

function saveWidget(state: WidgetState) {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    try {
      localStorage.setItem(storageKey(state.wid), JSON.stringify({
        wid: state.wid,
        type: state.type,
        scene: state.scene,
        collapsed: state.collapsed,
        content: state.content,
      }));
    } catch { /* ignore */ }
  }, 500);
}

function saveWidgetImmediate(state: WidgetState) {
  if (saveTimeout) clearTimeout(saveTimeout);
  try {
    localStorage.setItem(storageKey(state.wid), JSON.stringify({
      wid: state.wid,
      type: state.type,
      scene: state.scene,
      collapsed: state.collapsed,
      content: state.content,
    }));
  } catch { /* ignore */ }
}

// Parse URL params
const params = new URLSearchParams(window.location.search);
const widgetType = (params.get('type') || 'clock') as WidgetType;
const widgetId = params.get('wid') || 'default';

const saved = loadWidget(widgetId);
const randomScene = SCENES[Math.floor(Math.random() * SCENES.length)];

export const useWidgetStore = create<WidgetStore>((set, get) => ({
  wid: widgetId,
  type: saved?.type ?? widgetType,
  scene: saved?.scene ?? randomScene,
  collapsed: saved?.collapsed ?? false,
  content: saved?.content ?? defaultContent(widgetType),

  setScene: (scene) => {
    set({ scene });
    saveWidget(get());
  },

  setCollapsed: (collapsed) => {
    set({ collapsed });
    saveWidget(get());
  },

  updateContent: (content) => {
    set((s) => ({ content: { ...s.content, ...content } }));
    saveWidget(get());
  },
}));

window.addEventListener('beforeunload', () => {
  saveWidgetImmediate(useWidgetStore.getState());
});

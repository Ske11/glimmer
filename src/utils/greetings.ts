const GREETINGS: [number, string][] = [
  [0,  '夜阑人静，好梦'],
  [6,  '晨光初照，新的一天'],
  [9,  '日出而作，心无旁骛'],
  [12, '日正当中，小憩片刻'],
  [14, '斜阳温柔，继续前行'],
  [18, '月上柳梢，且歇且行'],
  [22, '夜阑人静，好梦'],
];

export function getGreeting(): string {
  const hour = new Date().getHours();
  for (let i = GREETINGS.length - 1; i >= 0; i--) {
    if (hour >= GREETINGS[i][0]) return GREETINGS[i][1];
  }
  return GREETINGS[0][1];
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

export function formatDate(d: Date): string {
  return `${d.getMonth() + 1}月${d.getDate()}日 周${WEEKDAYS[d.getDay()]}`;
}

export function formatTime(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

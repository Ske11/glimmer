import { useWidgetStore, type TodoContent, type QuoteContent, type CountdownContent, type MemoContent } from './stores/widgetStore';
import WidgetShell from './components/WidgetShell';
import ClockWidget from './components/ClockWidget';
import TodoWidget from './components/TodoWidget';
import QuoteWidget from './components/QuoteWidget';
import CountdownWidget from './components/CountdownWidget';
import MemoWidget from './components/MemoWidget';

function WidgetBody() {
  const type = useWidgetStore((s) => s.type);
  const content = useWidgetStore((s) => s.content);
  const wid = useWidgetStore((s) => s.wid);

  switch (type) {
    case 'clock':
      return <ClockWidget />;
    case 'todo':
      return <TodoWidget id={wid} content={content as TodoContent} />;
    case 'quote':
      return <QuoteWidget id={wid} content={content as QuoteContent} />;
    case 'countdown':
      return <CountdownWidget id={wid} content={content as CountdownContent} />;
    case 'memo':
      return <MemoWidget id={wid} content={content as MemoContent} />;
  }
}

export default function App() {
  return (
    <WidgetShell>
      <WidgetBody />
    </WidgetShell>
  );
}

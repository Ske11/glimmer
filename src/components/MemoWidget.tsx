import { useWidgetStore, type MemoContent } from '../stores/widgetStore';
import styles from '../styles/widgets.module.css';

interface Props {
  id: string;
  content: MemoContent;
}

export default function MemoWidget({ content }: Props) {
  const updateContent = useWidgetStore((s) => s.updateContent);

  return (
    <textarea
      className={styles.memoTextarea}
      placeholder="随手记下此刻的想法..."
      value={content.text}
      onChange={(e) =>
        updateContent({ text: e.target.value } as Partial<MemoContent>)
      }
    />
  );
}

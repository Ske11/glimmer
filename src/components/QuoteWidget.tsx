import { useState } from 'react';
import { useWidgetStore, type QuoteContent } from '../stores/widgetStore';
import styles from '../styles/widgets.module.css';

interface Props {
  id: string;
  content: QuoteContent;
}

export default function QuoteWidget({ content }: Props) {
  const updateContent = useWidgetStore((s) => s.updateContent);
  const [editing, setEditing] = useState(!content.saved);
  const [text, setText] = useState(content.text);
  const [author, setAuthor] = useState(content.author);

  const save = () => {
    if (!text.trim()) return;
    updateContent({ text: text.trim(), author: author.trim(), saved: true } as Partial<QuoteContent>);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className={styles.quoteEditForm}>
        <textarea
          className={styles.quoteTextarea}
          placeholder="写下一句喜欢的话..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          className={styles.quoteSourceInput}
          placeholder="—— 出处（可选）"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <button className={styles.quoteSaveBtn} onClick={save}>
          落笔
        </button>
      </div>
    );
  }

  return (
    <div className={styles.quoteDisplay} style={{ position: 'relative' }}>
      <span className={styles.quoteMark}>&ldquo;</span>
      <p className={styles.quoteText}>{content.text}</p>
      {content.author && <p className={styles.quoteAuthor}>—— {content.author}</p>}
      <span
        className={styles.quoteEditTrigger}
        onClick={() => {
          setText(content.text);
          setAuthor(content.author);
          setEditing(true);
        }}
      >
        编辑
      </span>
    </div>
  );
}

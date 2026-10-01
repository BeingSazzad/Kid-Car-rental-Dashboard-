import { useState, useRef, useEffect } from 'react';
import {
  Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Link as LinkIcon, Code,
  Undo, Redo, Minus, Palette
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export function RichTextEditor({ value, onChange, placeholder = 'Enter clause description...', minHeight = 150 }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isSource, setIsSource] = useState(false);
  const [sourceCode, setSourceCode] = useState(value || '');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [activeFormat, setActiveFormat] = useState('p');

  // Synchronize initial or external value changes when not in source mode
  useEffect(() => {
    if (editorRef.current && !isSource) {
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value, isSource]);

  const exec = (cmd: string, val: string | null = null) => {
    if (isSource) return;
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(cmd, false, val || undefined);
    handleInput();
  };

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
      setSourceCode(html);
    }
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setSourceCode(val);
    onChange(val);
  };

  const toggleSource = () => {
    if (isSource) {
      // Switch back to visual mode
      setIsSource(false);
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.innerHTML = sourceCode;
          editorRef.current.focus();
        }
      }, 40);
    } else {
      // Switch to HTML source code mode
      if (editorRef.current) {
        setSourceCode(editorRef.current.innerHTML);
      }
      setIsSource(true);
    }
  };

  const insertLink = () => {
    const url = prompt('Enter URL (e.g. https://...):', 'https://');
    if (url) {
      exec('createLink', url);
    }
  };

  const insertBulletItem = () => {
    if (isSource) {
      const bullet = '<ul><li>New policy requirement or condition</li></ul>';
      const updated = sourceCode + bullet;
      setSourceCode(updated);
      onChange(updated);
      return;
    }
    exec('insertUnorderedList');
  };

  const colors = [
    { label: 'Deep Navy', val: '#1B2B68' },
    { label: 'Dark Slate', val: '#0F172A' },
    { label: 'Body Text', val: '#475569' },
    { label: 'Accent Orange', val: '#F2600C' },
    { label: 'Emerald Green', val: '#10B981' },
    { label: 'Warning Amber', val: '#F59E0B' },
    { label: 'Alert Red', val: '#EF4444' },
    { label: 'Royal Blue', val: '#2563EB' },
  ];

  return (
    <div style={{
      border: '1.5px solid #CBD5E1',
      borderRadius: 10,
      background: '#FFFFFF',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
    }}>
      {/* 3-TIER CLASSIC/MODERN CMS TOOLBAR (Matching CKEditor / User screenshot) */}
      <div style={{
        background: '#F8FAFC',
        borderBottom: '1px solid #CBD5E1',
        padding: '6px 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        userSelect: 'none',
      }}>
        {/* ROW 1: Source / History / Structure / Headings */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
          {/* Source Toggle */}
          <button
            type="button"
            onClick={toggleSource}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              height: 26, padding: '0 8px', borderRadius: 4,
              border: '1px solid ' + (isSource ? '#1B2B68' : '#CBD5E1'),
              background: isSource ? '#1B2B68' : '#FFFFFF',
              color: isSource ? '#FFFFFF' : '#334155',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'Consolas, monospace',
            }}
            title="Toggle Visual / HTML Source Code"
          >
            <Code size={12} /> {isSource ? 'Visual Editor' : '<> Source'}
          </button>

          <span style={{ width: 1, height: 18, background: '#CBD5E1', margin: '0 2px' }} />

          {/* Undo / Redo */}
          <button type="button" onClick={() => exec('undo')} style={btnStyle} title="Undo">
            <Undo size={13} />
          </button>
          <button type="button" onClick={() => exec('redo')} style={btnStyle} title="Redo">
            <Redo size={13} />
          </button>

          <span style={{ width: 1, height: 18, background: '#CBD5E1', margin: '0 2px' }} />

          {/* Format dropdown */}
          <select
            value={activeFormat}
            onChange={(e) => {
              const val = e.target.value;
              setActiveFormat(val);
              exec('formatBlock', val === 'p' ? '<p>' : ('<' + val + '>'));
            }}
            style={{
              height: 26, borderRadius: 4, border: '1px solid #CBD5E1',
              background: '#FFFFFF', fontSize: 12, fontWeight: 600,
              padding: '0 6px', color: '#1E293B', cursor: 'pointer', outline: 'none',
            }}
          >
            <option value="p">Paragraph (Normal)</option>
            <option value="h3">Subheading (H3)</option>
            <option value="h4">Minor Heading (H4)</option>
            <option value="blockquote">Quote Callout</option>
          </select>

          {/* Font Size dropdown */}
          <select
            onChange={(e) => exec('fontSize', e.target.value)}
            defaultValue="3"
            style={{
              height: 26, borderRadius: 4, border: '1px solid #CBD5E1',
              background: '#FFFFFF', fontSize: 12, fontWeight: 600,
              padding: '0 6px', color: '#1E293B', cursor: 'pointer', outline: 'none',
            }}
          >
            <option value="2">12px (Small)</option>
            <option value="3">14px (Standard)</option>
            <option value="4">16px (Medium)</option>
            <option value="5">18px (Large)</option>
          </select>

          <span style={{ width: 1, height: 18, background: '#CBD5E1', margin: '0 2px' }} />

          {/* Alignments */}
          <button type="button" onClick={() => exec('justifyLeft')} style={btnStyle} title="Align Left">
            <AlignLeft size={13} />
          </button>
          <button type="button" onClick={() => exec('justifyCenter')} style={btnStyle} title="Align Center">
            <AlignCenter size={13} />
          </button>
          <button type="button" onClick={() => exec('justifyRight')} style={btnStyle} title="Align Right">
            <AlignRight size={13} />
          </button>
          <button type="button" onClick={() => exec('justifyFull')} style={btnStyle} title="Justify Full">
            <AlignJustify size={13} />
          </button>
        </div>

        {/* ROW 2: Styling / Lists / Colors / Bullets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
          {/* Bold, Italic, Underline, Strikethrough */}
          <button type="button" onClick={() => exec('bold')} style={{ ...btnStyle, fontWeight: 800 }} title="Bold">
            <Bold size={13} />
          </button>
          <button type="button" onClick={() => exec('italic')} style={btnStyle} title="Italic">
            <Italic size={13} />
          </button>
          <button type="button" onClick={() => exec('underline')} style={btnStyle} title="Underline">
            <Underline size={13} />
          </button>
          <button type="button" onClick={() => exec('strikeThrough')} style={btnStyle} title="Strikethrough">
            <Strikethrough size={13} />
          </button>

          <span style={{ width: 1, height: 18, background: '#CBD5E1', margin: '0 2px' }} />

          {/* Lists */}
          <button type="button" onClick={() => exec('insertUnorderedList')} style={btnStyle} title="Bulleted List">
            <List size={13} />
          </button>
          <button type="button" onClick={() => exec('insertOrderedList')} style={btnStyle} title="Numbered List">
            <ListOrdered size={13} />
          </button>

          {/* Quick Add Bullet Button */}
          <button
            type="button"
            onClick={insertBulletItem}
            style={{
              ...btnStyle, padding: '0 8px', fontSize: 12, fontWeight: 700,
              color: '#1B2B68', background: '#EEF2F9', border: '1px solid #C7D2FE',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
            title="Insert App Clause Bullet"
          >
            <span style={{ fontSize: 14 }}>•</span> Add Bullet Point
          </button>

          <span style={{ width: 1, height: 18, background: '#CBD5E1', margin: '0 2px' }} />

          {/* Color Popover */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              style={{ ...btnStyle, display: 'flex', alignItems: 'center', gap: 4, padding: '0 6px' }}
              title="Text Color"
            >
              <Palette size={13} />
              <span style={{ width: 10, height: 10, borderRadius: 2, background: '#1B2B68' }} />
            </button>
            {showColorPicker && (
              <div style={{
                position: 'absolute', top: 30, left: 0, zIndex: 60,
                background: '#FFFFFF', border: '1px solid #CBD5E1',
                borderRadius: 8, padding: 8, boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                display: 'grid', gridTemplateColumns: 'repeat(4, 24px)', gap: 6,
              }}>
                {colors.map(c => (
                  <button
                    key={c.val}
                    type="button"
                    title={c.label}
                    onClick={() => {
                      exec('foreColor', c.val);
                      setShowColorPicker(false);
                    }}
                    style={{
                      width: 24, height: 24, borderRadius: 4,
                      background: c.val, border: '1px solid #94A3B8',
                      cursor: 'pointer',
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Link */}
          <button type="button" onClick={insertLink} style={btnStyle} title="Insert Link">
            <LinkIcon size={13} />
          </button>

          {/* Divider */}
          <button type="button" onClick={() => exec('insertHorizontalRule')} style={btnStyle} title="Insert Divider Line">
            <Minus size={13} />
          </button>

          {/* Clear Format */}
          <button type="button" onClick={() => exec('removeFormat')} style={btnStyle} title="Clear Formatting">
            <span style={{ fontSize: 12, fontWeight: 700 }}>Tx</span>
          </button>
        </div>
      </div>

      {/* EDITABLE TEXT CANVAS */}
      {isSource ? (
        <textarea
          value={sourceCode}
          onChange={handleSourceChange}
          placeholder="HTML Source code..."
          style={{
            width: '100%', minHeight, padding: '12px 14px',
            fontFamily: 'Consolas, monospace', fontSize: 14,
            color: '#0F172A', background: '#F8FAFC', border: 'none',
            outline: 'none', resize: 'vertical', boxSizing: 'border-box',
            lineHeight: 1.6,
          }}
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          data-placeholder={placeholder}
          style={{
            minHeight, padding: '14px 16px',
            fontSize: 14, fontFamily: 'Manrope, sans-serif',
            color: '#334155', lineHeight: 1.7, outline: 'none',
            cursor: 'text',
          }}
          className="rich-editor-content"
        />
      )}

      {/* FOOTER BAR */}
      <div style={{
        padding: '5px 12px', background: '#F8FAFC', borderTop: '1px solid #F1F5F9',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: 12, color: '#94A3B8',
      }}>
        <span>{isSource ? 'HTML Source Mode' : 'WYSIWYG Rich Editor'}</span>
        <span>Supports paragraphs, bold, lists and in-app bullet styling</span>
      </div>

      <style>{`
        .rich-editor-content ul {
          margin: 8px 0 8px 18px;
          padding: 0;
          list-style-type: disc;
        }
        .rich-editor-content li {
          margin-bottom: 4px;
          color: #475569;
        }
        .rich-editor-content p {
          margin: 0 0 8px 0;
        }
        .rich-editor-content blockquote {
          border-left: 3px solid #1B2B68;
          padding-left: 10px;
          margin: 8px 0;
          color: #64748B;
          font-style: italic;
        }
        .rich-editor-content:empty:before {
          content: attr(data-placeholder);
          color: #94A3B8;
        }
      `}</style>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  height: 26,
  minWidth: 26,
  padding: '0 5px',
  borderRadius: 4,
  border: '1px solid #CBD5E1',
  background: '#FFFFFF',
  color: '#334155',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  outline: 'none',
  transition: 'background 0.1s, border-color 0.1s',
};

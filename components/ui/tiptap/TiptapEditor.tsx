"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Menubar from "./Menubar";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { Placeholder } from "@tiptap/extensions";

interface ITiptap {
  label?: string;
  value?: string;
  onChange: (value: string) => void | React.Dispatch<React.SetStateAction<string>>;
  error?: string | string[];
  placeholder?: string;
}

export default function TiptapEditor({ label, value, onChange, error, placeholder = "placeholder" }: ITiptap) {
  // console.log("value tiptap", value);
  const editor = useEditor({
    // extensions: [StarterKit],
    extensions: [
      Placeholder.configure({
        placeholder: placeholder,
      }),
      StarterKit.configure({
        bulletList: { HTMLAttributes: { class: "list-disc ml-4" } },
        orderedList: { HTMLAttributes: { class: "list-decimal ml-4" } },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({
        HTMLAttributes: { class: "my-custom-class" },
      }),
    ],
    content: `${value}`,
    immediatelyRender: false,
    editorProps: { attributes: { class: "min-h-32 border border-gray-300 rounded-lg py-2 px-3" } },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  return (
    <div className="mb-3">
      <style jsx global>{`
        .tiptap p.is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }

        .tiptap p.is-empty::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}</style>
      <label htmlFor="content">
        {label && <div className="text-sm text-gray-600 mb-1 font-semibold">{label}</div>}
        <Menubar editor={editor} />
        <EditorContent editor={editor} />
        <div aria-live="polite" aria-atomic="true">
          <p className="text-sm text-red-500">{error ? error : ""}</p>
        </div>
      </label>
    </div>
  );
}

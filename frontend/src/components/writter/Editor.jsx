import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import TextAlign from "@tiptap/extension-text-align";
import {
  Bold, Italic, Underline as UnderlineIcon, Link as LinkIcon, 
  Image as ImageIcon, Code, List, ListOrdered, CheckSquare
} from "lucide-react";
import useHelpWriter from "../Ai/Helpwriter";

const lowlight = createLowlight(common);

const Editor = ({ initialValue, onChange }) => {
  const [tone, setTone] = useState("default");
  const [correctionType, setCorrectionType] = useState("grammar"); // Track the correction type
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      CodeBlockLowlight.configure({ lowlight }),
      TaskList,
      TaskItem.configure({ nested: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: initialValue,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const { generateSuggestion, applySuggestion, isLoading, suggestion } = useHelpWriter(editor, tone, correctionType);

  if (!editor) return null;

  const addLink = () => {
    const url = prompt("Enter the URL");
    if (url && /^https?:\/\/.+\..+/.test(url)) {
      editor.chain().focus().setLink({ href: url }).run();
    } else {
      alert("Invalid URL");
    }
  };

  const addImage = () => {
    const url = prompt("Enter the image URL");
    if (url && /^https?:\/\/.+\.(jpg|jpeg|png|gif|svg)$/.test(url)) {
      editor.chain().focus().setImage({ src: url }).run();
    } else {
      alert("Invalid Image URL");
    }
  };

  const buttonClass = (isActive) =>
    `btn btn-sm ${isActive ? "btn-primary" : "btn-ghost"}`;

  return (
    <div className="card bg-base-100">
      <div className="card-body bg-base-200 min-h-screen">
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Editor control buttons */}
          <button
            className={buttonClass(editor.isActive("bold"))}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <Bold size={18} />
          </button>
          <button
            className={buttonClass(editor.isActive("italic"))}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <Italic size={18} />
          </button>
          <button
            className={buttonClass(editor.isActive("underline"))}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon size={18} />
          </button>
          <button className="btn btn-sm" onClick={addLink}>
            <LinkIcon size={18} />
          </button>
          <button className="btn btn-sm" onClick={addImage}>
            <ImageIcon size={18} />
          </button>
          <button
            className={buttonClass(editor.isActive("codeBlock"))}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <Code size={18} />
          </button>
          <button
            className={buttonClass(editor.isActive("bulletList"))}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List size={18} />
          </button>
          <button
            className={buttonClass(editor.isActive("orderedList"))}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered size={18} />
          </button>
          <button
            className={buttonClass(editor.isActive("taskList"))}
            onClick={() => editor.chain().focus().toggleTaskList().run()}
          >
            <CheckSquare size={18} />
          </button>

          {/* Tone selection */}
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="select select-sm w-40"
          >
            <option value="default">Default</option>
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
            <option value="creative">Creative</option>
            <option value="poetic">Poetic</option>
            <option value="storytelling">Storytelling</option>
          </select>

          {/* Correction type dropdown */}
          <select
            value={correctionType}
            onChange={(e) => setCorrectionType(e.target.value)}
            className="select select-sm w-40"
          >
            <option value="grammar">Grammar Correction</option>
            <option value="word">Word Correction</option>
          </select>

          {/* AI suggestion button */}
          <button
            className="btn btn-sm btn-accent"
            onClick={generateSuggestion}
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Get AI Suggestion"}
          </button>
        </div>

        {/* Display AI suggestion */}
        {suggestion && (
          <div className="mt-2 p-3 bg-gray-100 rounded">
            <p>{suggestion}</p>
            <button
              className="btn btn-sm btn-success mt-2"
              onClick={applySuggestion}
            >
              Apply Suggestion
            </button>
          </div>
        )}

        {/* Editor content */}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default Editor;

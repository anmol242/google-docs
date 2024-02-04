import React, { useCallback } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./textEditor.css";

export default function TextEditor() {
  const containerRef = useCallback((wrapper: HTMLDivElement) => {
    if (!wrapper) {
      return;
    }
    wrapper.innerHTML = "";
    const editor = document.createElement("div");

    wrapper.appendChild(editor);

    new Quill(editor, { theme: "snow" });

    return () => {
      wrapper.innerHTML = "";
    };
  }, []);

  return <div className="container" ref={containerRef}></div>;
}

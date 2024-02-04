import React, { useCallback, useEffect, useState } from "react";
import Quill, { DeltaStatic, Sources } from "quill";
import "quill/dist/quill.snow.css";
import "./textEditor.css";
import { io, Socket } from "socket.io-client";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: {} }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

export default function TextEditor() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [quill, setQuill] = useState<Quill | null>(null);

  useEffect(() => {
    const socketInstance = io("http://localhost:3001");
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // For receiving events from the server
  useEffect(() => {
    if (!socket || !quill) {
      return;
    }

    const handler = (delta: DeltaStatic) => {
      console.log('------------------', delta);
      quill.updateContents(delta);
    };
    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-changes", handler);
    };
  }, [quill, socket]);

  // For sending events to the server
  useEffect(() => {
    if (!socket || !quill) {
      return;
    }

    const handler = (
      delta: DeltaStatic,
      _oldDelta: DeltaStatic,
      source: Sources
    ) => {
      if (source !== "user") {
        return;
      }
      socket.emit("send-changes", delta);
    };

    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [quill, socket]);

  const containerRef = useCallback((wrapper: HTMLDivElement) => {
    if (!wrapper) {
      return;
    }
    wrapper.innerHTML = "";
    const editor = document.createElement("div");

    wrapper.appendChild(editor);

    const quillInstance = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    setQuill(quillInstance);

    return () => {
      wrapper.innerHTML = "";
    };
  }, []);

  return <div className="container" ref={containerRef}></div>;
}

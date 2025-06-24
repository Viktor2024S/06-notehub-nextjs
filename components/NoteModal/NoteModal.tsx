"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import NoteForm from "../NoteForm/NoteForm";
import css from "./NoteModal.module.css";

interface NoteModalProps {
  onClose: () => void;
}

export default function NoteModal({ onClose }: NoteModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return mounted
    ? createPortal(
        <div className={css.backdrop} onClick={handleBackdropClick}>
          <div className={css.modal}>
            <NoteForm onClose={onClose} />
          </div>
        </div>,
        document.body
      )
    : null;
}

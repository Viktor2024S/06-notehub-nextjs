"use client"; // <-- Переконайтесь, що цей рядок є на початку файлу

import { useEffect, useState, useRef } from "react"; // Додайте useRef
import { createPortal } from "react-dom";
import {
  Formik,
  Form,
  Field,
  ErrorMessage as FormikErrorMessage,
} from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { createNote } from "@/lib/api"; // Переконайтесь, що шлях правильний
import { NoteData, Tag } from "@/types/note";
import css from "./NoteModal.module.css";

interface NoteModalProps {
  onClose: () => void;
}

export default function NoteModal({ onClose }: NoteModalProps) {
  const [mounted, setMounted] = useState(false);
  const modalRootRef = useRef<HTMLElement | null>(null); // Використовуємо useRef для зберігання посилання

  useEffect(() => {
    // Код, що взаємодіє з `document`, повинен бути тут
    modalRootRef.current = document.getElementById("modal-root") as HTMLElement;
    setMounted(true); // Встановлюємо mounted в true, коли компонент змонтується на клієнті
    // Тут також можна додати створення 'modal-root' div, якщо його немає
    if (!modalRootRef.current) {
      const div = document.createElement("div");
      div.id = "modal-root";
      document.body.appendChild(div);
      modalRootRef.current = div;
    }

    // Логіка для блокування скролу тіла, якщо потрібно
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  // Якщо компонент ще не змонтувався на клієнті, не рендеримо портал
  if (!mounted || !modalRootRef.current) {
    return null;
  }

  const initialValues: NoteData = {
    title: "",
    content: "",
    tag: "Personal",
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    content: Yup.string().required("Content is required"),
    tag: Yup.string()
      .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
      .required("Tag is required"),
  });

  const handleSubmit = async (values: NoteData, { setSubmitting }: any) => {
    try {
      await createNote(values);
      toast.success("Note created successfully!");
      onClose(); // Закриваємо модалку після успішного створення
    } catch (error: any) {
      toast.error(`Error creating note: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className={css.overlay} onClick={onClose}>
      <div className={css.modal} onClick={(e) => e.stopPropagation()}>
        <button className={css.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Create New Note</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className={css.form}>
              <div className={css.formGroup}>
                <label htmlFor="title">Title</label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  className={css.input}
                />
                <FormikErrorMessage
                  name="title"
                  component="div"
                  className={css.error}
                />
              </div>

              <div className={css.formGroup}>
                <label htmlFor="content">Content</label>
                <Field
                  as="textarea"
                  id="content"
                  name="content"
                  className={css.textarea}
                />
                <FormikErrorMessage
                  name="content"
                  component="div"
                  className={css.error}
                />
              </div>

              <div className={css.formGroup}>
                <label htmlFor="tag">Tag</label>
                <Field as="select" id="tag" name="tag" className={css.select}>
                  <option value="Personal">Personal</option>
                  <option value="Work">Work</option>
                  <option value="Todo">Todo</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Shopping">Shopping</option>
                </Field>
                <FormikErrorMessage
                  name="tag"
                  component="div"
                  className={css.error}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={css.submitButton}
              >
                {isSubmitting ? "Creating..." : "Create Note"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>,
    modalRootRef.current // Рендеримо в елемент, який отримали через реф
  );
}

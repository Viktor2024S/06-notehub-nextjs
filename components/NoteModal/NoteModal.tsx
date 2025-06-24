"use client";

import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Formik,
  Form,
  Field,
  ErrorMessage as FormikErrorMessage,
  FormikHelpers,
} from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { createNote } from "@/lib/api";
import { NoteData } from "@/types/note";
import css from "./NoteModal.module.css";

interface NoteModalProps {
  onClose: () => void;
}

export default function NoteModal({ onClose }: NoteModalProps) {
  const [mounted, setMounted] = useState(false);
  const modalRootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let modalRoot = document.getElementById("modal-root") as HTMLElement | null;

    if (!modalRoot) {
      modalRoot = document.createElement("div");
      modalRoot.id = "modal-root";
      document.body.appendChild(modalRoot);
    }

    modalRootRef.current = modalRoot;
    setMounted(true);
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!mounted || !modalRootRef.current) return null;

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

  const handleSubmit = async (
    values: NoteData,
    { setSubmitting }: FormikHelpers<NoteData>
  ) => {
    try {
      await createNote(values);
      toast.success("Note created successfully!");
      onClose();
    } catch (error: unknown) {
      let message = "Unknown error";

      if (error instanceof Error) {
        message = error.message;
      } else if (typeof error === "string") {
        message = error;
      }

      toast.error(`Error creating note: ${message}`);
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
    modalRootRef.current
  );
}

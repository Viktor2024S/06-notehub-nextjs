"use client";

import { useEffect } from "react";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        padding: "20px",
        textAlign: "center",
        border: "1px solid #ff4d4f",
        borderRadius: "8px",
        backgroundColor: "#fff0f0",
        color: "#ff4d4f",
      }}
    >
      <h2>Сталася помилка при завантаженні нотатки.</h2>
      <p>
        {error.message ||
          "Схоже, такої нотатки не існує, або виникла проблема на сервері."}
      </p>
      <button
        onClick={() => reset()}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#0d6efd",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Спробувати ще раз
      </button>
      <p style={{ marginTop: "10px", fontSize: "12px", color: "#888" }}>
        Якщо проблема повториться, спробуйте повернутися на головну сторінку
        нотаток.
      </p>
    </div>
  );
}

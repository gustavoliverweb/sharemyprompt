"use client";

import { useState, useRef } from "react";

const ISSUE_OPTIONS = [
  "Error de compilación",
  "Problema con pago",
  "Activo no funciona",
  "Solicitud de reembolso",
  "Error en descarga",
  "Otro",
];

function ChevronDownIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

export function SupportForm() {
  const [issueType, setIssueType] = useState(ISSUE_OPTIONS[0]);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div
        className="flex flex-col items-center gap-4 py-12 px-8 rounded-xl text-center"
        style={{
          background: "rgba(98,60,234,0.1)",
          border: "1px solid rgba(98,60,234,0.3)",
        }}
      >
        <p className="text-white text-[20px] font-bold">Reporte enviado</p>
        <p className="text-[16px]" style={{ color: "rgba(242,242,242,0.6)" }}>
          Nuestros arquitectos de guardia revisarán tu reporte en breve.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setDescription("");
            setFiles([]);
          }}
          className="mt-2 text-[13px] underline underline-offset-2 transition-opacity hover:opacity-70"
          style={{ color: "rgba(242,242,242,0.5)" }}
        >
          Enviar otro reporte
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7">
      {/* Issue type dropdown */}
      <div className="flex flex-col gap-2">
        <label className="text-white text-[16px] font-medium leading-[1.625]">
          ¿En que podemos ayudarte?
        </label>
        <div className="relative">
          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            className="w-full appearance-none bg-transparent text-white text-[16px] px-5 py-3.5 rounded-lg outline-none cursor-pointer"
            style={{ border: "1px solid rgba(242,242,242,0.3)" }}
          >
            {ISSUE_OPTIONS.map((opt) => (
              <option
                key={opt}
                value={opt}
                style={{ background: "#1e1d2b", color: "#f2f2f2" }}
              >
                {opt}
              </option>
            ))}
          </select>
          <span
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "rgba(242,242,242,0.6)" }}
          >
            <ChevronDownIcon />
          </span>
        </div>
      </div>

      {/* Description textarea */}
      <div className="flex flex-col gap-2">
        <label className="text-white text-[16px] font-medium leading-[1.625]">
          Proporciona una descripción detallada del problema
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          placeholder="Describe el problema con el mayor detalle posible..."
          className="bg-transparent text-white text-[16px] px-5 py-3.5 rounded-lg outline-none resize-none placeholder:text-foreground/25 transition-colors focus:border-white/50"
          style={{ border: "1px solid rgba(242,242,242,0.3)" }}
        />
      </div>

      {/* File upload */}
      <div className="flex flex-col gap-2">
        <label className="text-white text-[16px] font-medium leading-[1.625]">
          Archivos adjuntos
        </label>
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className="flex flex-col items-center justify-center gap-3 px-5 py-10 rounded-lg cursor-pointer transition-colors"
          style={{
            border: `1px dashed ${dragging ? "rgba(98,60,234,0.8)" : "rgba(98,60,234,1)"}`,
            background: dragging ? "rgba(98,60,234,0.08)" : "transparent",
          }}
        >
          <span style={{ color: "rgba(242,242,242,0.4)" }}>
            <PaperclipIcon />
          </span>
          <p className="text-white text-[16px] font-medium text-center leading-[1.3]">
            Añade un archivo o arrastra y suelta archivos aquí
          </p>
          {files.length > 0 && (
            <ul className="flex flex-col gap-1 mt-1 w-full">
              {files.map((f, i) => (
                <li
                  key={i}
                  className="text-[12px] text-center"
                  style={{ color: "rgba(242,242,242,0.5)" }}
                >
                  {f.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="flex items-center gap-2 px-8 py-3 text-white font-bold text-[16px] leading-[1.5] transition-opacity hover:opacity-90 active:scale-[0.98]"
          style={{
            background: "linear-gradient(180deg, #623CEA 0%, #372284 94%)",
            borderRadius: "100px",
            boxShadow: "0px 0px 16px 4px rgba(98,60,234,0.3)",
          }}
        >
          <SendIcon />
          Enviar
        </button>
      </div>
    </form>
  );
}

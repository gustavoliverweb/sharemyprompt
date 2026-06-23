"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { ASSET_CATEGORIES, type CategoryId } from "@/lib/categories";

type ActiveTab = "configuracion" | "licencia" | "despliegue";
type ClassType = "PROMPT" | "FLUJO" | "AGENTE";
type OutputFormat = "JSON" | "MARKDOWN" | "TABLA" | "CODIGO";

export interface AssetInitialData {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  type: ClassType;
  category: string | null;
  roleDefinition: string | null;
  contentScope: string | null;
  taskDefinition: string | null;
  outputFormat: OutputFormat;
  restrictions: string[];
  promptContent: string | null;
  recommendedModel: string | null;
  price: string;
}

function HelpIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="text-foreground/30"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

const CLASS_CARDS = [
  {
    id: "PROMPT" as ClassType,
    category: "Prompt de",
    title: "Ingeniería",
    description:
      "Define el rol, función y límites de comportamiento de una inteligencia artificial.",
    dotColor: "bg-blue-400",
  },
  {
    id: "FLUJO" as ClassType,
    category: "Flujo de",
    title: "Automatización",
    description:
      "Secuencia de pasos diseñada para optimizar, delegar y orquestar tareas sin intervención.",
    dotColor: "bg-orange-400",
  },
  {
    id: "AGENTE" as ClassType,
    category: "Agente",
    title: "Autónomo",
    description:
      "Sistema de IA que percibe, razona y actúa de forma independiente bajo un objetivo.",
    dotColor: "bg-purple-400",
  },
];

const RECOMMENDED_MODELS = [
  "GPT-4o",
  "Claude Sonnet 4",
  "Gemini 1.5 Pro",
  "GPT-4 Turbo",
  "Claude Haiku 4",
  "Llama 3.1 70B",
];

const inputClass =
  "w-full px-4 py-3 rounded-lg text-sm text-white placeholder:text-foreground/25 focus:outline-none focus:border-primary/50 transition-colors";
const inputStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
};

function extractVariables(prompt: string): string[] {
  const matches = prompt.match(/\[([^\]]+)\]/g);
  if (!matches) return [];
  return [...new Set(matches.map((m) => m.slice(1, -1)))];
}

export function UploadConfigPanel({ initialData }: { initialData?: AssetInitialData }) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [activeTab, setActiveTab] = useState<ActiveTab>("configuracion");
  const [assetType, setAssetType] = useState<ClassType>(initialData?.type ?? "PROMPT");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>(initialData?.outputFormat ?? "JSON");
  const [modelOpen, setModelOpen] = useState(false);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [coverImage, setCoverImage] = useState<string | null>(initialData?.coverImage ?? null);
  const [imageUploading, setImageUploading] = useState(false);
  const [category, setCategory] = useState<CategoryId | "">(
    (initialData?.category as CategoryId) ?? ""
  );
  const [roleDefinition, setRoleDefinition] = useState(initialData?.roleDefinition ?? "");
  const [contentScope, setContentScope] = useState(initialData?.contentScope ?? "");
  const [taskDefinition, setTaskDefinition] = useState(initialData?.taskDefinition ?? "");
  const [restrictions, setRestrictions] = useState<string[]>(initialData?.restrictions ?? []);
  const [restrictionInput, setRestrictionInput] = useState("");
  const [promptContent, setPromptContent] = useState(initialData?.promptContent ?? "");
  const [recommendedModel, setRecommendedModel] = useState(initialData?.recommendedModel ?? "GPT-4o");
  const [price, setPrice] = useState(initialData?.price ?? "");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsgs, setErrorMsgs] = useState<string[]>([]);

  const restrictionInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    setImageUploading(false);
    if (res.ok) {
      setCoverImage(data.url);
    } else {
      setErrorMsgs([data.error ?? "Error al subir la imagen"]);
      setStatus("error");
    }
  }

  function addRestriction() {
    const val = restrictionInput.trim();
    if (val && !restrictions.includes(val)) {
      setRestrictions((prev) => [...prev, val]);
      setRestrictionInput("");
    }
  }

  function removeRestriction(r: string) {
    setRestrictions((prev) => prev.filter((x) => x !== r));
  }

  function handleRestrictionKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      addRestriction();
    }
  }

  function validateAndNext() {
    if (activeTab === "configuracion") {
      const errors: string[] = [];
      if (!title.trim()) errors.push("Título del activo");
      if (!description.trim()) errors.push("Descripción");
      if (!coverImage) errors.push("Imagen de portada");
      if (!category) errors.push("Categoría");
      if (!roleDefinition.trim()) errors.push("Definición de rol");
      if (!contentScope.trim()) errors.push("Delimitación de contenido");
      if (!taskDefinition.trim()) errors.push("Definición de tarea");
      if (!promptContent.trim()) errors.push("Prompt");
      if (errors.length > 0) { setErrorMsgs(errors); setStatus("error"); return; }
      setStatus("idle");
      setErrorMsgs([]);
      setActiveTab("licencia");
    } else if (activeTab === "licencia") {
      const errors: string[] = [];
      if (price === "" || price === null) errors.push("Precio (escribe 0 si es gratis)");
      else if (isNaN(Number(price)) || Number(price) < 0) errors.push("Precio debe ser un número mayor o igual a 0");
      if (errors.length > 0) { setErrorMsgs(errors); setStatus("error"); return; }
      setStatus("idle");
      setErrorMsgs([]);
      setActiveTab("despliegue");
    }
  }

  async function handleSubmit(publish: boolean) {
    if (!title.trim()) {
      setErrorMsgs(["Título del activo"]);
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsgs([]);

    const payload = {
      title,
      description,
      coverImage,
      type: assetType,
      category: category || null,
      price: price || "0",
      roleDefinition,
      contentScope,
      taskDefinition,
      outputFormat,
      restrictions,
      promptContent,
      recommendedModel,
      publish,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/assets/${initialData.id}` : "/api/assets",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(isEdit ? { action: "edit", ...payload } : payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setErrorMsgs([data.error ?? "Error al guardar el activo."]);
        setStatus("error");
        return;
      }

      setStatus("success");
      if (!isEdit) {
        setTitle(""); setDescription(""); setCoverImage(null); setCategory(""); setRoleDefinition(""); setContentScope("");
        setTaskDefinition(""); setRestrictions([]); setPromptContent(""); setPrice("");
      }
      router.refresh();
    } catch {
      setErrorMsgs(["Error de conexión. Intenta de nuevo."]);
      setStatus("error");
    }
  }

  const variables = extractVariables(promptContent);
  const isLoading = status === "loading";

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-7">
      {/* Title + Step indicator */}
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-white">
          {isEdit ? "Editar activo" : "Configurar activo"}
        </h2>
        <div className="flex items-center gap-2">
          {([
            { key: "configuracion", label: "Configuración", step: 1 },
            { key: "licencia", label: "Licencia", step: 2 },
            { key: "despliegue", label: "Despliegue", step: 3 },
          ] as { key: ActiveTab; label: string; step: number }[]).map(({ key, label, step }, i) => {
            const isDone = (activeTab === "licencia" && step === 1) || (activeTab === "despliegue" && step < 3);
            const isActive = activeTab === key;
            return (
              <div key={key} className="flex items-center gap-2">
                {i > 0 && (
                  <div
                    className="w-8 h-px"
                    style={{ background: isDone ? "rgba(98,60,234,0.6)" : "rgba(255,255,255,0.1)" }}
                  />
                )}
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                    style={
                      isActive
                        ? { background: "#623CEA", color: "#fff" }
                        : isDone
                          ? { background: "rgba(98,60,234,0.3)", color: "#a78bfa" }
                          : { background: "rgba(255,255,255,0.06)", color: "rgba(242,242,242,0.3)" }
                    }
                  >
                    {isDone ? "✓" : step}
                  </div>
                  <span
                    className="text-xs md:text-sm font-medium"
                    style={{ color: isActive ? "#fff" : isDone ? "rgba(167,139,250,0.8)" : "rgba(242,242,242,0.3)" }}
                  >
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating success toast */}
      {status === "success" && (
        <div
          className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl text-sm text-white shadow-lg max-w-sm"
          style={{ background: "rgba(5,199,147,0.18)", border: "1px solid rgba(5,199,147,0.35)", backdropFilter: "blur(8px)" }}
        >
          {isEdit ? "¡Activo actualizado correctamente!" : "¡Activo guardado! Puedes verlo en tu panel de usuario."}
        </div>
      )}

      {/* Floating error toast */}
      {status === "error" && errorMsgs.length > 0 && (
        <div
          className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl text-sm shadow-lg max-w-xs"
          style={{ background: "rgba(20,16,30,0.95)", border: "1px solid rgba(239,68,68,0.4)", backdropFilter: "blur(8px)" }}
        >
          <p className="font-semibold mb-2" style={{ color: "#f87171" }}>
            {errorMsgs.length === 1 ? "Campo requerido:" : "Campos requeridos:"}
          </p>
          <ul className="flex flex-col gap-1">
            {errorMsgs.map((msg) => (
              <li key={msg} className="flex items-center gap-2 text-[12px]" style={{ color: "rgba(248,113,113,0.85)" }}>
                <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                {msg}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── TAB: CONFIGURACIÓN ── */}
      {activeTab === "configuracion" && (
        <>
          {/* Title + Description */}
          <section className="flex flex-col gap-5 max-w-[640px]">
            <h3 className="text-base font-semibold text-white">Información general</h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-foreground/60">
                Título del activo <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Generador de prompts cinematográficos"
                className={inputClass}
                style={inputStyle}
                maxLength={120}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-foreground/60">Descripción <span className="text-red-400">*</span></label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe brevemente qué hace este activo..."
                rows={3}
                className={`${inputClass} resize-none`}
                style={inputStyle}
                maxLength={500}
              />
            </div>

            {/* Cover image */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-foreground/60">Imagen de portada <span className="text-red-400">*</span></label>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleImageChange}
              />
              {coverImage ? (
                <div className="relative w-full max-w-[320px] h-[160px] rounded-lg overflow-hidden group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverImage} alt="Portada" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="text-[12px] font-medium text-white px-3 py-1.5 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.15)" }}
                    >
                      Cambiar
                    </button>
                    <button
                      type="button"
                      onClick={() => setCoverImage(null)}
                      className="text-[12px] font-medium text-red-400 px-3 py-1.5 rounded-lg"
                      style={{ background: "rgba(226,85,85,0.15)" }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={imageUploading}
                  className="flex flex-col items-center justify-center gap-2 w-full max-w-[320px] h-[120px] rounded-lg border-dashed transition-colors hover:border-primary/40 disabled:opacity-50"
                  style={{ border: "2px dashed rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.02)" }}
                >
                  {imageUploading ? (
                    <span className="text-[13px]" style={{ color: "rgba(242,242,242,0.4)" }}>Subiendo...</span>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "rgba(242,242,242,0.3)" }} aria-hidden><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <span className="text-[12px]" style={{ color: "rgba(242,242,242,0.35)" }}>
                        Subir imagen <span style={{ color: "rgba(242,242,242,0.2)" }}>· JPG, PNG, WEBP · máx 4 MB</span>
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>
          </section>

          {/* Classification */}
          <section className="flex flex-col gap-4">
            <h3 className="text-base font-semibold text-white">Clasificación</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[800px]">
              {CLASS_CARDS.map(({ id, category, title: cardTitle, description: cardDesc, dotColor }) => (
                <button
                  key={id}
                  onClick={() => setAssetType(id)}
                  className="flex flex-col gap-3 p-4 rounded-xl text-left transition-all"
                  style={
                    assetType === id
                      ? {
                          background: "rgba(98,60,234,0.1)",
                          border: "1px solid rgba(98,60,234,0.4)",
                        }
                      : {
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.07)",
                        }
                  }
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
                  <div>
                    <p className="text-[11px] font-medium" style={{ color: "#00F5FF" }}>
                      {category}
                    </p>
                    <p className="text-base font-bold text-white mt-0.5">{cardTitle}</p>
                  </div>
                  <p className="text-[12px] text-foreground/45 leading-relaxed">{cardDesc}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Category */}
          <section className="flex flex-col gap-4">
            <h3 className="text-base font-semibold text-white">Categoría <span className="text-red-400">*</span></h3>
            <div className="flex flex-wrap gap-2 max-w-[640px]">
              {ASSET_CATEGORIES.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setCategory(id)}
                  className="px-4 py-2 rounded-pill text-[13px] font-medium transition-all"
                  style={
                    category === id
                      ? {
                          background: "rgba(98,60,234,0.2)",
                          border: "1px solid rgba(98,60,234,0.5)",
                          color: "#a78bfa",
                        }
                      : {
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          color: "rgba(242,242,242,0.45)",
                        }
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          {/* Technical configuration */}
          <section className="flex flex-col gap-5 max-w-[640px]">
            <h3 className="text-base font-semibold text-white">Configuración técnica</h3>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm text-foreground/60">Definición de rol <span className="text-red-400">*</span></label>
              <textarea
                value={roleDefinition}
                onChange={(e) => setRoleDefinition(e.target.value)}
                placeholder="Ej: Actúa como un fotógrafo experto en cinematografía..."
                rows={3}
                className={`${inputClass} resize-none`}
                style={inputStyle}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <label className="text-sm text-foreground/60">Delimitación de contenido <span className="text-red-400">*</span></label>
                <HelpIcon />
              </div>
              <textarea
                value={contentScope}
                onChange={(e) => setContentScope(e.target.value)}
                placeholder="Delimita una o más áreas temáticas del activo..."
                rows={3}
                className={`${inputClass} resize-none`}
                style={inputStyle}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <label className="text-sm text-foreground/60">Definición de tarea <span className="text-red-400">*</span></label>
                <HelpIcon />
              </div>
              <textarea
                value={taskDefinition}
                onChange={(e) => setTaskDefinition(e.target.value)}
                placeholder="Define el objetivo principal del activo..."
                rows={3}
                className={`${inputClass} resize-none`}
                style={inputStyle}
              />
            </div>

            {/* Output format */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <label className="text-sm text-foreground/60">Estructura de salida</label>
                <HelpIcon />
              </div>
              <div
                className="flex gap-1 p-1 rounded-lg self-start"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {(["JSON", "MARKDOWN", "TABLA", "CODIGO"] as OutputFormat[]).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setOutputFormat(fmt)}
                    className={`px-3 py-1.5 rounded text-[12px] font-medium transition-colors ${
                      outputFormat === fmt
                        ? "text-white"
                        : "text-foreground/40 hover:text-foreground/60"
                    }`}
                    style={outputFormat === fmt ? { background: "rgba(98,60,234,0.35)" } : {}}
                  >
                    {fmt === "CODIGO" ? "Código" : fmt.charAt(0) + fmt.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Restrictions */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <label className="text-sm text-foreground/60">Restricciones</label>
                <HelpIcon />
              </div>
              {restrictions.length > 0 && (
                <ul className="flex flex-col gap-1 mb-1">
                  {restrictions.map((r) => (
                    <li
                      key={r}
                      className="flex items-center gap-2 text-[12px] text-foreground/50"
                    >
                      <span className="w-1 h-1 rounded-full bg-foreground/30 shrink-0" />
                      <span className="flex-1">{r}</span>
                      <button
                        onClick={() => removeRestriction(r)}
                        className="text-foreground/30 hover:text-red-400 transition-colors"
                        aria-label="Eliminar restricción"
                      >
                        <XIcon />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex gap-2">
                <input
                  ref={restrictionInputRef}
                  type="text"
                  value={restrictionInput}
                  onChange={(e) => setRestrictionInput(e.target.value)}
                  onKeyDown={handleRestrictionKey}
                  placeholder="Añade una restricción y presiona Enter..."
                  className={`${inputClass} flex-1`}
                  style={inputStyle}
                />
                <button
                  onClick={addRestriction}
                  className="px-4 py-2 rounded-lg text-[12px] font-medium text-foreground/60 hover:text-white transition-colors shrink-0"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  Añadir
                </button>
              </div>
            </div>

            {/* Prompt + Variables */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex flex-col gap-1.5">
                <label className="text-sm text-foreground/60">Prompt <span className="text-red-400">*</span></label>
                <textarea
                  value={promptContent}
                  onChange={(e) => setPromptContent(e.target.value)}
                  placeholder="Escribe tu prompt. Usa [variable] para marcar variables dinámicas..."
                  rows={6}
                  className={`${inputClass} resize-none leading-relaxed`}
                  style={inputStyle}
                />
              </div>

              <div className="flex flex-col gap-1.5 w-full md:w-[180px] md:shrink-0">
                <div className="flex items-center gap-1.5">
                  <label className="text-sm text-foreground/60">Variables</label>
                  <HelpIcon />
                </div>
                <div
                  className="flex flex-col gap-1.5 px-3 py-3 rounded-lg min-h-[80px]"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {variables.length === 0 ? (
                    <span className="text-[11px] text-foreground/25">
                      Usa [nombre] en el prompt
                    </span>
                  ) : (
                    variables.map((v) => (
                      <span key={v} className="text-[11px]" style={{ color: "#00F5FF" }}>
                        {v}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Recommended model */}
            <div className="flex flex-col gap-1.5 relative max-w-xs">
              <label className="text-sm text-foreground/60">Modelo recomendado</label>
              <button
                onClick={() => setModelOpen((o) => !o)}
                className="flex items-center justify-between px-4 py-3 rounded-lg w-full"
                style={inputStyle}
              >
                <span className="text-sm text-white">{recommendedModel}</span>
                <ChevronDownIcon />
              </button>
              {modelOpen && (
                <div
                  className="absolute top-full mt-1 left-0 right-0 rounded-lg overflow-hidden z-10"
                  style={{
                    background: "#1e1c2a",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  {RECOMMENDED_MODELS.map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        setRecommendedModel(m);
                        setModelOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-white/5 ${
                        recommendedModel === m ? "text-white" : "text-foreground/60"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* ── TAB: LICENCIA ── */}
      {activeTab === "licencia" && (
        <section className="flex flex-col gap-5 max-w-[640px]">
          <h3 className="text-base font-semibold text-white">Licencia y precio</h3>

          <div className="flex flex-col gap-1.5 max-w-[260px]">
            <label className="text-sm text-foreground/60">Precio (USD) <span className="text-red-400">*</span></label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-foreground/40">
                $
              </span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className={`${inputClass} pl-8`}
                style={inputStyle}
              />
            </div>
            <p className="text-[11px] text-foreground/35">
              Escribe 0 para distribuir gratis.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm text-foreground/60">Tipo de licencia</label>
            {[
              { id: "personal", label: "Uso personal", desc: "Solo puede usarse de forma privada, sin redistribución." },
              { id: "comercial", label: "Uso comercial", desc: "Permite usarlo en proyectos comerciales del comprador." },
              { id: "libre", label: "Sin restricciones", desc: "El comprador puede usar, modificar y redistribuir libremente." },
            ].map(({ id, label, desc }) => (
              <label
                key={id}
                className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <input type="radio" name="license" value={id} className="mt-0.5 accent-primary" defaultChecked={id === "personal"} />
                <div>
                  <p className="text-sm text-white font-medium">{label}</p>
                  <p className="text-[12px] text-foreground/45 mt-0.5">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </section>
      )}

      {/* ── TAB: DESPLIEGUE ── */}
      {activeTab === "despliegue" && (
        <section className="flex flex-col gap-5 max-w-[540px]">
          <h3 className="text-base font-semibold text-white">Publicar activo</h3>

          <div
            className="p-5 rounded-xl flex flex-col gap-3"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <p className="text-sm text-foreground/60 leading-relaxed">
              Al enviar a revisión, un administrador evaluará tu activo. Si cumple con los criterios de calidad,
              será publicado en el marketplace. Si es rechazado, recibirás una razón y podrás corregirlo y reenviar.
            </p>
            <ul className="flex flex-col gap-1.5 mt-1">
              {[
                { label: "Título", ok: title.trim().length > 0 },
                { label: "Prompt", ok: promptContent.trim().length > 0 },
                { label: "Precio definido", ok: true },
              ].map(({ label, ok }) => (
                <li key={label} className="flex items-center gap-2 text-[12px]">
                  <span className={ok ? "text-emerald-400" : "text-foreground/30"}>
                    {ok ? "✓" : "○"}
                  </span>
                  <span className={ok ? "text-foreground/70" : "text-foreground/30"}>{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-3 pt-2 pb-4">
        {activeTab !== "configuracion" && (
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === "despliegue" ? "licencia" : "configuracion")}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-pill text-sm font-semibold transition-all hover:opacity-80 disabled:opacity-40"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(242,242,242,0.5)",
            }}
          >
            ← Anterior
          </button>
        )}

        <button
          onClick={() => handleSubmit(false)}
          disabled={isLoading}
          className="px-5 py-2.5 rounded-pill text-sm font-semibold transition-all hover:opacity-80 disabled:opacity-40"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(242,242,242,0.75)",
          }}
        >
          {isLoading ? "Guardando..." : "Guardar borrador"}
        </button>

        {activeTab !== "despliegue" ? (
          <button
            type="button"
            onClick={validateAndNext}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-pill text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, #623cea 0%, #372284 100%)",
              boxShadow: "0 0 14px rgba(98,60,234,0.35)",
            }}
          >
            Siguiente →
          </button>
        ) : (
          <button
            onClick={() => handleSubmit(true)}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-pill text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, #623cea 0%, #372284 100%)",
              boxShadow: "0 0 14px rgba(98,60,234,0.35)",
            }}
          >
            {isLoading ? "Enviando..." : "Enviar a revisión"}
          </button>
        )}
      </div>
    </div>
  );
}

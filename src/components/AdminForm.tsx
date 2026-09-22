import { useRef, useState } from "react";
import { toast } from "sonner";
import { type Field } from "@/lib/admin-schema";
import { cloudinaryConfigured, uploadToCloudinary } from "@/lib/cloudinary";

type Obj = Record<string, unknown>;

/* Cloudinary upload button — picks a file, uploads, hands back the URL. */
function UploadButton({ onUploaded, accept = "image/*" }: { onUploaded: (url: string) => void; accept?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const configured = cloudinaryConfigured();

  return (
    <>
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = ""; // allow re-picking the same file
          if (!file) return;
          setBusy(true);
          try {
            const url = await uploadToCloudinary(file);
            onUploaded(url);
            toast.success("Uploaded");
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Upload failed");
          } finally {
            setBusy(false);
          }
        }}
      />
      <button
        type="button"
        disabled={busy || !configured}
        title={configured ? "Upload from your device" : "Set up Cloudinary in src/lib/cloudinary.ts first"}
        onClick={() => ref.current?.click()}
        className="shrink-0 rounded-[7px] border border-border bg-card px-2.5 py-1 text-[11px] tracking-tight text-foreground/60 hover:text-foreground hover:border-foreground/25 transition disabled:opacity-40"
      >
        {busy ? "Uploading…" : "⬆ Upload"}
      </button>
    </>
  );
}

/* Small square preview for image fields. Hides itself if the src is empty or
   fails to load, so broken/placeholder paths don't leave a broken-image icon. */
function ImageThumb({ src }: { src?: string }) {
  const url = (src ?? "").trim();
  return (
    <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-[7px] border border-border bg-secondary/50 text-[9px] text-foreground/30">
      {url ? (
        <img
          src={url}
          alt=""
          className="h-full w-full object-cover"
          onError={(e) => ((e.currentTarget as HTMLImageElement).style.visibility = "hidden")}
        />
      ) : (
        "img"
      )}
    </div>
  );
}

const inputCls =
  "w-full rounded-[8px] border border-border bg-background px-3 py-2 text-[13px] text-foreground outline-none focus:border-foreground/30 transition";
const labelCls = "block text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/45 mb-1.5";
const helpCls = "mt-1 text-[10px] text-foreground/35 leading-relaxed";
const smallBtn =
  "rounded-[7px] border border-border bg-card px-2.5 py-1 text-[11px] tracking-tight text-foreground/60 hover:text-foreground hover:border-foreground/25 transition";

/* Render a list of schema fields against a value object; calls onChange with a
   new object whenever any field changes. Recurses for object-list fields. */
export function AdminForm({
  fields,
  value,
  onChange,
}: {
  fields: Field[];
  value: Obj;
  onChange: (next: Obj) => void;
}) {
  const set = (key: string, v: unknown) => onChange({ ...value, [key]: v });

  return (
    <div className="space-y-5">
      {fields.map((f) => (
        <FieldView key={f.key} field={f} value={value[f.key]} onChange={(v) => set(f.key, v)} />
      ))}
    </div>
  );
}

function FieldView({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  if (field.kind === "text") {
    return (
      <div>
        <label className={labelCls}>{field.label}</label>
        {field.textarea ? (
          <textarea
            className={`${inputCls} min-h-[80px] resize-y`}
            value={(value as string) ?? ""}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <input
            className={inputCls}
            value={(value as string) ?? ""}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
        {field.help && <p className={helpCls}>{field.help}</p>}
      </div>
    );
  }

  if (field.kind === "select") {
    return (
      <div>
        <label className={labelCls}>{field.label}</label>
        <select className={inputCls} value={(value as string) ?? ""} onChange={(e) => onChange(e.target.value)}>
          <option value="" disabled>
            Choose…
          </option>
          {field.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.kind === "bool") {
    return (
      <label className="flex items-center gap-2.5 cursor-pointer select-none">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-border"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="text-[12px] tracking-tight text-foreground/70">{field.label}</span>
      </label>
    );
  }

  if (field.kind === "stringList") {
    const list = Array.isArray(value) ? (value as string[]) : [];
    const update = (next: string[]) => onChange(next);
    return (
      <div>
        <label className={labelCls}>{field.label}</label>
        {field.help && <p className={`${helpCls} mt-0 mb-1.5`}>{field.help}</p>}
        <div className="space-y-1.5">
          {list.map((item, i) => (
            <div key={i} className="flex gap-1.5">
              <input
                className={inputCls}
                value={item}
                onChange={(e) => update(list.map((x, j) => (j === i ? e.target.value : x)))}
              />
              <button
                type="button"
                className={smallBtn}
                onClick={() => update(list.filter((_, j) => j !== i))}
                aria-label="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button type="button" className={`${smallBtn} mt-1.5`} onClick={() => update([...list, ""])}>
          + Add
        </button>
      </div>
    );
  }

  if (field.kind === "image") {
    return (
      <div>
        <label className={labelCls}>{field.label}</label>
        <div className="flex gap-2">
          <ImageThumb src={value as string} />
          <div className="flex-1">
            <div className="flex gap-1.5">
              <input
                className={inputCls}
                value={(value as string) ?? ""}
                placeholder="Upload, or paste a URL"
                onChange={(e) => onChange(e.target.value)}
              />
              <UploadButton onUploaded={(url) => onChange(url)} />
            </div>
            {field.help && <p className={helpCls}>{field.help}</p>}
          </div>
        </div>
      </div>
    );
  }

  if (field.kind === "video") {
    const url = ((value as string) ?? "").trim();
    return (
      <div>
        <label className={labelCls}>{field.label}</label>
        <div className="flex gap-1.5">
          <input
            className={inputCls}
            value={(value as string) ?? ""}
            placeholder="Upload, or paste a YouTube / .mp4 URL"
            onChange={(e) => onChange(e.target.value)}
          />
          <UploadButton accept="video/*" onUploaded={(u) => onChange(u)} />
        </div>
        {url && <p className={helpCls}>✓ Video set</p>}
        {!url && field.help && <p className={helpCls}>{field.help}</p>}
      </div>
    );
  }

  if (field.kind === "file") {
    const url = ((value as string) ?? "").trim();
    return (
      <div>
        <label className={labelCls}>{field.label}</label>
        <div className="flex gap-1.5">
          <input
            className={inputCls}
            value={(value as string) ?? ""}
            placeholder="Upload, or paste a PDF URL / /path"
            onChange={(e) => onChange(e.target.value)}
          />
          <UploadButton accept="application/pdf" onUploaded={(u) => onChange(u)} />
        </div>
        {url ? (
          <div className="mt-2 overflow-hidden rounded-[8px] border border-border">
            <iframe src={url} title="PDF preview" className="w-full border-0 pointer-events-none" style={{ height: 140 }} />
          </div>
        ) : (
          field.help && <p className={helpCls}>{field.help}</p>
        )}
      </div>
    );
  }

  if (field.kind === "imageList") {
    const list = Array.isArray(value) ? (value as string[]) : [];
    const update = (next: string[]) => onChange(next);
    const move = (i: number, dir: -1 | 1) => {
      const j = i + dir;
      if (j < 0 || j >= list.length) return;
      const next = [...list];
      [next[i], next[j]] = [next[j], next[i]];
      update(next);
    };
    return (
      <div>
        <label className={labelCls}>{field.label}</label>
        {field.help && <p className={`${helpCls} mt-0 mb-1.5`}>{field.help}</p>}
        <div className="space-y-1.5">
          {list.map((item, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <ImageThumb src={item} />
              <input
                className={inputCls}
                value={item}
                placeholder="Upload, or paste a URL"
                onChange={(e) => update(list.map((x, j) => (j === i ? e.target.value : x)))}
              />
              <UploadButton onUploaded={(url) => update(list.map((x, j) => (j === i ? url : x)))} />
              <button type="button" className={smallBtn} onClick={() => move(i, -1)} aria-label="Move up">
                ↑
              </button>
              <button type="button" className={smallBtn} onClick={() => move(i, 1)} aria-label="Move down">
                ↓
              </button>
              <button
                type="button"
                className={smallBtn}
                onClick={() => update(list.filter((_, j) => j !== i))}
                aria-label="Remove"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="mt-1.5 flex gap-1.5">
          <button type="button" className={smallBtn} onClick={() => update([...list, ""])}>
            + Add image
          </button>
          <UploadButton onUploaded={(url) => update([...list, url])} />
        </div>
      </div>
    );
  }

  if (field.kind === "videoList") {
    const list = Array.isArray(value) ? (value as string[]) : [];
    const update = (next: string[]) => onChange(next);
    const move = (i: number, dir: -1 | 1) => {
      const j = i + dir;
      if (j < 0 || j >= list.length) return;
      const next = [...list];
      [next[i], next[j]] = [next[j], next[i]];
      update(next);
    };
    return (
      <div>
        <label className={labelCls}>{field.label}</label>
        {field.help && <p className={`${helpCls} mt-0 mb-1.5`}>{field.help}</p>}
        <div className="space-y-2">
          {list.map((item, i) => (
            <div key={i} className="rounded-[10px] border border-border bg-secondary/30 p-3">
              <div className="flex items-center gap-1.5 mb-2">
                <input
                  className={inputCls}
                  value={item}
                  placeholder="Upload, or paste a .mp4 URL"
                  onChange={(e) => update(list.map((x, j) => (j === i ? e.target.value : x)))}
                />
                <UploadButton accept="video/*" onUploaded={(url) => update(list.map((x, j) => (j === i ? url : x)))} />
                <button type="button" className={smallBtn} onClick={() => move(i, -1)} aria-label="Move up">↑</button>
                <button type="button" className={smallBtn} onClick={() => move(i, 1)} aria-label="Move down">↓</button>
                <button type="button" className={smallBtn} onClick={() => update(list.filter((_, j) => j !== i))} aria-label="Remove">✕</button>
              </div>
              {/* Inline video preview */}
              {item.trim() && (
                <video
                  src={item.trim()}
                  className="w-full rounded-[7px] border border-border bg-black"
                  style={{ maxHeight: 160, aspectRatio: "9/16", objectFit: "cover" }}
                  muted
                  playsInline
                  controls
                />
              )}
            </div>
          ))}
        </div>
        <div className="mt-1.5 flex gap-1.5">
          <button type="button" className={smallBtn} onClick={() => update([...list, ""])}>
            + Add reel
          </button>
          <UploadButton accept="video/*" onUploaded={(url) => update([...list, url])} />
        </div>
      </div>
    );
  }

  if (field.kind === "object") {
    const obj = value && typeof value === "object" ? (value as Obj) : null;
    const enable = () => {
      const o: Obj = {};
      field.fields.forEach((sf) => {
        o[sf.key] = sf.kind === "stringList" || sf.kind === "imageList" || sf.kind === "objectList" ? [] : sf.kind === "bool" ? false : "";
      });
      onChange(o);
    };
    return (
      <div>
        <label className="flex items-center gap-2.5 cursor-pointer select-none mb-2">
          <input type="checkbox" className="h-4 w-4 rounded border-border" checked={!!obj} onChange={(e) => (e.target.checked ? enable() : onChange(undefined))} />
          <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/45">{field.label}</span>
        </label>
        {obj && (
          <div className="rounded-[10px] border border-border bg-secondary/30 p-3">
            <AdminForm fields={field.fields} value={obj} onChange={(next) => onChange(next)} />
          </div>
        )}
      </div>
    );
  }

  // objectList
  const list = Array.isArray(value) ? (value as Obj[]) : [];
  const update = (next: Obj[]) => onChange(next);
  const blank = (): Obj => {
    const o: Obj = {};
    field.fields.forEach((sf) => {
      if (sf.kind === "stringList" || sf.kind === "imageList" || sf.kind === "objectList") o[sf.key] = [];
      else if (sf.kind === "bool") o[sf.key] = false;
      else if (sf.kind === "object") o[sf.key] = undefined;
      else o[sf.key] = "";
    });
    return o;
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    update(next);
  };

  return (
    <div>
      <label className={labelCls}>{field.label}</label>
      {field.help && <p className={`${helpCls} mt-0 mb-1.5`}>{field.help}</p>}
      <div className="space-y-3">
        {list.map((item, i) => (
          <div key={i} className="rounded-[10px] border border-border bg-secondary/30 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.12em] text-foreground/35">
                {field.label.replace(/\s*\(optional\)$/, "")} #{i + 1}
              </span>
              <div className="flex gap-1">
                <button type="button" className={smallBtn} onClick={() => move(i, -1)} aria-label="Move up">
                  ↑
                </button>
                <button type="button" className={smallBtn} onClick={() => move(i, 1)} aria-label="Move down">
                  ↓
                </button>
                <button
                  type="button"
                  className={smallBtn}
                  onClick={() => update(list.filter((_, j) => j !== i))}
                  aria-label="Remove"
                >
                  ✕
                </button>
              </div>
            </div>
            <AdminForm
              fields={field.fields}
              value={item}
              onChange={(next) => update(list.map((x, j) => (j === i ? next : x)))}
            />
          </div>
        ))}
      </div>
      <button type="button" className={`${smallBtn} mt-2`} onClick={() => update([...list, blank()])}>
        + Add {field.label.replace(/\s*\(optional\)$/, "").toLowerCase()}
      </button>
    </div>
  );
}

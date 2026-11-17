import Image from "next/image";

/**
 * The SYNERGOX mark and name. The mark is the original logo file, shown
 * exactly as supplied: square, uncropped, never recoloured.
 */
export default function Brand({
  size = 34,
  onDark = false,
  priority = false,
  tag,
}: {
  size?: number;
  onDark?: boolean;
  priority?: boolean;
  /** small label after the name, e.g. "Admin" */
  tag?: string;
}) {
  return (
    <span className="flex items-center gap-2.5">
      <Image src="/logo.png" alt="" width={size} height={size} priority={priority} className="block" />
      <span
        className={`font-display text-[1.06rem] font-extrabold uppercase leading-none ${onDark ? "text-white" : "text-ink"}`}
        style={{ fontStretch: "88%", letterSpacing: "0.06em" }}
      >
        SYNERGOX
      </span>
      {tag && (
        <span className="rounded-[3px] bg-mist px-1.5 py-1 font-mono text-[0.62rem] font-medium uppercase leading-none tracking-[0.12em] text-mute">
          {tag}
        </span>
      )}
    </span>
  );
}

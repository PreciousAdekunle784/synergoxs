/* Small inline icons. Server-safe, inherit colour from `currentColor`. */

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden
      className={`arrow shrink-0 ${className}`}
    >
      <path
        d="M3 7.5h9m0 0L8.5 4M12 7.5 8.5 11"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Check({
  className = "",
  size = 16,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden
      className={`shrink-0 ${className}`}
    >
      <path
        d="M3.5 8l3 3 5-7"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Cross({
  className = "",
  size = 14,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 15 15"
      fill="none"
      aria-hidden
      className={`shrink-0 ${className}`}
    >
      <path
        d="M4 4l7 7M11 4l-7 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Green disc with a black tick — the site's standard "included" marker. */
export function Tick({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green text-ink ${className}`}
    >
      <Check size={11} />
    </span>
  );
}

/** The arrow in its own tile, used at the end of the main buttons. */
export function ArrowTile() {
  return (
    <span aria-hidden className="arrow-tile">
      <svg width="16" height="16" viewBox="0 0 15 15" fill="none">
        <path d="M3 7.5h9m0 0L8.5 4M12 7.5 8.5 11" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function Lock({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 15 15" fill="none" aria-hidden className={`shrink-0 ${className}`}>
      <path d="M4.5 6.5V4.75a3 3 0 0 1 6 0V6.5M3.5 6.5h8v6h-8v-6Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export function Download({ className = "" }: { className?: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden className={`shrink-0 ${className}`}>
      <path d="M7.5 2v8m0 0L4.5 7m3 3 3-3M2.5 12.5h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A square green tick: the "included" marker in package and order lists. */
export function Included({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`mt-[3px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[3px] bg-green text-ink ${className}`}>
      <Check size={11} />
    </span>
  );
}

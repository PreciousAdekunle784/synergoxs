/* Short green rule + label. Sits above every section head. Server-safe. */
export default function Eyebrow({
  children,
  center = false,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3 ${center ? "justify-center" : ""}`}>
      <span aria-hidden className="h-[3px] w-6 shrink-0 rounded-full bg-green" />
      <span className="eyebrow">{children}</span>
    </div>
  );
}

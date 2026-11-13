/** Each page eases in when you navigate to it. CSS only. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page">{children}</div>;
}

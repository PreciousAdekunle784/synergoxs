/**
 * Emails are written as a short list of blocks and rendered twice from the
 * same source: an HTML version and a plain-text version. Mostly text, one
 * button, nothing an inbox would treat as a brochure.
 */
export type Block =
  | { p: string }
  | { h: string }
  | { list: string[] }
  | { steps: string[] }
  | { button: { label: string; url: string } }
  | { link: { label: string; url: string } }
  | { ledger: { label: string; value: string; strong?: boolean; struck?: boolean }[] }
  | { note: string }
  | { sign: string };

export type RenderedEmail = { subject: string; html: string; text: string };

const INK = "#0A0C0A";
const BODY = "#343A34";
const MUTE = "#6B736B";
const LINE = "#E3E6E1";
const GREEN = "#00C551";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** **bold** is the only inline markup. Everything else is escaped. */
const inline = (s: string) => esc(s).replace(/\*\*(.+?)\*\*/g, `<strong style="color:${INK};font-weight:600">$1</strong>`);
const plain = (s: string) => s.replace(/\*\*(.+?)\*\*/g, "$1");

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

function blockHtml(b: Block): string {
  if ("p" in b)
    return `<p style="margin:0 0 18px;font:400 16px/1.65 ${FONT};color:${BODY}">${inline(b.p)}</p>`;
  if ("h" in b)
    return `<h2 style="margin:30px 0 12px;font:700 19px/1.3 ${FONT};color:${INK};letter-spacing:-0.01em">${inline(b.h)}</h2>`;
  if ("list" in b)
    return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;width:100%">${b.list
      .map(
        (i) =>
          `<tr><td style="width:22px;vertical-align:top;padding:5px 0;font:700 16px/1.6 ${FONT};color:${GREEN}">&#8212;</td><td style="padding:5px 0;font:400 16px/1.6 ${FONT};color:${BODY}">${inline(i)}</td></tr>`
      )
      .join("")}</table>`;
  if ("steps" in b)
    return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;width:100%">${b.steps
      .map(
        (i, n) =>
          `<tr><td style="width:30px;vertical-align:top;padding:6px 0;font:700 13px/1.9 ${FONT};color:${INK}">${String(n + 1).padStart(2, "0")}</td><td style="padding:6px 0;font:400 16px/1.6 ${FONT};color:${BODY}">${inline(i)}</td></tr>`
      )
      .join("")}</table>`;
  if ("button" in b)
    return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0 28px"><tr><td style="border-radius:4px;background:${GREEN}"><a href="${esc(b.button.url)}" style="display:inline-block;padding:15px 26px;font:700 15px/1 ${FONT};color:${INK};text-decoration:none;letter-spacing:0.03em;text-transform:uppercase">${esc(b.button.label)} &rarr;</a></td></tr></table>`;
  if ("link" in b)
    return `<p style="margin:0 0 18px;font:400 16px/1.65 ${FONT};color:${BODY}"><a href="${esc(b.link.url)}" style="color:${INK};font-weight:600;text-decoration:underline;text-decoration-color:${GREEN};text-underline-offset:3px">${esc(b.link.label)}</a></p>`;
  if ("ledger" in b)
    return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;width:100%;border-top:2px solid ${INK};border-bottom:2px solid ${INK}">${b.ledger
      .map(
        (r, i) =>
          `<tr><td style="padding:11px 0;${i ? `border-top:1px dashed ${LINE};` : ""}font:${r.strong ? 700 : 400} 15px/1.4 ${FONT};color:${r.strong ? INK : BODY}">${esc(r.label)}</td><td align="right" style="padding:11px 0;${i ? `border-top:1px dashed ${LINE};` : ""}font:${r.strong ? 700 : 500} 15px/1.4 'SFMono-Regular',Consolas,Menlo,monospace;color:${r.struck ? MUTE : INK};white-space:nowrap;${r.struck ? "text-decoration:line-through;" : ""}">${esc(r.value)}</td></tr>`
      )
      .join("")}</table>`;
  if ("note" in b)
    return `<p style="margin:0 0 18px;padding:14px 16px;background:#F5F6F4;border-left:3px solid ${GREEN};font:400 15px/1.6 ${FONT};color:${BODY}">${inline(b.note)}</p>`;
  return `<p style="margin:26px 0 0;font:400 16px/1.65 ${FONT};color:${BODY}">${inline(b.sign).replace(/\n/g, "<br>")}</p>`;
}

function blockText(b: Block): string {
  if ("p" in b) return plain(b.p);
  if ("h" in b) return `${plain(b.h).toUpperCase()}`;
  if ("list" in b) return b.list.map((i) => `- ${plain(i)}`).join("\n");
  if ("steps" in b) return b.steps.map((i, n) => `${n + 1}. ${plain(i)}`).join("\n");
  if ("button" in b) return `${b.button.label}:\n${b.button.url}`;
  if ("link" in b) return `${b.link.label}: ${b.link.url}`;
  if ("ledger" in b) return b.ledger.map((r) => `${r.label}: ${r.value}`).join("\n");
  if ("note" in b) return plain(b.note);
  return plain(b.sign);
}

export type Chrome = {
  siteUrl: string;
  /** the short grey line that shows next to the subject in an inbox */
  preheader: string;
  /** why they are getting this, shown in the footer */
  reason: string;
  unsubscribeUrl?: string;
  location: string;
};

export function render(subject: string, blocks: Block[], c: Chrome): RenderedEmail {
  const footer = [
    esc(c.reason),
    c.unsubscribeUrl
      ? `<a href="${esc(c.unsubscribeUrl)}" style="color:${MUTE};text-decoration:underline">Unsubscribe</a> in one click.`
      : "",
    `SYNERGOX &middot; ${esc(c.location)}`,
  ]
    .filter(Boolean)
    .join("<br>");

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:#F5F6F4">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(c.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F6F4"><tr><td align="center" style="padding:28px 14px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border:1px solid ${LINE};border-radius:6px">
<tr><td style="padding:26px 34px 0">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td style="vertical-align:middle"><img src="${esc(c.siteUrl)}/logo.png" width="34" height="34" alt="" style="display:block;border:0"></td>
<td style="vertical-align:middle;padding-left:10px;font:800 16px/1 ${FONT};color:${INK};letter-spacing:0.04em">SYNERGOX</td>
</tr></table>
</td></tr>
<tr><td style="padding:26px 34px 34px">
${blocks.map(blockHtml).join("\n")}
</td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px"><tr><td style="padding:18px 34px;font:400 12px/1.7 ${FONT};color:${MUTE}">${footer}</td></tr></table>
</td></tr></table>
</body></html>`;

  const text = [
    ...blocks.map(blockText),
    "—",
    c.reason,
    c.unsubscribeUrl ? `Unsubscribe: ${c.unsubscribeUrl}` : "",
    `SYNERGOX · ${c.location}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  return { subject, html, text };
}

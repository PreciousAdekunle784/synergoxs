"use client";

import { useMemo, useState } from "react";
import { deletePackage, saveBundle, saveCurrency, saveExitOffer, savePackage } from "@/lib/admin/actions";
import { formatMoney, parseMajor, percentOff, toMajorInput } from "@/lib/money";
import type { Bundle, ExitOffer, Package } from "@/lib/funnel/types";
import { ActionForm, ConfirmDelete, SubmitButton } from "./Form";

const hint = "mt-1.5 text-[0.8rem] leading-relaxed text-mute";
const SYMBOL: Record<string, string> = { NGN: "₦", GHS: "GH₵", KES: "KSh", ZAR: "R", USD: "$" };

function Check({ name, label, help, defaultChecked }: { name: string; label: string; help?: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-start gap-3">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-1 h-4 w-4 shrink-0 accent-[#007A35]" />
      <span>
        <span className="block text-[0.92rem] font-semibold text-ink">{label}</span>
        {help && <span className="block text-[0.82rem] leading-relaxed text-mute">{help}</span>}
      </span>
    </label>
  );
}

function PriceInput({ id, name, currency, defaultValue, onChange, placeholder }: { id: string; name: string; currency: string; defaultValue: string; onChange?: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex">
      <span className="flex items-center rounded-l-btn border border-r-0 border-line bg-mist px-3 font-mono text-[0.9rem] text-body">{SYMBOL[currency] ?? currency}</span>
      <input id={id} name={name} inputMode="decimal" defaultValue={defaultValue} onChange={(e) => onChange?.(e.target.value)} placeholder={placeholder} className="a-input rounded-l-none font-mono" />
    </div>
  );
}

/* ───────────────────────── Packages ───────────────────────── */
export function PackageForm({ pkg, currency, index }: { pkg: Package | null; currency: string; index?: number }) {
  const k = pkg?.id ?? "new";
  return (
    <ActionForm action={savePackage} resetOnSuccess={!pkg} className="space-y-4">
      {pkg && <input type="hidden" name="id" value={pkg.id} />}
      <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr]">
        <div>
          <label htmlFor={`name-${k}`} className="a-label">Package name</label>
          <input id={`name-${k}`} name="name" defaultValue={pkg?.name ?? ""} maxLength={80} required className="a-input" placeholder="e.g. Email Follow-up System" />
        </div>
        <div>
          <label htmlFor={`price-${k}`} className="a-label">Price (one-time)</label>
          <PriceInput id={`price-${k}`} name="price" currency={currency} defaultValue={toMajorInput(pkg?.price_minor)} placeholder="150000" />
        </div>
      </div>
      <div>
        <label htmlFor={`aud-${k}`} className="a-label">Who it&apos;s for</label>
        <input id={`aud-${k}`} name="audience" defaultValue={pkg?.audience ?? ""} maxLength={300} className="a-input" placeholder="For businesses that…" />
      </div>
      <div>
        <label htmlFor={`desc-${k}`} className="a-label">Description</label>
        <textarea id={`desc-${k}`} name="description" rows={3} defaultValue={pkg?.description ?? ""} maxLength={800} className="a-input" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label htmlFor={`del-${k}`} className="a-label">Deliverables</label>
          <textarea id={`del-${k}`} name="deliverables" rows={7} defaultValue={(pkg?.deliverables ?? []).join("\n")} className="a-input" />
          <p className={hint}>One per line. Add a line to add a deliverable; delete a line to remove one.</p>
        </div>
        <div>
          <label htmlFor={`scope-${k}`} className="a-label">Scope and delivery terms</label>
          <textarea id={`scope-${k}`} name="scope" rows={7} defaultValue={(pkg?.scope ?? []).join("\n")} className="a-input" />
          <p className={hint}>One per line: limits, revisions, what is not included. Shown under the deliverables and at checkout.</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor={`time-${k}`} className="a-label">Delivery time</label>
          <input id={`time-${k}`} name="delivery_time" defaultValue={pkg?.delivery_time ?? ""} maxLength={120} className="a-input" placeholder="2–3 weeks" />
        </div>
        <div>
          <label htmlFor={`sort-${k}`} className="a-label">Position on the page</label>
          <input id={`sort-${k}`} name="sort_order" type="number" defaultValue={pkg?.sort_order ?? (index ?? 0) + 1} className="a-input" />
          <p className={hint}>Lower numbers come first.</p>
        </div>
        {!pkg && (
          <div>
            <label htmlFor="slug-new" className="a-label">Link name <span className="font-normal text-mute">(optional)</span></label>
            <input id="slug-new" name="slug" maxLength={60} className="a-input font-mono" placeholder="made from the name" />
            <p className={hint}>Used in the checkout address. Can&apos;t be changed later.</p>
          </div>
        )}
      </div>
      <div className="grid gap-3 rounded-btn bg-mist p-4 sm:grid-cols-2">
        <Check name="active" label="Show on the sales page" help="Off: hidden everywhere, and left out of the bundle's total." defaultChecked={pkg?.active ?? true} />
        <Check name="checkout_enabled" label="Can be bought online" help="Off: the package is still shown, with a “talk to us” button instead of checkout." defaultChecked={pkg?.checkout_enabled ?? true} />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <SubmitButton>{pkg ? "Save package" : "Add package"}</SubmitButton>
      </div>
    </ActionForm>
  );
}

export function PackageDelete({ id, name }: { id: string; name: string }) {
  return (
    <ConfirmDelete
      action={deletePackage}
      fields={{ id }}
      label="Delete package"
      question={`Delete “${name}”? It is removed from the sales page and from the bundle. Past orders keep their record.`}
      align="right"
    />
  );
}

export function CurrencyForm({ currency }: { currency: string }) {
  return (
    <ActionForm action={saveCurrency} className="flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="currency" className="a-label">Currency for all prices</label>
        <select id="currency" name="currency" defaultValue={currency} className="a-input min-w-[12rem]">
          <option value="NGN">NGN — Nigerian naira (₦)</option>
          <option value="GHS">GHS — Ghanaian cedi</option>
          <option value="KES">KES — Kenyan shilling</option>
          <option value="ZAR">ZAR — South African rand</option>
          <option value="USD">USD — US dollar</option>
        </select>
      </div>
      <SubmitButton className="a-btn-quiet">Save currency</SubmitButton>
    </ActionForm>
  );
}

/* ───────────────────────── Bundle ───────────────────────── */
export function BundleForm({ bundle, packages, currency }: { bundle: Bundle; packages: Package[]; currency: string }) {
  const [picked, setPicked] = useState<string[]>(bundle.package_ids);
  const [price, setPrice] = useState(toMajorInput(bundle.price_minor));

  // The same sums the database does, shown live while editing.
  const calc = useMemo(() => {
    const inc = packages.filter((p) => picked.includes(p.id) && p.active);
    const total = inc.reduce((a, p) => a + p.price_minor, 0);
    const p = parseMajor(price);
    return { inc, total, price: p, savings: p === null ? null : total - p };
  }, [packages, picked, price]);
  const genuine = calc.inc.length >= 2 && calc.price !== null && calc.price > 0 && (calc.savings ?? 0) > 0;

  return (
    <ActionForm action={saveBundle} className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="space-y-4">
        <div>
          <label htmlFor="b-name" className="a-label">Bundle name</label>
          <input id="b-name" name="name" defaultValue={bundle.name} maxLength={80} required className="a-input" />
        </div>
        <div>
          <label htmlFor="b-headline" className="a-label">Headline</label>
          <textarea id="b-headline" name="headline" rows={2} defaultValue={bundle.headline ?? ""} maxLength={200} className="a-input" />
          <p className={hint}>The line in green italics under the bundle&apos;s name.</p>
        </div>
        <div>
          <label htmlFor="b-desc" className="a-label">Description</label>
          <textarea id="b-desc" name="description" rows={3} defaultValue={bundle.description ?? ""} maxLength={800} className="a-input" />
        </div>

        <fieldset>
          <legend className="a-label">Packages included</legend>
          <div className="divide-y divide-line rounded-btn border border-line">
            {packages.map((p) => (
              <label key={p.id} className={`flex items-center gap-3 px-4 py-3 ${p.active ? "" : "opacity-60"}`}>
                <input
                  type="checkbox"
                  name="package_ids"
                  value={p.id}
                  checked={picked.includes(p.id)}
                  onChange={(e) => setPicked((cur) => (e.target.checked ? [...cur, p.id] : cur.filter((x) => x !== p.id)))}
                  className="h-4 w-4 shrink-0 accent-[#007A35]"
                />
                <span className="min-w-0 flex-1 text-[0.93rem] text-ink">
                  {p.name}
                  {!p.active && <span className="ml-2 text-[0.8rem] text-mute">(hidden package: not counted)</span>}
                </span>
                <span className="num font-mono text-[0.9rem] text-body">{formatMoney(p.price_minor, currency)}</span>
              </label>
            ))}
            {packages.length === 0 && <p className="px-4 py-3 text-[0.9rem] text-mute">Add packages first.</p>}
          </div>
        </fieldset>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label htmlFor="b-extras" className="a-label">Only in the bundle</label>
            <textarea id="b-extras" name="extras" rows={4} defaultValue={bundle.extras.join("\n")} className="a-input" />
            <p className={hint}>One per line. Things buyers get only when they take everything together.</p>
          </div>
          <div>
            <label htmlFor="b-scope" className="a-label">Scope and delivery terms</label>
            <textarea id="b-scope" name="scope" rows={4} defaultValue={bundle.scope.join("\n")} className="a-input" />
            <p className={hint}>One per line. What the bundle covers and what it doesn&apos;t.</p>
          </div>
        </div>
      </div>

      {/* The sums */}
      <div className="self-start rounded-card border border-ink p-5 lg:sticky lg:top-6">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-mute">Pricing</p>
        <dl className="mt-3">
          {calc.inc.map((p) => (
            <div key={p.id} className="flex items-baseline justify-between gap-4 border-b border-dashed border-line py-2 text-[0.9rem]">
              <dt className="text-body">{p.name}</dt>
              <dd className="num font-mono text-ink">{formatMoney(p.price_minor, currency)}</dd>
            </div>
          ))}
          <div className="flex items-baseline justify-between gap-4 border-b-2 border-ink py-3">
            <dt className="text-[0.86rem] font-semibold text-ink">Combined individual value</dt>
            <dd className="num font-mono text-[1.05rem] font-medium text-ink">{formatMoney(calc.total, currency)}</dd>
          </div>
        </dl>
        <div className="mt-4">
          <label htmlFor="b-price" className="a-label">Bundle price (one-time)</label>
          <PriceInput id="b-price" name="price" currency={currency} defaultValue={toMajorInput(bundle.price_minor)} onChange={setPrice} />
        </div>
        <div className={`mt-4 rounded-btn p-4 ${genuine ? "bg-greenTint" : "bg-[#FEF6F5]"}`} aria-live="polite">
          {genuine ? (
            <>
              <p className="text-[0.82rem] font-semibold text-greenDeep">Buyers save</p>
              <p className="num mt-1 font-mono text-[1.6rem] font-medium leading-none text-greenDeep">{formatMoney(calc.savings, currency)}</p>
              <p className="mt-1.5 text-[0.82rem] text-greenDeep">{percentOff(calc.total, calc.price ?? 0)}% less than buying separately.</p>
            </>
          ) : (
            <p className="text-[0.86rem] font-medium leading-relaxed text-[#8A1C12]">
              {calc.inc.length < 2
                ? "Include at least two active packages."
                : calc.price === null || calc.price <= 0
                  ? "Enter a bundle price."
                  : "This price isn't lower than buying the packages separately, so it can't be shown as a saving. The bundle can only be switched on with a genuinely lower price."}
            </p>
          )}
        </div>
        <div className="mt-4">
          <Check name="active" label="Bundle is live" help="Off: the Growth Suite section and the exit offer are hidden. Individual packages are unaffected." defaultChecked={bundle.active} />
        </div>
        <div className="mt-5">
          <SubmitButton>Save bundle</SubmitButton>
        </div>
      </div>
    </ActionForm>
  );
}

/* ───────────────────────── Exit-intent offer ───────────────────────── */
export function ExitOfferForm({ offer, bundle, currency }: { offer: ExitOffer; bundle: Bundle; currency: string }) {
  const [special, setSpecial] = useState(toMajorInput(offer.special_price_minor));
  const parsed = special.trim() === "" ? null : parseMajor(special);
  const effective = parsed !== null && parsed > 0 && parsed < bundle.price_minor ? parsed : bundle.price_minor;
  const badSpecial = special.trim() !== "" && (parsed === null || parsed <= 0 || parsed >= bundle.price_minor);

  return (
    <ActionForm action={saveExitOffer} className="space-y-6">
      <div className="rounded-btn bg-mist p-4">
        <Check name="enabled" label="Exit offer is switched on" help="Off: the popup never appears. Nothing else on the sales page changes." defaultChecked={offer.enabled} />
      </div>

      <fieldset className="space-y-4">
        <legend className="a-h2 mb-1">Wording</legend>
        <div>
          <label htmlFor="x-headline" className="a-label">Headline</label>
          <input id="x-headline" name="headline" defaultValue={offer.headline} maxLength={120} required className="a-input" />
        </div>
        <div>
          <label htmlFor="x-sub" className="a-label">Second headline</label>
          <textarea id="x-sub" name="subheadline" rows={2} defaultValue={offer.subheadline} maxLength={200} className="a-input" />
        </div>
        <div>
          <label htmlFor="x-body" className="a-label">Supporting copy</label>
          <textarea id="x-body" name="body" rows={3} defaultValue={offer.body} maxLength={600} className="a-input" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="x-cta" className="a-label">Main button</label>
            <input id="x-cta" name="cta_label" defaultValue={offer.cta_label} maxLength={80} required className="a-input" />
          </div>
          <div>
            <label htmlFor="x-no" className="a-label">“No thanks” line</label>
            <input id="x-no" name="dismiss_label" defaultValue={offer.dismiss_label} maxLength={120} required className="a-input" />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="a-h2 mb-1">The offer</legend>
        <p className="text-[0.9rem] leading-relaxed text-body">
          The popup always sells <strong className="font-semibold text-ink">{bundle.name}</strong>, with its packages, deliverables and
          combined value ({formatMoney(bundle.total_minor, currency)}) taken from the bundle. Its normal price is{" "}
          <span className="num font-mono text-ink">{formatMoney(bundle.price_minor, currency)}</span>.
        </p>
        <div className="max-w-sm">
          <label htmlFor="x-special" className="a-label">Exit-only price <span className="font-normal text-mute">(optional)</span></label>
          <PriceInput id="x-special" name="special_price" currency={currency} defaultValue={toMajorInput(offer.special_price_minor)} onChange={setSpecial} placeholder="leave empty to use the bundle price" />
          <p className={hint}>
            A lower price offered only in this popup. It is a real price: anyone who accepts is charged exactly this.
            Leave empty to offer the normal bundle price.
          </p>
        </div>
        <p className={`rounded-btn p-3 text-[0.88rem] ${badSpecial ? "bg-[#FEF6F5] text-[#8A1C12]" : "bg-greenTint text-greenDeep"}`} aria-live="polite">
          {badSpecial
            ? `An exit-only price has to be lower than the bundle price (${formatMoney(bundle.price_minor, currency)}).`
            : `The popup will show ${formatMoney(effective, currency)} and a saving of ${formatMoney(Math.max(bundle.total_minor - effective, 0), currency)} against buying separately.`}
        </p>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="a-h2 mb-1">When it appears</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="x-sec" className="a-label">Minimum time on the page (seconds)</label>
            <input id="x-sec" name="min_seconds" type="number" min={5} max={600} defaultValue={offer.min_seconds} className="a-input" />
            <p className={hint}>Never shown before this, however the visitor moves.</p>
          </div>
          <div>
            <label htmlFor="x-scroll" className="a-label">Minimum scroll depth (%)</label>
            <input id="x-scroll" name="min_scroll_percent" type="number" min={0} max={90} defaultValue={offer.min_scroll_percent} className="a-input" />
            <p className={hint}>How far down the page they must have been. Both conditions must be met.</p>
          </div>
        </div>
        <Check name="desktop_trigger" label="Desktop: when the pointer leaves through the top of the page" help="Toward the tabs, the address bar or the close button." defaultChecked={offer.desktop_trigger} />
        <div className="max-w-md">
          <label htmlFor="x-mobile" className="a-label">Phones and tablets</label>
          <select id="x-mobile" name="mobile_trigger" defaultValue={offer.mobile_trigger} className="a-input">
            <option value="back_and_scroll">Back button, or a fast scroll back to the top</option>
            <option value="back">Back button only</option>
            <option value="scroll_up">Fast scroll back to the top only</option>
            <option value="off">Don&apos;t show on touch devices</option>
          </select>
          <p className={hint}>There is no pointer on a phone, so leaving is read from these instead.</p>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="a-h2 mb-1">After it&apos;s dismissed</legend>
        <div className="max-w-sm">
          <label htmlFor="x-days" className="a-label">Keep it hidden for (days)</label>
          <input id="x-days" name="suppress_days" type="number" min={0} max={365} defaultValue={offer.suppress_days} className="a-input" />
          <p className={hint}>
            0 = hidden for the rest of that visit only. It is never shown twice in one visit, and never to someone who
            has bought on that device.
          </p>
        </div>
      </fieldset>

      <SubmitButton>Save exit offer</SubmitButton>
    </ActionForm>
  );
}

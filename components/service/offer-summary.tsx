import Image from "next/image";
import { cn, labelText } from "@/lib/cn";
import type { ServiceBrief } from "@/types/site";
import { sectionTitle } from "@/components/service/offer-styles";

export function OfferSummary({ brief }: { brief: ServiceBrief }) {
  const offer = brief.offer;
  if (!offer) return null;

  return (
    <>
      <section className="content-piece flex flex-col gap-2.5">
        <h2 className={sectionTitle}>Services</h2>
        <ul className="grid grid-cols-2 gap-2.5">
          {offer.services.map((item) => (
            <li key={item} className="relative pl-[18px] text-base leading-relaxed text-foreground">
              <span className="absolute top-[0.55em] left-0 size-1.5 bg-accent" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {brief.video ? (
        <section className="content-piece flex flex-col gap-2.5">
          <h2 className={sectionTitle}>Video</h2>
          {brief.video.src ? (
            <video
              className="aspect-video w-full max-w-md border border-border bg-black object-cover"
              controls
              playsInline
              preload="metadata"
              poster={brief.video.poster}
              src={brief.video.src}
            />
          ) : (
            <div className="relative aspect-video w-full max-w-md overflow-hidden border border-border bg-black">
              <Image src={brief.video.poster} alt="" fill className="object-cover" sizes="448px" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex size-14 items-center justify-center rounded-full border border-foreground/40 bg-black/55 text-foreground">
                  <span className="ml-1 size-0 border-y-[9px] border-l-[14px] border-y-transparent border-l-foreground" />
                </span>
              </span>
            </div>
          )}
        </section>
      ) : (
        <section className="content-piece flex flex-col gap-2.5">
          <h2 className={sectionTitle}>Pictures</h2>
          <div className="grid min-h-[120px] max-w-md grid-cols-2 overflow-hidden border border-border" aria-hidden="true">
            <div className="flex items-end bg-[linear-gradient(160deg,rgb(18_18_18_/_0.35),rgb(0_0_0_/_0.55)),url('/bg/photo.jpg')] bg-cover bg-center p-3 text-[length:var(--text-label)] uppercase tracking-[0.12em] text-muted-foreground">
              <span>{brief.beforeLabel}</span>
            </div>
            <div className="flex items-end bg-[linear-gradient(160deg,rgb(225_29_46_/_0.28),rgb(0_0_0_/_0.55)),url('/bg/graphic.jpg')] bg-cover bg-center p-3 text-[length:var(--text-label)] uppercase tracking-[0.12em] text-foreground">
              <span>{brief.afterLabel}</span>
            </div>
          </div>
        </section>
      )}

      <dl className={cn("content-piece grid gap-4", brief.time && "grid-cols-2")}>
        <div className="min-w-0">
          <dt className={labelText}>Price</dt>
          <dd className="font-heading text-[length:var(--text-lead)] text-foreground">{brief.price}</dd>
          {offer.priceNote ? (
            <p className="mt-2 max-w-[65ch] text-base leading-relaxed text-muted-foreground">{offer.priceNote}</p>
          ) : null}
        </div>
        {brief.time ? (
          <div className="min-w-0">
            <dt className={labelText}>Time</dt>
            <dd className="font-heading text-[length:var(--text-lead)] text-foreground">{brief.time}</dd>
          </div>
        ) : null}
      </dl>
    </>
  );
}

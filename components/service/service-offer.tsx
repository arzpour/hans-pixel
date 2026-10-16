"use client";

import { useId, useReducer, useRef, useState } from "react";
import { OfferFields } from "@/components/service/offer-fields";
import { OfferFiles } from "@/components/service/offer-files";
import { OfferSubmit } from "@/components/service/offer-submit";
import { OfferSummary } from "@/components/service/offer-summary";
import { NoteField } from "@/components/service/note-field";
import { useOrderSend } from "@/hooks/use-order-send";
import { buildOfferNote, initialOfferForm, offerFormReducer } from "@/lib/offer-form";
import { offerPayable } from "@/lib/pricing";
import { useOrders } from "@/providers/orders-provider";
import { useSession } from "@/providers/session-provider";
import type { OfferUpload, ServiceBrief } from "@/types/site";

const fallbackUpload: OfferUpload = { id: "files", label: "Upload here", tag: "" };

export function ServiceOffer({ brief, serviceHref }: { brief: ServiceBrief; serviceHref: string | null }) {
  const offer = brief.offer;
  const id = useId();
  const { user, status } = useSession();
  const { priorCount, noteSent } = useOrders();
  const [form, dispatch] = useReducer(offerFormReducer, initialOfferForm);
  const [paid, setPaid] = useState(false);
  const uploadRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const signedIn = status === "ready" && Boolean(user);
  const paymentDue = signedIn && (priorCount ?? 0) > 0 && !paid;

  const sending = useOrderSend({
    serviceHref,
    getNote: () => (offer ? buildOfferNote(offer, form) : ""),
    blocked: paymentDue,
    resumeAfterRemove: true,
    onSent: () => {
      noteSent();
      setPaid(false);
    },
  });

  if (!offer) return null;

  const loading = status === "loading" || (signedIn && !sending.unauthorized && priorCount === null);
  const member = signedIn && !sending.unauthorized && !loading;
  const guest = !loading && !member;
  const needsPayment = member && (priorCount ?? 0) > 0 && !paid;
  const payable = offerPayable(brief.price, offer, form.quantity, form.ndeOn);
  const uploads = offer.uploads?.length ? offer.uploads : [fallbackUpload];
  const noteLabel = offer.noteLabel ?? "Add your editing notes";
  const noteHint = offer.noteHint ?? "Tell us what you'd like to change or achieve with your image.";
  const note = (
    <NoteField
      id={`${id}-note`}
      label={noteLabel}
      hint={noteHint}
      value={form.note}
      onChange={(value) => dispatch({ type: "note", value })}
    />
  );

  return (
    <div className="flex flex-col gap-4">
      <OfferSummary brief={brief} />
      <div className="content-piece flex flex-col gap-3">
        <OfferFields
          id={id}
          offer={offer}
          form={form}
          onNde={(value) => dispatch({ type: "nde", value })}
          onQuantity={(value) => dispatch({ type: "quantity", value })}
          onField={(label, value) => dispatch({ type: "field", label, value })}
          onGroup={(label, choice, custom) => dispatch({ type: "group", label, value: { choice, custom } })}
        />
        <div className="flex flex-col items-start gap-3">
          {offer.noteBeforeUploads ? note : null}
          <OfferFiles
            id={id}
            uploads={uploads}
            files={sending.files}
            uploadRefs={uploadRefs}
            onAdd={sending.addFiles}
            onRemove={(key) => sending.removeKey(key, true)}
          />
          {offer.noteBeforeUploads ? null : note}
          <OfferSubmit
            email={user?.email ?? null}
            loading={loading}
            guest={guest}
            member={member}
            priorCount={priorCount}
            needsPayment={needsPayment}
            payable={payable}
            sent={sending.sent}
            error={sending.error}
            busy={sending.busy}
            files={sending.files}
            onPay={() => setPaid(true)}
            onSend={() => void sending.send()}
          />
        </div>
      </div>
    </div>
  );
}

import { DownloadFile } from "@/components/order/download-file";
import { cn, labelText } from "@/lib/cn";
import { formatBytes } from "@/lib/format";
import { serviceTitle } from "@/lib/site";
import type { OrderView } from "@/types/order";

const STATUS_LABEL: Record<string, string> = {
  uploading: "Still sending",
  received: "Received",
  cancelled: "Cancelled",
  complete: "Stored",
};

function statusLabel(status: string) {
  return STATUS_LABEL[status] ?? status;
}

function orderDate(value: string) {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function OrderList({ orders, showSender = false }: { orders: OrderView[]; showSender?: boolean }) {
  if (orders.length === 0) {
    return <p className="text-base leading-relaxed text-muted-foreground">No orders yet.</p>;
  }

  return (
    <ul className="flex w-full flex-col gap-8">
      {orders.map((order, orderIndex) => {
        const note = order.note?.trim();
        const name = order.senderName?.trim();
        return (
          <li key={order.id} className="flex bg-muted">
            <span className="w-1 shrink-0 bg-accent" aria-hidden="true" />
            <div className="flex min-w-0 flex-1 flex-col gap-4 border border-l-0 border-border p-4">
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
              <p className={cn(labelText, "w-full text-accent")}>
                Order {String(orderIndex + 1).padStart(2, "0")}
              </p>
              <div className="min-w-0">
                <h2 className="font-heading text-base font-semibold leading-snug text-foreground">
                  {serviceTitle(order.serviceHref)}
                </h2>
                <p className="mt-1 text-base leading-relaxed text-muted-foreground">{orderDate(order.createdAt)}</p>
              </div>
              <p className={cn(labelText, "border border-border px-2 py-1 whitespace-nowrap")}>
                {statusLabel(order.status)}
              </p>
            </div>

            <dl className={cn("grid gap-3", showSender && "grid-cols-2 max-md:grid-cols-1")}>
              {showSender ? (
                <div className="min-w-0">
                  <dt className={labelText}>From</dt>
                  <dd className="mt-1 text-base leading-snug text-foreground">{name || "No name yet"}</dd>
                  <dd className="truncate text-base leading-relaxed text-muted-foreground">
                    {order.senderEmail || "No email"}
                  </dd>
                </div>
              ) : null}
              <div className="min-w-0">
                <dt className={labelText}>Note</dt>
                <dd className="mt-1 text-base leading-relaxed text-foreground">
                  {note || "No note with this order."}
                </dd>
              </div>
            </dl>

            <ul className="flex flex-col gap-3 border-t border-border pt-3">
              {order.files.map((file) => {
                const stored = file.status === "complete";
                return (
                  <li key={file.id} className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-base text-foreground">{file.name}</p>
                      <p className={cn(labelText, "mt-1")}>
                        {formatBytes(file.size)} · {statusLabel(file.status)}
                        {stored ? "" : ` · ${file.partsCompleted}/${file.partCount}`}
                      </p>
                    </div>
                    {stored ? (
                      <DownloadFile fileId={file.id} name={file.name} />
                    ) : (
                      <p className="text-base leading-relaxed text-muted-foreground">Not stored yet.</p>
                    )}
                  </li>
                );
              })}
            </ul>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

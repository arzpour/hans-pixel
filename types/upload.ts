export type UploadTarget = {
  id: string;
  name: string;
  size: number;
  partSize: number;
  partCount: number;
  mode: "presigned" | "direct";
};

export type SignedPart = {
  partNumber: number;
  url: string;
};

export type OpenUpload = {
  serviceHref: string;
  orderId: string;
  files: UploadTarget[];
};

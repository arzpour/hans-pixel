export type ServiceBrief = {
  describe?: string;
  beforeLabel: string;
  afterLabel: string;
  price: string;
  time: string;
  days?: string;
};

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "heading"; text: string }
  | { type: "steps"; items: { index: string; title: string; text: string }[] }
  | { type: "cases"; items: { title: string; meta: string; year: string; blurb: string }[] }
  | { type: "stats"; items: { value: string; label: string }[] }
  | { type: "service"; brief: ServiceBrief }
  | { type: "shop"; items: { title: string; price: string; days: string; blurb: string }[] }
  | { type: "auth" }
  | { type: "profile" }
  | { type: "orders" };

export type PageContent = {
  eyebrow?: string;
  title: string;
  lead?: string;
  layout?: "rail" | "viewport-center";
  pending?: boolean;
  blocks: ContentBlock[];
};

export type NavNode = {
  id: string;
  label: string;
  href: string;
  index: string;
  kicker?: string;
  content?: PageContent;
  children?: NavNode[];
};

export type ResolvedRoute = {
  pathname: string;
  section: NavNode | null;
  item: NavNode | null;
  depth: 0 | 1 | 2;
};

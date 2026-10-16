import type { NavNode } from "@/types/site";

export const account: NavNode = {
  id: "account",
  label: "Sign in / Sign up",
  href: "/account",
  index: "09",
  // kicker: "Member",
  content: {
    eyebrow: "Account",
    title: "Sign in to the desk.",
    lead: "We email a code. Open the link, and it is entered for you. No password.",
    blocks: [{ type: "auth" }],
  },
  children: [
    {
      id: "account-profile",
      label: "Profile",
      href: "/account/profile",
      index: "01",
      content: {
        eyebrow: "Account",
        title: "Your place on the desk.",
        lead: "The name, email, and mobile number on your orders.",
        blocks: [{ type: "profile" }],
      },
    },
    {
      id: "account-orders",
      label: "Orders",
      href: "/account/orders",
      index: "02",
      content: {
        eyebrow: "Account",
        title: "Your orders.",
        lead: "Who sent it, the service, the note, and the files.",
        blocks: [{ type: "orders" }],
      },
    },
    {
      id: "wallet",
      label: "Wallet",
      href: "/account/wallet",
      index: "03",
      content: {
        eyebrow: "Account",
        title: "Your wallet.",
        lead: "Coming soon.",
        blocks: [{ type: "wallet" }],
      },
    },
  ],
}

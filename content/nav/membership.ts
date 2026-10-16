import type { NavNode } from "@/types/site";

export const membership: NavNode = {
  id: "membership",
  label: "Membership",
  href: "/membership",
  index: "08",
  content: {
    // eyebrow: "Membership",
    title: "Credit for the work ahead.",
    lead: "Deposit the minimum for a term. Extra credit is added to your wallet. Anything left unused expires when the membership ends.",
    layout: "wide",
    blocks: [
      {
        type: "membership",
        plans: [
          {
            name: "Essential",
            term: "3 Months",
            deposit: "$500",
            bonus: "5%",
            credit: "$525",
            line: "Deposit $500 → Get $525 in Wallet Credit",
            expiry:
              "Your credit must be used within 3 months. Any unused balance will expire at the end of the membership period.",
          },
          {
            name: "Advanced",
            term: "6 Months",
            deposit: "$1,000",
            bonus: "10%",
            credit: "$1,100",
            line: "Deposit $1,000 → Get $1,100 in Wallet Credit",
            expiry:
              "Your credit must be used within 6 months. Any unused balance will expire at the end of the membership period.",
          },
          {
            name: "Elite",
            term: "12 Months",
            deposit: "$2,000",
            bonus: "15%",
            credit: "$2,300",
            line: "Deposit $2,000 → Get $2,300 in Wallet Credit",
            expiry:
              "Your credit must be used within 12 months. Any unused balance will expire at the end of the membership period.",
            featured: true,
          },
        ],
      },
    ],
  },
}

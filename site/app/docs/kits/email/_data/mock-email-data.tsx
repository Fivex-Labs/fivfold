import * as React from "react";
import type {
  FivFoldEmailFolder,
  FivFoldEmailLabel,
  FivFoldEmailThread,
  FivFoldEmailMessage,
  FivFoldEmailAttachment,
} from "@/components/ui/kits/email";

export const MOCK_FOLDERS: FivFoldEmailFolder[] = [
  { id: "inbox", label: "Inbox", count: 12 },
  { id: "sent", label: "Sent" },
  { id: "drafts", label: "Drafts", count: 2 },
  { id: "trash", label: "Trash" },
];

export const MOCK_LABELS: FivFoldEmailLabel[] = [
  { id: "work", name: "Work", color: "#3b82f6" },
  { id: "personal", name: "Personal", color: "#22c55e" },
  { id: "urgent", name: "Urgent", color: "#ef4444" },
];

export const MOCK_ATTACHMENTS: Record<string, FivFoldEmailAttachment[]> = {
  "att-1": [
    { id: "a1", name: "project-brief.pdf", size: "2.4 MB", ext: "pdf" },
    { id: "a2", name: "screenshot.png", size: "890 KB", ext: "png" },
  ],
  "att-2": [{ id: "a3", name: "invoice-q1.xlsx", size: "156 KB", ext: "xlsx" }],
};

function createMessage(
  id: string,
  from: string,
  to: string,
  datetime: string,
  body: React.ReactNode,
  attachments?: FivFoldEmailAttachment[]
): FivFoldEmailMessage {
  return {
    id,
    subject: "",
    from,
    to,
    datetime,
    body,
    ...(attachments && { attachments }),
  };
}

export const MOCK_THREADS: FivFoldEmailThread[] = [
  {
    id: "t1",
    from: "Sarah Chen",
    fromEmail: "sarah.chen@acme.com",
    subject: "Q4 Planning – Action Items",
    snippet: "Hi team, following up on our planning session. Here are the key action items we agreed on...",
    datetime: "10:32 AM",
    unread: true,
    starred: true,
    labels: ["work"],
    conversationCount: 3,
    messages: [
      createMessage(
        "m1-1",
        "Sarah Chen",
        "team@company.com",
        "Mon 9:15 AM",
        (
          <>
            <p>Hi team,</p>
            <p>Let&apos;s schedule our Q4 planning session. I&apos;ve attached the project brief for reference.</p>
            <p>Please review and share your availability.</p>
            <p>Best,<br />Sarah</p>
          </>
        ),
        MOCK_ATTACHMENTS["att-1"]
      ),
      createMessage(
        "m1-2",
        "Alex Rivera",
        "sarah.chen@acme.com, team@company.com",
        "Mon 10:02 AM",
        (
          <>
            <p>Thanks Sarah! I&apos;ve reviewed the brief. Tuesday 2pm works for me.</p>
            <p>— Alex</p>
          </>
        )
      ),
      createMessage(
        "m1-3",
        "Sarah Chen",
        "team@company.com",
        "Mon 10:32 AM",
        (
          <>
            <p>Following up on our planning session. Here are the key action items we agreed on:</p>
            <ul>
              <li>Finalize budget by Friday</li>
              <li>Design review on Wednesday</li>
              <li>Engineering kickoff next Monday</li>
            </ul>
            <p>Let me know if you have any questions.</p>
            <p>Sarah</p>
          </>
        )
      ),
    ],
  },
  {
    id: "t2",
    from: "Marcus Johnson",
    fromEmail: "marcus@startup.io",
    subject: "Re: Partnership opportunity",
    snippet: "Great to connect yesterday. I've shared the deck with our team. We're excited to explore...",
    datetime: "Yesterday",
    unread: true,
    labels: ["work", "urgent"],
    messages: [
      createMessage(
        "m2-1",
        "Marcus Johnson",
        "you@company.com",
        "Yesterday 4:45 PM",
        (
          <>
            <p>Great to connect yesterday!</p>
            <p>I&apos;ve shared the deck with our team. We&apos;re excited to explore this partnership. Can we schedule a follow-up call next week?</p>
            <p>Best,<br />Marcus</p>
          </>
        )
      ),
    ],
  },
  {
    id: "t3",
    from: "Emma Wilson",
    fromEmail: "emma@family.org",
    subject: "Weekend plans?",
    snippet: "Hey! Are we still on for brunch on Saturday? I found a new place downtown...",
    datetime: "Yesterday",
    starred: true,
    labels: ["personal"],
    messages: [
      createMessage(
        "m3-1",
        "Emma Wilson",
        "you@personal.com",
        "Yesterday 11:20 AM",
        (
          <>
            <p>Hey!</p>
            <p>Are we still on for brunch on Saturday? I found a new place downtown that looks amazing.</p>
            <p>Let me know!<br />Emma</p>
          </>
        )
      ),
    ],
  },
  {
    id: "t4",
    from: "Support",
    fromEmail: "support@service.com",
    subject: "Your order #4829 has shipped",
    snippet: "Good news! Your order is on its way. Track your package with the link below...",
    datetime: "Nov 8",
    messages: [
      createMessage(
        "m4-1",
        "Support",
        "you@email.com",
        "Nov 8, 2:30 PM",
        (
          <>
            <p>Good news! Your order #4829 has shipped.</p>
            <p>Track your package: <a href="#">Track shipment</a></p>
            <p>Estimated delivery: Nov 12–14</p>
          </>
        )
      ),
    ],
  },
  {
    id: "t5",
    from: "David Kim",
    fromEmail: "david@agency.co",
    subject: "Invoice for October services",
    snippet: "Please find attached the invoice for October. Payment terms are net 30...",
    datetime: "Nov 7",
    labels: ["work"],
    messages: [
      createMessage(
        "m5-1",
        "David Kim",
        "billing@company.com",
        "Nov 7, 9:00 AM",
        (
          <>
            <p>Please find attached the invoice for October services.</p>
            <p>Payment terms are net 30. Let me know if you have any questions.</p>
            <p>Thanks,<br />David</p>
          </>
        ),
        MOCK_ATTACHMENTS["att-2"]
      ),
    ],
  },
  {
    id: "t6",
    from: "Newsletter",
    fromEmail: "news@techweekly.com",
    subject: "This week in tech: AI updates, new frameworks",
    snippet: "Your weekly digest of the latest in technology. Featured: New AI models, React 19...",
    datetime: "Nov 6",
    messages: [
      createMessage(
        "m6-1",
        "Tech Weekly",
        "subscribers@list.com",
        "Nov 6, 8:00 AM",
        (
          <>
            <p>Your weekly digest of the latest in technology.</p>
            <p>Featured this week: New AI models, React 19 release, and more.</p>
            <p><a href="#">Read online</a> | <a href="#">Unsubscribe</a></p>
          </>
        )
      ),
    ],
  },
  {
    id: "t7",
    from: "Jordan Lee",
    fromEmail: "jordan@design.studio",
    subject: "Design feedback – Homepage v2",
    snippet: "I've updated the homepage based on your feedback. The hero section now has...",
    datetime: "Nov 5",
    unread: true,
    labels: ["work"],
    conversationCount: 2,
    messages: [
      createMessage(
        "m7-1",
        "Jordan Lee",
        "you@company.com",
        "Nov 5, 3:20 PM",
        (
          <>
            <p>I&apos;ve updated the homepage based on your feedback.</p>
            <p>The hero section now has the new CTA and the color palette is adjusted. Let me know what you think!</p>
            <p>Jordan</p>
          </>
        )
      ),
      createMessage(
        "m7-2",
        "You",
        "jordan@design.studio",
        "Nov 5, 4:15 PM",
        (
          <>
            <p>Looks great! One small note: can we make the CTA button slightly larger on mobile?</p>
          </>
        )
      ),
    ],
  },
  {
    id: "t8",
    from: "System",
    fromEmail: "noreply@auth.service.com",
    subject: "Verify your email address",
    snippet: "Click the link below to verify your email and complete your account setup...",
    datetime: "Nov 4",
    messages: [
      createMessage(
        "m8-1",
        "Auth Service",
        "you@email.com",
        "Nov 4, 10:00 AM",
        (
          <>
            <p>Click the link below to verify your email and complete your account setup.</p>
            <p><a href="#">Verify email</a></p>
            <p>This link expires in 24 hours.</p>
          </>
        )
      ),
    ],
  },
];

export const MOCK_CONTACTS = [
  "sarah.chen@acme.com",
  "alex@company.com",
  "marcus@startup.io",
  "emma@family.org",
  "david@agency.co",
  "jordan@design.studio",
  "team@company.com",
  "billing@company.com",
];

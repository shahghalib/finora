import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { ContactUs, DocPage } from '@/components/info/doc';

export const metadata: Metadata = {
  title: 'Help | Finora',
  description: 'Answers to common questions about transactions, budgets, alerts and your account.',
};

type Faq = { q: string; a: React.ReactNode };
type Group = { id: string; title: string; items: Faq[] };

// Every answer below describes behavior that exists in the app today.
// If a feature changes, update its answer here.
const GROUPS: Group[] = [
  {
    id: 'getting-started',
    title: 'Getting started',
    items: [
      {
        q: 'How do I get started?',
        a: (
          <p>
            Create an account with a username, email and password of at least 8 characters. A
            four-step setup then asks you to add an account such as cash or a bank, choose your
            main currency and set a first monthly budget. After that you land on your Overview.
          </p>
        ),
      },
      {
        q: 'Does Finora connect to my bank?',
        a: (
          <p>
            No. Finora never asks for your bank login. You add transactions yourself, and accounts
            are simply labels (cash wallet, bank account, debit card or credit card) that show
            where each purchase came from.
          </p>
        ),
      },
      {
        q: 'Which currencies can I use?',
        a: (
          <p>
            Pakistani rupee (PKR), US dollar (USD), Saudi riyal (SAR) and British pound (GBP). You
            choose your main currency during setup and can change it in Settings. Changing it
            doesn&apos;t convert amounts you&apos;ve already recorded.
          </p>
        ),
      },
    ],
  },
  {
    id: 'transactions',
    title: 'Transactions',
    items: [
      {
        q: 'How do I add a transaction?',
        a: (
          <p>
            Select Add Transaction in the sidebar, or the + button at the top on a phone. Enter
            the amount, currency, merchant, date and account, then save. Finora suggests a category
            from the merchant name, and you can accept it or pick your own.
          </p>
        ),
      },
      {
        q: 'How does Finora choose a category?',
        a: (
          <p>
            It looks for common merchant names in what you type: for example KFC or Foodpanda for
            Food, Careem or Uber for Transport, Netflix or Spotify for Entertainment, and Rent or
            Landlord for Rent. If nothing matches, or the suggestion is wrong, pick a category
            yourself.
          </p>
        ),
      },
      {
        q: 'What do “Auto-tagged” and “Manually Verified” mean?',
        a: (
          <p>
            Auto-tagged means Finora picked the category from the merchant name. Manually Verified
            means you chose the category yourself.
          </p>
        ),
      },
      {
        q: 'Can I edit or delete a transaction?',
        a: (
          <p>
            Not from the app at the moment, so check the details before you save a transaction.
          </p>
        ),
      },
      {
        q: 'How do I find an older transaction?',
        a: (
          <p>
            On the Transactions page, search by merchant or category, then narrow the list by date
            range (last 7, 30 or 90 days, or all time), category and account.
          </p>
        ),
      },
    ],
  },
  {
    id: 'budgets',
    title: 'Budgets and alerts',
    items: [
      {
        q: 'How do budgets work?',
        a: (
          <p>
            A budget is a spending limit for one category in one month. Open Budgets, select
            Create Budget, pick a category and enter the limit. You can have one budget per
            category per month. Each card shows what you&apos;ve spent, the percentage used and how
            much is left. Use the pencil to change a limit and the bin to delete a budget.
          </p>
        ),
      },
      {
        q: 'When do I get an alert?',
        a: (
          <p>
            When spending in a category reaches 80% of its monthly budget, and again when it
            reaches 100%. Each of those two alerts is sent once per budget. If Finora is open, you
            see a notification straight away. Every alert is also saved on the Alerts page, where
            you can mark it as read.
          </p>
        ),
      },
      {
        q: 'Why didn’t I get an alert?',
        a: (
          <p>
            Alerts only apply to categories that have a budget for the month of the transaction.
            Each threshold is sent once, so a budget that already sent its 80% alert won&apos;t send
            it again. Real-time notifications also need Finora open in your browser. Anything you
            missed is on the Alerts page.
          </p>
        ),
      },
      {
        q: 'What does the Savings Goal card show?',
        a: (
          <p>
            Your total budget for the month minus what you&apos;ve spent so far. It isn&apos;t a
            separate goal that you set.
          </p>
        ),
      },
    ],
  },
  {
    id: 'categories',
    title: 'Categories',
    items: [
      {
        q: 'How do I add or rename a category?',
        a: (
          <p>
            On the Categories page, select Create Category to add one. To rename a category, click
            its name, type the new name and press Enter. Setup starts you with Rent, Food,
            Transport and Entertainment.
          </p>
        ),
      },
      {
        q: 'What happens if I delete a category?',
        a: (
          <p>
            Its transactions and its budget are deleted with it, and this can&apos;t be undone.
            Finora shows how many transactions will be removed before you confirm.
          </p>
        ),
      },
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics and insights',
    items: [
      {
        q: 'What does the Analytics page show?',
        a: (
          <p>
            Spending by category over the last six months, how this month compares with last
            month, Budget Adherence (how much of this month&apos;s total budget is still unspent),
            your five biggest merchants, and any category that went over budget in at least two of
            the last three months.
          </p>
        ),
      },
      {
        q: 'What are AI Insights on the Budgets page?',
        a: (
          <p>
            Short notes generated from your budget numbers, such as a category that&apos;s close to
            or over its limit. They follow fixed rules rather than a trained model, and they use
            only the data you&apos;ve entered. Nothing is sent to an outside service.
          </p>
        ),
      },
    ],
  },
  {
    id: 'account',
    title: 'Your account',
    items: [
      {
        q: 'How do I change my username, currency or photo?',
        a: (
          <p>
            Open Settings from the sidebar. Edit your username or default currency, or choose a
            new photo (PNG, JPG or GIF, under 5 MB), then select Save Changes. Nothing changes
            until you save, and Cancel discards your edits.
          </p>
        ),
      },
      {
        q: 'Can I change my email or password?',
        a: (
          <p>
            Not from the app at the moment. There is no password reset either, so keep your
            password somewhere safe. If you&apos;re locked out, <ContactUs />.
          </p>
        ),
      },
      {
        q: 'How long do I stay signed in?',
        a: <p>Seven days. After that you sign in again. Logging out ends your session right away.</p>,
      },
      {
        q: 'How do I delete my account or get a copy of my data?',
        a: (
          <p>
            Account deletion and data export aren&apos;t available in the app at the moment. To
            request either, <ContactUs />. The <Link href="/privacy">Privacy Policy</Link> lists
            what Finora stores.
          </p>
        ),
      },
    ],
  },
];

function FaqItem({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="group border-b border-border last:border-b-0">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-medium text-foreground transition-colors marker:content-none hover:text-ubl-blue sm:text-base [&::-webkit-details-marker]:hidden">
        {q}
        <ChevronDown
          aria-hidden="true"
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="pr-8 pb-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {children}
      </div>
    </details>
  );
}

export default function HelpPage() {
  return (
    <DocPage
      title="Help"
      description="Answers to common questions about transactions, budgets, alerts and your account."
    >
      <nav aria-label="Help topics" className="flex flex-wrap gap-2">
        {GROUPS.map((g) => (
          <a
            key={g.id}
            href={`#${g.id}`}
            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {g.title}
          </a>
        ))}
      </nav>

      {GROUPS.map((g) => (
        <section key={g.id} id={g.id} className="scroll-mt-20">
          <h2 className="mb-3 text-lg font-semibold text-foreground">{g.title}</h2>
          <div className="rounded-xl border border-border bg-card px-4 shadow-sm sm:px-5">
            {g.items.map((item) => (
              <FaqItem key={item.q} q={item.q}>
                {item.a}
              </FaqItem>
            ))}
          </div>
        </section>
      ))}

      <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
        <h2 className="text-base font-semibold text-foreground">Can&apos;t find your answer?</h2>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          <ContactUs sentence />. Include what you were trying to do and what you saw instead.
        </p>
      </section>
    </DocPage>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactUs, DocPage, DocSection } from '@/components/info/doc';
import { LEGAL_LAST_UPDATED } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Privacy Policy | Finora',
  description: 'What Finora collects, how it is used, who else handles it, and the choices you have.',
};

// Written from what the app and its backend actually do (stored fields,
// sign-in, uploads, real-time alerts). If any of that changes, update this
// page and LEGAL_LAST_UPDATED. Have it reviewed before a public launch.
export default function PrivacyPage() {
  return (
    <DocPage
      title="Privacy Policy"
      description="What Finora collects, how it is used, who else handles it, and the choices you have."
      updated={LEGAL_LAST_UPDATED}
    >
      <DocSection title="What this policy covers">
        <p>
          Finora is a personal budgeting app. This policy explains what information the app
          collects when you use it, how that information is used, who else handles it, and what you
          can do about it.
        </p>
      </DocSection>

      <DocSection title="Information you give us">
        <ul>
          <li>
            <strong>Account details:</strong> your username, email address and default currency,
            plus a profile picture if you add one.
          </li>
          <li>
            <strong>Your password.</strong> It is never stored in readable form. When you sign up it
            is turned into a one-way hash, and only the hash is kept.
          </li>
          <li>
            <strong>Your budgeting data:</strong> the accounts (name and type), categories,
            transactions (amount, currency, merchant, date) and budgets (category, month, limit,
            currency) that you create.
          </li>
        </ul>
        <p>
          Finora doesn&apos;t ask for bank logins or card numbers, and it doesn&apos;t connect to
          your bank. Account names and merchants are free text, so please don&apos;t type card
          numbers or other sensitive details into them.
        </p>
      </DocSection>

      <DocSection title="Information Finora creates for you">
        <p>
          When you add transactions, Finora works out monthly spending totals for each category
          and records an alert when a category reaches 80% and 100% of its budget. These summaries
          and alerts are tied to your account and power the Overview, Budgets, Alerts and
          Analytics pages.
        </p>
      </DocSection>

      <DocSection title="Information stored in your browser">
        <p>
          To keep you signed in, Finora saves a sign-in token in your browser&apos;s local storage
          and in a cookie called <strong>auth-token</strong>. The token expires after seven days,
          and logging out removes it. Finora doesn&apos;t use advertising cookies or third-party
          analytics trackers.
        </p>
      </DocSection>

      <DocSection title="How we use your information">
        <ul>
          <li>To run the app: sign you in, store your data and show it back to you.</li>
          <li>To calculate your spending summaries and send you budget alerts.</li>
          <li>To keep Finora secure and to find and fix problems.</li>
        </ul>
        <p>We don&apos;t sell your information, and we don&apos;t use it for advertising.</p>
      </DocSection>

      <DocSection title="Who else handles your information">
        <ul>
          <li>
            <strong>Cloudinary</strong> stores the profile picture you upload and serves it back
            to the app.
          </li>
          <li>
            <strong>Our hosting and database providers</strong> run the app, its PostgreSQL
            database and the Redis service that passes real-time alerts between servers. They may
            keep standard server logs, such as IP addresses and request times.
          </li>
        </ul>
        <p>
          Finora doesn&apos;t send your transactions or budgets to any other third-party service.
          We may share information if the law requires it.
        </p>
      </DocSection>

      <DocSection title="How long we keep it">
        <p>
          Your information stays in Finora while your account exists. Deleting a category also
          deletes its transactions and its budget, and deleting a budget removes that budget.
        </p>
        <p>
          Finora doesn&apos;t have a self-service way to delete an account or export your data at
          the moment. To ask for either, <ContactUs />.
        </p>
      </DocSection>

      <DocSection title="How we protect it">
        <p>
          Passwords are stored as hashes, sign-in tokens expire after seven days, and every request
          for your budgeting data must come from a signed-in user and only returns that
          user&apos;s own records. No system is perfectly secure, so we can&apos;t promise absolute
          protection.
        </p>
      </DocSection>

      <DocSection title="Your choices">
        <p>
          You can update your username, default currency and profile picture in Settings at any
          time. To change your email address, have your data removed, or ask what is stored about
          you, <ContactUs />.
        </p>
      </DocSection>

      <DocSection title="Changes to this policy">
        <p>
          If we change this policy, we&apos;ll update the date at the top of this page. Using
          Finora after a change means you accept the updated policy. See also our{' '}
          <Link href="/terms">Terms of Service</Link>.
        </p>
      </DocSection>

      <DocSection title="Contact">
        <p>
          Questions about this policy? <ContactUs sentence />.
        </p>
      </DocSection>
    </DocPage>
  );
}

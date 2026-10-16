import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactUs, DocPage, DocSection } from '@/components/info/doc';
import { LEGAL_LAST_UPDATED } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Terms of Service | Finora',
  description: 'The rules for using Finora.',
};

// Plain-language terms for a budgeting tool that holds no money and connects
// to no bank. Have it reviewed before a public launch; it does not name a
// governing law or jurisdiction yet.
export default function TermsPage() {
  return (
    <DocPage
      title="Terms of Service"
      description="The rules for using Finora."
      updated={LEGAL_LAST_UPDATED}
    >
      <DocSection title="Using Finora">
        <p>
          By creating an account or using Finora, you agree to these terms and to our{' '}
          <Link href="/privacy">Privacy Policy</Link>. If you don&apos;t agree, please don&apos;t
          use the app.
        </p>
      </DocSection>

      <DocSection title="What Finora does">
        <p>
          Finora is a personal budgeting tool. You record your own transactions, set monthly
          budgets by category, and see alerts and analytics based on what you&apos;ve entered.
        </p>
        <p>
          Finora isn&apos;t a bank or a payment service. It doesn&apos;t hold or move money, and it
          doesn&apos;t connect to your bank accounts.
        </p>
      </DocSection>

      <DocSection title="Not financial advice">
        <p>
          Alerts, insights, projections and category suggestions are for information only. They
          are produced by fixed rules from the numbers you enter, and they can be wrong or
          incomplete. They aren&apos;t financial, tax or legal advice, and you are responsible for
          your own financial decisions.
        </p>
      </DocSection>

      <DocSection title="Your account">
        <ul>
          <li>Give accurate information when you sign up.</li>
          <li>
            Keep your password private. You are responsible for everything that happens under your
            account.
          </li>
          <li>
            An account is for one person. Finora doesn&apos;t support shared budgets or shared
            logins.
          </li>
          <li>
            If you think someone else has used your account, <ContactUs /> as soon as you can.
          </li>
        </ul>
      </DocSection>

      <DocSection title="Your data">
        <p>
          You own the information you enter. By using Finora you let us store and process it to run
          the app, as described in the <Link href="/privacy">Privacy Policy</Link>. Only upload
          images you have the right to use.
        </p>
      </DocSection>

      <DocSection title="Acceptable use">
        <p>Please don&apos;t:</p>
        <ul>
          <li>try to access another person&apos;s account or data;</li>
          <li>probe, attack or overload the service;</li>
          <li>use Finora for anything unlawful;</li>
          <li>upload images that are unlawful or harmful.</li>
        </ul>
      </DocSection>

      <DocSection title="Availability and accuracy">
        <p>
          Finora is provided as is. We work to keep it running, but we can&apos;t promise it will
          always be available or free of errors. Real-time alerts need an active connection and
          may arrive late or not at all, so check important figures against your own records.
          Features may change or be removed.
        </p>
      </DocSection>

      <DocSection title="Limits on our responsibility">
        <p>
          To the extent the law allows, Finora and the people who make it aren&apos;t responsible
          for losses that result from using the app or relying on its figures, alerts or
          suggestions, including missed or delayed alerts.
        </p>
      </DocSection>

      <DocSection title="Ending your use">
        <p>
          You can stop using Finora at any time. To have your account and data removed,{' '}
          <ContactUs />. We may suspend or remove accounts that break these terms.
        </p>
      </DocSection>

      <DocSection title="Changes to these terms">
        <p>
          If we change these terms, we&apos;ll update the date at the top of this page. Using
          Finora after a change means you accept the new terms.
        </p>
      </DocSection>

      <DocSection title="Contact">
        <p>
          Questions about these terms? <ContactUs sentence />.
        </p>
      </DocSection>
    </DocPage>
  );
}

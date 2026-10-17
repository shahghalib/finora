import { CONTACT_EMAIL } from '@/lib/site-config';

/** Page frame for a long-form text page (Help, Privacy, Terms). */
export function DocPage({
  title,
  description,
  updated,
  children,
}: {
  title: string;
  description?: string;
  updated?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="mx-auto w-full max-w-2xl px-4 py-10 sm:py-14">
      <header className="mb-8 border-b border-border pb-6">
        <h1 className="page-title">{title}</h1>
        {description && <p className="page-description">{description}</p>}
        {updated && <p className="mt-3 text-xs text-muted-foreground">Last updated {updated}</p>}
      </header>
      <div className="space-y-8">{children}</div>
    </article>
  );
}

/** A titled block of body text. Lists and links inside are styled here once. */
export function DocSection({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="mt-2 space-y-3 text-sm leading-relaxed text-muted-foreground sm:text-base [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}

/**
 * "email us at name@example.com" when NEXT_PUBLIC_CONTACT_EMAIL is set,
 * otherwise "contact the team that runs this Finora site".
 * Pass `sentence` when it starts a sentence.
 */
export function ContactUs({ sentence = false }: { sentence?: boolean }) {
  if (CONTACT_EMAIL) {
    return (
      <>
        {sentence ? 'Email' : 'email'} us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </>
    );
  }
  return <>{sentence ? 'Contact' : 'contact'} the team that runs this Finora site</>;
}

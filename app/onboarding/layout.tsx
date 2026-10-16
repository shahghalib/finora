export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Steps 1 and 2 use noticeably different chrome (a centered welcome card vs.
  // a full-width app bar + dot progress), so each step builds its own header
  // and progress indicator. This layout just sets the shared page background.
  return <div className="min-h-dvh bg-background">{children}</div>;
}

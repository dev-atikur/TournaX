import Page from "../components/common/Page";
import Footer from "../components/layouts/Footer";

export default function LegalPage({ title, children }) {
  return (
    <main className="min-h-0 flex-1 overflow-y-auto">
      <Page width="max-w-3xl">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="mt-4 space-y-3 text-sm leading-7 text-textSecondary">{children}</div>
      </Page>
      <Footer />
    </main>
  );
}

export function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>Play With Fair collects account details, Free Fire identity, and match results needed to run tournaments fairly.</p>
      <p>We do not sell personal data. Session cookies are HTTP-only and used only for authentication.</p>
    </LegalPage>
  );
}

export function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions">
      <p>By creating a PWF account you agree to compete honestly, follow room instructions, and accept staff decisions on verified results.</p>
      <p>Cheating, account sharing, or harassment can lead to a ban.</p>
    </LegalPage>
  );
}

export function ContactPage() {
  return (
    <LegalPage title="Contact">
      <p>For support, partnerships, or fairness reports, reach the PWF team on Telegram or Instagram from the footer.</p>
    </LegalPage>
  );
}

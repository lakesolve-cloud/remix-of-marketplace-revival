import StaticPage from "./StaticPage";

export default function Terms() {
  return (
    <StaticPage title="Terms of Service">
      <p className="text-foreground font-medium mb-4">Last updated: February 2026</p>
      <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">1. Acceptance of Terms</h2>
      <p>By accessing or using FestacConnect, you agree to be bound by these Terms of Service. If you do not agree, please do not use the platform.</p>
      <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">2. User Accounts</h2>
      <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
      <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">3. Listings & Content</h2>
      <p>Users are responsible for the accuracy of their listings. We reserve the right to remove content that violates our guidelines.</p>
      <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">4. Prohibited Activities</h2>
      <p>Users may not post fraudulent listings, harass other users, or use the platform for illegal activities.</p>
      <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">5. Contact</h2>
      <p>Questions about these terms can be directed to hello@festacconnect.com.</p>
    </StaticPage>
  );
}

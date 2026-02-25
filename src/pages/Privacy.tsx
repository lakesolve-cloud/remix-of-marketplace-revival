import StaticPage from "./StaticPage";

export default function Privacy() {
  return (
    <StaticPage title="Privacy Policy">
      <p className="text-foreground font-medium mb-4">Last updated: February 2026</p>
      <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">1. Information We Collect</h2>
      <p>We collect information you provide when creating an account, listing products or services, and interacting with the platform including your name, email, phone number, and business details.</p>
      <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">2. How We Use Your Information</h2>
      <p>Your information is used to provide and improve our services, facilitate transactions between buyers and sellers, send notifications, and ensure platform safety.</p>
      <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">3. Information Sharing</h2>
      <p>We do not sell your personal information. Your contact details are shared with other users only when you choose to make them visible on your listings or business profiles.</p>
      <h2 className="text-lg font-semibold text-foreground mt-6 mb-3">4. Contact Us</h2>
      <p>For privacy-related inquiries, please contact us at hello@festacconnect.com.</p>
    </StaticPage>
  );
}

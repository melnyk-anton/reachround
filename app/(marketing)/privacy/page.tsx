export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="text-muted-foreground mb-6">
            Last updated: January 18, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
            <p className="text-muted-foreground mb-4">
              ReachRound ("we", "our", or "us") operates the ReachRound platform. This Privacy Policy explains how we collect, use, and protect your personal information when you use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <h3 className="text-xl font-semibold mb-3">Account Information</h3>
            <p className="text-muted-foreground mb-4">
              When you create an account, we collect your email address and authentication credentials through Supabase Auth.
            </p>

            <h3 className="text-xl font-semibold mb-3">Gmail Access</h3>
            <p className="text-muted-foreground mb-4">
              When you connect your Gmail account, we request permission to send emails on your behalf. We store OAuth tokens securely to enable this functionality. We only use this access to send emails you explicitly approve through our platform.
            </p>

            <h3 className="text-xl font-semibold mb-3">Project and Campaign Data</h3>
            <p className="text-muted-foreground mb-4">
              We collect and store information about your projects, campaigns, investor research data, and email drafts that you create within our platform.
            </p>

            <h3 className="text-xl font-semibold mb-3">Usage Data</h3>
            <p className="text-muted-foreground mb-4">
              We may collect information about how you interact with our service, including pages visited and features used.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>Provide and maintain our AI-powered investor outreach service</li>
              <li>Send emails on your behalf when you explicitly approve them</li>
              <li>Research investors using AI based on your project information</li>
              <li>Generate personalized email content for your campaigns</li>
              <li>Improve and optimize our service</li>
              <li>Communicate with you about your account and service updates</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Storage and Security</h2>
            <p className="text-muted-foreground mb-4">
              Your data is stored securely using Supabase, which provides enterprise-grade security and encryption. We implement industry-standard security measures to protect your information from unauthorized access, disclosure, or destruction.
            </p>
            <p className="text-muted-foreground mb-4">
              Gmail OAuth tokens are stored encrypted and are only used for the specific purpose of sending emails you approve.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <p className="text-muted-foreground mb-4">We use the following third-party services:</p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li><strong>Supabase:</strong> Database and authentication</li>
              <li><strong>Google Gmail API:</strong> Sending emails on your behalf</li>
              <li><strong>Anthropic Claude:</strong> AI-powered research and content generation</li>
              <li><strong>Vercel:</strong> Hosting and deployment</li>
            </ul>
            <p className="text-muted-foreground mb-4">
              These services have their own privacy policies governing their use of your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Sharing</h2>
            <p className="text-muted-foreground mb-4">
              We do not sell, trade, or rent your personal information to third parties. We only share your information:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>With service providers who help us operate our platform (under strict confidentiality agreements)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="text-muted-foreground mb-4">You have the right to:</p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Disconnect your Gmail account at any time</li>
              <li>Export your data</li>
              <li>Delete your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Gmail API Disclosure</h2>
            <p className="text-muted-foreground mb-4">
              ReachRound's use and transfer of information received from Google APIs adheres to the{' '}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-700 hover:text-purple-800 underline"
              >
                Google API Services User Data Policy
              </a>, including the Limited Use requirements.
            </p>
            <p className="text-muted-foreground mb-4">
              Specifically, ReachRound:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground mb-4 space-y-2">
              <li>Only sends emails that you explicitly approve through our platform</li>
              <li>Does not use Gmail data for advertising purposes</li>
              <li>Does not share Gmail data with third parties except as necessary to provide our service</li>
              <li>Stores Gmail OAuth tokens securely and uses them only for sending approved emails</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
            <p className="text-muted-foreground mb-4">
              We retain your data for as long as your account is active or as needed to provide you services. You can request deletion of your data at any time by contacting us or deleting your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
            <p className="text-muted-foreground mb-4">
              Our service is not intended for users under the age of 18. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="text-muted-foreground mb-4">
              Email: privacy@reachround.com
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

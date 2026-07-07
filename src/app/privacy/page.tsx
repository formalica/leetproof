import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — LeetProof",
  description: "LeetProof privacy policy.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated: July 7, 2026</p>

      <div className="markdown-content prose prose-invert prose-zinc mt-8 max-w-none prose-headings:text-zinc-100 prose-p:text-zinc-300 prose-a:text-[#a4b8c5] prose-strong:text-zinc-100 prose-li:text-zinc-300">
        <p>
          LeetProof (&ldquo;LeetProof&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
          &ldquo;our&rdquo;) operates the website leetproof.org (the
          &ldquo;Service&rdquo;), a collaborative platform for proving theorems and
          sharing solutions in the Lean 4 programming language. This Privacy
          Policy explains what information we collect, how we use it, and the
          choices you have.
        </p>
        <p>
          By using the Service, you agree to the collection and use of
          information in accordance with this policy.
        </p>

        <h2>1. Information We Collect</h2>
        <h3>Account Information</h3>
        <p>
          When you sign in with Google, our authentication provider (Supabase
          Auth) receives and stores the following information from your Google
          account on our behalf:
        </p>
        <ul>
          <li>Email address</li>
          <li>Full name</li>
          <li>Profile avatar image URL</li>
        </ul>
        <p>
          We do not receive or store your Google password. Authentication is
          handled entirely by Supabase and Google&apos;s OAuth service.
        </p>

        <h3>Content You Create</h3>
        <p>
          We store content you create while using the Service, including:
        </p>
        <ul>
          <li>Code submissions and their verification status</li>
          <li>Comments you post on problems</li>
          <li>Hint packs and solutions you author</li>
          <li>Likes/upvotes you give to hint packs or solutions</li>
        </ul>

        <h3>Locally Stored Data</h3>
        <p>
          Some data, such as your in-progress editor code and your theme
          preference, is stored only in your browser&apos;s local storage. This
          data is not transmitted to or stored on our servers unless you
          explicitly submit it (e.g., by saving a submission).
        </p>

        <h3>Usage Data</h3>
        <p>
          We do not currently use any analytics, advertising, or tracking
          tools. Our hosting and infrastructure providers (see Section 3) may
          automatically log standard technical information (such as IP
          address and request logs) as part of normal server operation.
        </p>

        <h2>2. How We Use Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, operate, and maintain the Service</li>
          <li>Authenticate you and maintain your account and profile</li>
          <li>Store and display your submissions, comments, and shared content to other users</li>
          <li>Verify Lean 4 code you submit for correctness</li>
          <li>Communicate with you about the Service, if necessary</li>
          <li>Maintain the security and integrity of the Service</li>
        </ul>

        <h2>3. Third-Party Services</h2>
        <p>The Service relies on the following third-party providers:</p>
        <ul>
          <li>
            <strong>Supabase</strong> — provides our database and
            authentication infrastructure. Your account and content data is
            stored in a Supabase-hosted PostgreSQL database on Amazon Web
            Services, in the <code>us-east-1</code> (N. Virginia, USA) region.
          </li>
          <li>
            <strong>Google OAuth</strong> — used solely to authenticate your
            identity when you sign in.
          </li>
          <li>
            <strong>live.lean-lang.org</strong> — the public Lean 4 language
            server used to check the code you write in the in-browser editor.
            Code you run or verify is transmitted directly from your browser
            to this third-party server over a WebSocket connection so it can
            be type-checked. This server is operated by the Lean community,
            not by LeetProof, and is subject to its own operator&apos;s
            handling of the data it receives.
          </li>
        </ul>
        <p>
          We do not sell your personal information to any third party.
        </p>

        <h2>4. Cookies &amp; Local Storage</h2>
        <p>
          The Service uses strictly necessary cookies set by Supabase Auth to
          keep you signed in. We also use your browser&apos;s local storage to
          remember your editor code and display preferences (such as
          light/dark theme). We do not use cookies for advertising or
          cross-site tracking.
        </p>

        <h2>5. Data Sharing &amp; Disclosure</h2>
        <p>
          Content you choose to make public (such as comments, solutions, and
          hint packs) is visible to other users of the Service. We do not
          share your personal information with third parties except:
        </p>
        <ul>
          <li>With service providers listed in Section 3, as necessary to operate the Service</li>
          <li>If required to do so by law or valid legal process</li>
          <li>To protect the rights, property, or safety of LeetProof, our users, or others</li>
        </ul>

        <h2>6. Data Retention</h2>
        <p>
          We retain your account and content data for as long as your account
          is active. If you request deletion of your account, we will delete
          or anonymize your personal information within a reasonable time,
          except where retention is required for legal or legitimate
          operational reasons.
        </p>

        <h2>7. Data Security</h2>
        <p>
          We rely on the security measures provided by Supabase and AWS,
          including encryption in transit and row-level security policies
          that restrict access to your data. However, no method of
          transmission or storage is 100% secure, and we cannot guarantee
          absolute security.
        </p>

        <h2>8. Your Rights &amp; Choices</h2>
        <p>You may:</p>
        <ul>
          <li>Access or update your profile information at any time while signed in</li>
          <li>Request a copy of the personal data we hold about you</li>
          <li>Request deletion of your account and associated personal data</li>
          <li>Withdraw consent by signing out and discontinuing use of the Service</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{" "}
          <a href="mailto:contact@leetproof.org">contact@leetproof.org</a>.
        </p>

        <h2>9. Children&apos;s Privacy</h2>
        <p>
          The Service is not directed at children under the age of 13, and we
          do not knowingly collect personal information from children under
          13. If you believe a child has provided us with personal
          information, please contact us so we can delete it.
        </p>

        <h2>10. International Data Transfers</h2>
        <p>
          LeetProof is operated from Armenia, and the Service&apos;s data is
          hosted in the United States (AWS <code>us-east-1</code>) via
          Supabase. By using the Service, you understand that your
          information will be transferred to and processed in the United
          States, which may have different data protection laws than your
          country of residence.
        </p>

        <h2>11. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. If we make
          material changes, we will update the &ldquo;Last updated&rdquo; date at
          the top of this page. Continued use of the Service after changes
          are posted constitutes acceptance of the updated policy.
        </p>

        <h2>12. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact
          us at <a href="mailto:contact@leetproof.org">contact@leetproof.org</a>.
        </p>
      </div>
    </div>
  );
}

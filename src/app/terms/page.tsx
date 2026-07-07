import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — LeetProof",
  description: "LeetProof terms of service.",
};

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated: July 7, 2026</p>

      <div className="markdown-content prose prose-invert prose-zinc mt-8 max-w-none prose-headings:text-zinc-100 prose-p:text-zinc-300 prose-a:text-[#a4b8c5] prose-strong:text-zinc-100 prose-li:text-zinc-300">
        <p>
          Welcome to LeetProof (&ldquo;LeetProof&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or
          &ldquo;our&rdquo;), a collaborative platform for proving theorems and
          sharing solutions in the Lean 4 programming language, available at
          leetproof.org (the &ldquo;Service&rdquo;). These Terms of Service
          (&ldquo;Terms&rdquo;) govern your access to and use of the Service.
          By accessing or using the Service, you agree to be bound by these
          Terms. If you do not agree, do not use the Service.
        </p>

        <h2>1. Eligibility</h2>
        <p>
          You must be at least 13 years old to use the Service. By using the
          Service, you represent that you meet this requirement and, if you
          are under the age of majority in your jurisdiction, that a parent
          or guardian has reviewed and agreed to these Terms on your behalf.
        </p>

        <h2>2. Accounts</h2>
        <p>
          You sign in to the Service using Google OAuth via Supabase Auth. You
          are responsible for maintaining the security of your Google account
          and for all activity that occurs under your LeetProof account. You
          agree to provide accurate information and to notify us if you
          become aware of any unauthorized use of your account.
        </p>

        <h2>3. User Content</h2>
        <p>
          The Service allows you to submit code, comments, hint packs,
          solutions, and other content (&ldquo;User Content&rdquo;). You retain
          ownership of any User Content you submit. By posting User Content,
          you grant LeetProof a non-exclusive, worldwide, royalty-free
          license to host, store, reproduce, and display that content solely
          for the purpose of operating and improving the Service (for
          example, showing your solution or comment to other users).
        </p>
        <p>
          You are solely responsible for your User Content and represent that
          you have the necessary rights to submit it and that it does not
          infringe or violate the rights of any third party, applicable law,
          or these Terms.
        </p>

        <h2>4. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service for any unlawful purpose or in violation of any applicable law</li>
          <li>Post content that is harassing, abusive, hateful, or otherwise objectionable</li>
          <li>Upload malicious code, or attempt to disrupt, overload, or gain unauthorized access to the Service or its infrastructure</li>
          <li>Scrape, harvest, or misuse other users&apos; data</li>
          <li>Impersonate any person or entity, or misrepresent your affiliation</li>
          <li>Interfere with other users&apos; ability to use the Service</li>
        </ul>
        <p>
          We reserve the right to remove content and/or suspend or terminate
          accounts that violate these Terms, at our discretion.
        </p>

        <h2>5. Third-Party Services</h2>
        <p>
          The Service integrates with third-party providers, including
          Supabase (database and authentication), Google (sign-in), and the
          public Lean 4 language server at{" "}
          <code>live.lean-lang.org</code>, which is used to check code you
          write in the in-browser editor. Code you choose to run or verify is
          sent directly from your browser to this third-party server. These
          third-party services are governed by their own terms and privacy
          policies, and LeetProof is not responsible for their availability,
          content, or practices.
        </p>

        <h2>6. Intellectual Property</h2>
        <p>
          The Service, including its design, branding, and underlying
          software (excluding User Content and third-party open-source
          components such as Lean 4 and Mathlib, which remain governed by
          their own licenses), is owned by LeetProof. You may not copy,
          modify, distribute, or create derivative works of the Service
          itself without our prior written permission.
        </p>

        <h2>7. No Warranty</h2>
        <p>
          LeetProof is an early-stage, independently operated project. The
          Service is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS
          AVAILABLE&rdquo; basis, without warranties of any kind, whether
          express or implied, including but not limited to warranties of
          merchantability, fitness for a particular purpose, non-infringement,
          or that the Service will be uninterrupted, error-free, or secure. We
          do not guarantee the accuracy of proof verification results.
        </p>

        <h2>8. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by applicable law, LeetProof and its
          operators shall not be liable for any indirect, incidental,
          special, consequential, or punitive damages, or any loss of data,
          use, goodwill, or other intangible losses, resulting from your
          access to or use of, or inability to access or use, the Service,
          even if advised of the possibility of such damages. Our total
          liability for any claim arising out of or relating to these Terms
          or the Service shall not exceed the amount you paid us, if any, in
          the twelve months preceding the claim.
        </p>

        <h2>9. Termination</h2>
        <p>
          You may stop using the Service and request deletion of your account
          at any time by contacting us. We may suspend or terminate your
          access to the Service at our discretion, including if we believe
          you have violated these Terms, without prior notice.
        </p>

        <h2>10. Changes to the Service or These Terms</h2>
        <p>
          We may modify or discontinue the Service, in whole or in part, at
          any time. We may also update these Terms from time to time. If we
          make material changes, we will update the &ldquo;Last updated&rdquo;
          date above. Continued use of the Service after changes are posted
          constitutes acceptance of the updated Terms.
        </p>

        <h2>11. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with
          the laws of the Republic of Armenia, without regard to its
          conflict of law provisions. Any disputes arising under or in
          connection with these Terms shall be subject to the jurisdiction of
          the courts of Armenia, unless otherwise required by applicable
          mandatory law in your jurisdiction.
        </p>

        <h2>12. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at{" "}
          <a href="mailto:contact@leetproof.org">contact@leetproof.org</a>.
        </p>
      </div>
    </div>
  );
}

import React from 'react';

const TermsOfService = () => {
  return (
    <div className="text-gray-200 antialiased bg-[#313638]">
      {/* Header */}
      <header>
        <div className="container mx-auto px-6 py-4">
          <h1 className="text-4xl font-semibold text-gray-200 text-center">
            Terms of Service
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <section className="p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-200 mb-4">
            Effective Date:{' '}
            <span className="text-gray-100">
              <time dateTime="2024-09-02">2024-09-02</time>
            </span>
          </h2>
          <p className="mb-6">
            <span className="font-extrabold text-xl text-white">Carpooling</span>{' '}
            respects your privacy and is committed to protecting it through our
            compliance with this Privacy Policy. This policy describes the types
            of information we may collect from you or that you may provide when
            you use our mobile application and website (collectively, the
            &quot;Service&quot;) and our practices for collecting, using,
            maintaining, protecting, and disclosing that information.
          </p>

          {/* Information We Collect */}
          <h3 className="text-xl font-semibold text-gray-200 mb-2">
            Information We Collect
          </h3>
          <ul className="list-disc list-inside mb-6">
            <li>
              <span className="font-semibold">Account Information:</span> When
              you register for an account, we collect your name, email address,
              and your preferred location information.
            </li>
            <li>
              <span className="font-semibold">Usage Information:</span> We
              collect data about your interaction with our Service, including
              information on your interactions with the website, such as ride
              searches, postings, and other usage patterns.
            </li>
            <li>
              <span className="font-semibold">Location Data:</span> We may
              collect and use location data to provide certain features of the
              Service, like matching you with nearby pool companies.
            </li>
          </ul>

          {/* How We Use Your Information */}
          <h3 className="text-xl font-semibold text-gray-200 mb-2">
            How We Use Your Information
          </h3>
          <ul className="list-disc list-inside mb-6">
            <li>
              <span className="font-semibold">Providing and Improving the Service:</span>{' '}
              To operate, maintain, and enhance the functionality of the Service
              and improve your user experience.
            </li>
            <li>
              <span className="font-semibold">Facilitating Ride Sharing:</span>{' '}
              To connect you with other users for carpooling, using your profile
              and location.
            </li>
            <li>
              <span className="font-semibold">Communication:</span> To send you
              updates, notifications, and other communications related to your
              account or promotional offers.
            </li>
            <li>
              <span className="font-semibold">Safety and Compliance:</span> To
              monitor for fraud, enforce our Terms of Service, and comply with
              legal obligations.
            </li>
          </ul>

          {/* Sharing Your Information */}
          <h3 className="text-xl font-semibold text-gray-200 mb-2">
            Sharing Your Information
          </h3>
          <ul className="list-disc list-inside mb-6">
            <li>
              <span className="font-semibold">With Other Users:</span> When you
              participate in ride-sharing, certain information, such as your
              name, contact details, and ride preferences, may be shared with
              other users.
            </li>
            <li>
              <span className="font-semibold">For Legal Reasons:</span> We may
              disclose your information if required by law or in response to a
              valid legal request, such as a subpoena or court order.
            </li>
          </ul>

          {/* Your Rights Regarding Your Information */}
          <h3 className="text-xl font-semibold text-gray-200 mb-2">
            Your Rights Regarding Your Information
          </h3>
          <ul className="list-disc list-inside mb-6">
            <li>
              <span className="font-semibold">Access and Update:</span> You can
              access and update your account information at any time through the
              Service.
            </li>
            <li>
              <span className="font-semibold">Delete Your Account:</span> You
              may delete your account, after which we will remove your personal
              information from our active databases, although some information
              may be retained for legal or administrative purposes.
            </li>
            <li>
              <span className="font-semibold">Manage Location Services:</span>{' '}
              You can control location services through your device settings.
            </li>
          </ul>

          {/* Data Security */}
          <h3 className="text-xl font-semibold text-gray-200 mb-2">
            Data Security
          </h3>
          <p className="mb-6">
            We take reasonable measures to protect your personal information
            from unauthorized access, use, alteration, and disclosure. However,
            no method of transmission over the internet or electronic storage is
            completely secure, so we cannot guarantee absolute security.
          </p>

          {/* Changes to This Privacy Policy */}
          <h3 className="text-xl font-semibold text-gray-200 mb-2">
            Changes to This Privacy Policy
          </h3>
          <p className="mb-6">
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            with an updated &quot;Effective Date.&quot; You are advised to
            review this Privacy Policy periodically for any changes. Your
            continued use of the Service after the posting of changes
            constitutes your acceptance of such changes.
          </p>

          {/* Contact Us */}
          <h3 className="text-xl font-semibold text-gray-200 mb-2">
            Contact Us
          </h3>
          <p>
            If you have any questions or concerns about this Privacy Policy or
            our privacy practices, please contact us at:
          </p>
          <ul className="mt-4">
            <li>Email: [Your Email Address]</li>
            <li>Phone: 7558757963</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default TermsOfService;

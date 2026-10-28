import { useState } from "react";

const faqs = [
  {
    q: "How do I register for mobile banking at Cavernerco Limited Bank?",
    a: [
      "If you are enrolled in Online Banking, simply use your user name and password to log in to your accounts through the Cavernerco Limited Bank Savings app.",
      "After logging in, Android® and iPhone® users may also enroll in the Cavernerco Limited Bank Savings Mobile Deposit service to deposit checks using the mobile app.",
      "To enroll, select Mobile Deposit from the Main Menu, then review and accept the terms. If you are not currently registered for Online Banking, sign up online.",
    ],
  },
  {
    q: "What is Mobile Deposit?",
    a: [
      "Our Mobile Deposit allows you to deposit a check through the Cavernerco Limited Bank Savings mobile app using your internet-enabled iPhone® or Android® mobile device, provided your device has a camera.",
      "You must be an Online or Mobile banking customer, and enrolled in the Cavernerco Limited Bank Savings Mobile Deposit service.",
      "In the Cavernerco Limited Bank Savings mobile app, select \"Mobile Deposit,\" then follow the steps to enroll or deposit a check.",
    ],
  },
];

export default function OurFaqs() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="our-faqs bg-section">
      <div className="container">
        <div className="row section-row align-items-center">
          <div className="col-lg-7">
            <div className="section-title">
              <h3>frequently asked questions</h3>
              <h2>Common business & finance questions and answers</h2>
            </div>
          </div>
          <div className="col-lg-5">
            <div style={{ textAlign: "right", paddingTop: 10 }}>
              <a className="btn-default" href="#">contact now</a>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-12">
            <div className="our-faqs-box">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className={`faqs-item${open === i ? " open" : ""}`}
                >
                  <div
                    className="faqs-item-header"
                    onClick={() => setOpen(open === i ? null : i)}
                  >
                    <h3>{faq.q}</h3>
                    <div className="faqs-toggle">+</div>
                  </div>
                  <div className="faqs-item-body">
                    <ul>
                      {faq.a.map((point, j) => (
                        <li key={j}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

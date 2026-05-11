"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Cert = {
  name: string;
  fatherName: string;
  course: string;
  semester: string;
  collegeName: string;
  _id?: string;
};

export default function CertificateClient() {
  const params = useParams<{ id?: string }>();
  const id = params?.id;
  const [cert, setCert] = useState<Cert | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Certificate id is missing from the route.");
      return;
    }

    let mounted = true;

    setLoading(true);
    setError(null);

    fetch(`/api/certificate/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!mounted) return;
        setCert(json.data ?? null);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(String(err?.message ?? err));
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main style={{ padding: 24, minHeight: "100vh", background: "#fff" }}>
        <h1>Certificate</h1>
        <p>Loading...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ padding: 24, minHeight: "100vh", background: "#fff" }}>
        <h1>Certificate</h1>
        <p>Error: {error}</p>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        padding: "22px 12px",
        fontFamily: '"Times New Roman", Georgia, serif',
        color: "#111",
      }}
    >
      <section
        style={{
          maxWidth: 980,
          margin: "0 auto",
          border: "1px solid #d5d5d5",
          borderRadius: 8,
          padding: "22px 18px 26px",
          background: "#fff",
          boxShadow: "0 12px 34px rgba(10, 20, 35, 0.08)",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            borderBottom: "2px solid #bdbdbd",
            paddingBottom: 10,
            flexWrap: "wrap",
          }}
        >
          <div style={{ width: 140, display: "flex", justifyContent: "center" }}>
            <img
              src="https://d502jbuhuh9wk.cloudfront.net/orgData/5fbe028e0cf2052e17e4a57d/pages/assets/images/New-logo-of-CA.png"
              alt="CA India"
              style={{ width: 128, height: "auto", objectFit: "contain" }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 260 }}>
            <h1 style={{ margin: 0, fontSize: "clamp(34px, 3.2vw, 52px)", fontWeight: 700, lineHeight: 1.06 }}>
              Shivam Saini &amp; Associates
            </h1>
            <h2 style={{ margin: "8px 0 0", fontSize: "clamp(32px, 2.8vw, 44px)", fontWeight: 700, lineHeight: 1.05, color: "#1d2430" }}>
              Chartered Accountants
            </h2>
          </div>
        </header>

        <div
          style={{
            width: "100%",
            marginTop: 14,
            borderTop: "1px solid #cecece",
            borderBottom: "1px solid #cecece",
            padding: "8px 0",
          }}
        >
          <div style={{ textAlign: "center" }}>
          <h3
            style={{
              margin: 0,
              textDecoration: "underline",
              fontSize: "clamp(20px, 2vw, 42px)",
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            INTERNSHIP COMPLETION CERTIFICATE
          </h3>
        </div>
        </div>

        <article style={{ textAlign: "center", marginTop: 26, lineHeight: 1.58 }}>
          <p style={{ margin: 0, fontSize: "clamp(18px, 1.8vw, 34px)" }}>This is to certify that</p>

          <p
            style={{
              margin: "14px 0 0",
              textDecoration: "underline",
              fontWeight: 700,
              fontSize: "clamp(28px, 2.7vw, 52px)",
              letterSpacing: 0.8,
            }}
          >
            {cert?.name ?? "-"}
          </p>

          <p style={{ margin: "22px auto 0", maxWidth: 920, fontSize: "clamp(18px, 1.8vw, 35px)" }}>
            S/o {cert?.fatherName ?? "-"}, a student of {cert?.course ?? "-"}, Semester-{cert?.semester ?? "-"}, from {cert?.collegeName ?? "-"}, has successfully completed an internship at Shivam Saini &amp; Associates, Chartered Accountants.
          </p>

          <p style={{ margin: "20px auto 0", maxWidth: 920, fontSize: "clamp(14px, 1.2vw, 23px)", color: "#303030" }}>
            Certificate ID: {cert?._id ?? id}
          </p>
        </article>

        <div style={{ marginTop: 18, textAlign: "right", fontSize: "clamp(16px, 1.4vw, 24px)", color: "#222" }}>
          Shivam Saini &amp; Associates
        </div>
      </section>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";

type FormState = {
  name: string;
  fatherName: string;
  course: string;
  semester: string;
  collegeName: string;
};

const initialState: FormState = {
  name: "",
  fatherName: "",
  course: "",
  semester: "",
  collegeName: "",
};

export default function CreateCertificateForm() {
  const [formData, setFormData] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [certificateUrl, setCertificateUrl] = useState<string | null>(null);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setCertificateUrl(null);
    setQrImageUrl(null);

    try {
      const response = await fetch("/api/certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to create certificate.");
      }

      const certificateId = data?.data?._id;

      if (!certificateId) {
        throw new Error("Certificate saved but id was missing in response.");
      }

      const generatedCertificateUrl = `${window.location.origin}/${certificateId}`;
      const generatedQrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(generatedCertificateUrl)}`;

      setMessage(data?.message || "Certificate created successfully.");
      setCertificateUrl(generatedCertificateUrl);
      setQrImageUrl(generatedQrImageUrl);
      setFormData(initialState);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while saving the certificate."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(14,165,233,0.16),_transparent_35%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] px-6 py-10 text-slate-900 sm:px-10 lg:px-16">
      <section className="mx-auto w-full max-w-5xl rounded-[2rem] border border-white/80 bg-white/85 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.1)] backdrop-blur sm:p-10 lg:p-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <Link href="/" className="text-sm font-medium text-sky-700 hover:text-sky-900">
              Back to home
            </Link>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Add a certificate record
            </h1>
            <p className="text-base leading-7 text-slate-600 sm:text-lg">
              Fill in the student details below. This form sends the data to
              the certificate API and stores it in MongoDB.
            </p>
          </div>

          <div className="w-full max-w-xl rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5 sm:p-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" name="name" value={formData.name} onChange={handleChange} />
                <Field label="Father Name" name="fatherName" value={formData.fatherName} onChange={handleChange} />
                <Field label="Course" name="course" value={formData.course} onChange={handleChange} />
                <Field label="Semester" name="semester" value={formData.semester} onChange={handleChange} />
              </div>
              <Field label="College Name" name="collegeName" value={formData.collegeName} onChange={handleChange} />

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 w-full items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save certificate"}
              </button>

              {message ? (
                <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  {message}
                </p>
              ) : null}

              {error ? (
                <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                  {error}
                </p>
              ) : null}

              {qrImageUrl && certificateUrl ? (
                <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-sm font-medium text-slate-800">
                    QR for certificate URL
                  </p>
                  <img
                    src={qrImageUrl}
                    alt="Certificate QR code"
                    className="h-48 w-48 rounded-xl border border-slate-200 bg-white p-2"
                  />
                  <a
                    href={certificateUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block break-all text-sm text-sky-700 underline"
                  >
                    {certificateUrl}
                  </a>
                  <button
                    type="button"
                    onClick={async () => {
                      const qrResponse = await fetch(qrImageUrl);
                      const blob = await qrResponse.blob();
                      const objectUrl = URL.createObjectURL(blob);
                      const anchor = document.createElement("a");
                      anchor.href = objectUrl;
                      anchor.download = "certificate-qr.png";
                      document.body.appendChild(anchor);
                      anchor.click();
                      document.body.removeChild(anchor);
                      URL.revokeObjectURL(objectUrl);
                    }}
                    className="inline-flex h-10 items-center justify-center rounded-full bg-slate-900 px-5 text-sm font-medium text-white transition hover:bg-slate-700"
                  >
                    Download QR
                  </button>
                </div>
              ) : null}
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: keyof FormState;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="space-y-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        required
        className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </label>
  );
}

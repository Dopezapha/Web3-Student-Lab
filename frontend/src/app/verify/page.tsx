'use client';

import React from 'react';
import { useState } from 'react';
import type { CertificateData } from '@/lib/soroban';

export default function VerifyCertificatePage() {
  const [certificateId, setCertificateId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<CertificateData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState<boolean>(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateId.trim()) return;

    setIsVerifying(true);
    setError(null);
    setResult(null);
    setVerified(false);

    try {
      const { verifyCertificateOnChain } = await import('@/lib/soroban');
      const data = await verifyCertificateOnChain(certificateId.trim());

      if (data) {
        setResult(data);
        setVerified(true);
      } else {
        setError('Certificate not found on blockchain');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to verify certificate');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-black px-4 py-16 text-white">
      {/* Abstract Background Glow */}
      <div className="pointer-events-none absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-red-600/5 blur-[120px]"></div>

      <div className="relative z-10 mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-red-500/50 bg-zinc-950 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
            <svg
              className="h-10 w-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="mb-4 text-4xl font-black tracking-tight text-white uppercase md:text-5xl">
            Cryptographic <span className="text-red-600">Verification</span>
          </h1>
          <p className="text-lg font-light tracking-wide text-gray-400">
            Query the Stellar network to validate on-chain credentials
          </p>
        </div>

        {/* Verification Form */}
        <div className="relative mb-10 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-red-600 to-transparent"></div>

          <form onSubmit={handleVerify} className="space-y-8">
            <div>
              <label
                htmlFor="certificateId"
                className="mb-3 block text-sm font-bold tracking-widest text-gray-400 uppercase"
              >
                Credential Symbol / Hash
              </label>
              <div className="relative">
                <input
                  id="certificateId"
                  type="text"
                  value={certificateId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCertificateId(e.target.value)
                  }
                  placeholder="e.g. SOLID, INIT505, 0x..."
                  className="w-full rounded-xl border border-white/20 bg-black px-6 py-5 font-mono text-lg tracking-wider text-white uppercase placeholder-gray-700 transition-colors focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
                <div className="absolute top-1/2 right-4 flex h-4 w-4 -translate-y-1/2 animate-pulse items-center justify-center rounded-full bg-red-500/20">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifying || !certificateId.trim()}
              className={`w-full rounded-xl px-6 py-5 font-black tracking-widest uppercase shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all ${
                isVerifying || !certificateId.trim()
                  ? 'cursor-not-allowed border border-red-900/50 bg-red-900/50 text-gray-500'
                  : 'transform bg-red-600 text-white hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-[0_0_30px_rgba(220,38,38,0.6)]'
              }`}
            >
              {isVerifying ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="h-5 w-5 animate-spin text-white" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Querying Blockchain...
                </span>
              ) : (
                'Run Verification'
              )}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-10 animate-pulse rounded-xl border border-red-500/50 bg-red-950/30 p-6 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10">
                <svg
                  className="h-6 w-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <div>
                <h3 className="mb-1 text-lg font-black tracking-wider text-red-500 uppercase">
                  Query Failed
                </h3>
                <p className="font-mono text-sm text-red-400/80">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Result */}
        {result && verified && (
          <div className="relative mb-10 overflow-hidden rounded-2xl border border-green-500/30 bg-black p-10 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
            <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-green-500/10"></div>

            <div className="relative z-10 mb-8 flex items-start gap-5">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl border border-green-500/30 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                <svg
                  className="h-8 w-8 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-2xl font-black tracking-wide text-white uppercase">
                  Credential <span className="text-green-500">Verified</span>
                </h3>
                <p className="font-mono text-sm text-green-500/80">
                  Cryptographic proof confirmed on Stellar
                </p>
              </div>
            </div>

            <div className="relative z-10 space-y-6 rounded-xl border border-white/5 bg-zinc-950 p-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="mb-2 text-xs font-bold tracking-widest text-gray-500 uppercase">
                    Symbol
                  </p>
                  <p className="text-2xl font-black text-white">{result.symbol}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs font-bold tracking-widest text-gray-500 uppercase">
                    Identity
                  </p>
                  <p className="text-xl font-bold text-gray-300">{result.student}</p>
                </div>
              </div>
              <div className="border-t border-white/5 pt-6">
                <p className="mb-2 text-xs font-bold tracking-widest text-gray-500 uppercase">
                  Protocol / Curriculum
                </p>
                <p className="text-lg font-bold text-white">{result.course_name}</p>
              </div>
              <div className="border-t border-white/5 pt-6">
                <p className="mb-2 text-xs font-bold tracking-widest text-gray-500 uppercase">
                  Timestamp
                </p>
                <p className="font-mono text-lg text-gray-300">
                  {new Date(Number(result.issue_date) * 1000).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZoneName: 'short',
                  })}
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-green-500/20 pt-6">
              <div className="flex items-center gap-3 text-sm font-bold tracking-widest text-green-500 uppercase">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                </span>
                Immutable Record Connected
              </div>
              <a
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-zinc-900 transition-colors hover:bg-zinc-800"
              >
                <svg
                  className="h-4 w-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="relative mt-16 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-10 shadow-sm">
          <div className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-red-600/10 blur-[40px]"></div>

          <h2 className="mb-6 flex items-center gap-3 text-xl font-black tracking-widest text-white uppercase">
            <span className="h-px w-8 bg-red-600"></span> Protocol Specs
          </h2>

          <div className="space-y-6 font-light text-gray-400">
            <p className="leading-relaxed">
              Credentials mapped to the Web3 Student Lab are permanently minted on the Stellar
              blockchain via highly optimized Soroban smart contracts. This cryptographic
              attestation guarantees unforgeable proof-of-knowledge.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-6 border-t border-white/5 pt-8 md:grid-cols-3">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black">
                  <svg
                    className="h-5 w-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="mb-1 text-sm font-bold tracking-wider text-white uppercase">
                    Immutable
                  </h4>
                  <p className="text-xs text-gray-500">Tamper-proof ledger encoding.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="mb-1 text-sm font-bold tracking-wider text-white uppercase">
                    Real-Time
                  </h4>
                  <p className="text-xs text-gray-500">Sub-second global verification.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black">
                  <svg
                    className="h-5 w-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.5A2.5 2.5 0 0017.5 18h.5a2 2 0 012-2v-6a2 2 0 00-2-2h-1.064M5 20.5A2.5 2.5 0 002.5 18h-.5a2 2 0 01-2-2v-6a2 2 0 012-2h1.064"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="mb-1 text-sm font-bold tracking-wider text-white uppercase">
                    Decentralized
                  </h4>
                  <p className="text-xs text-gray-500">Powered by Soroban Network.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

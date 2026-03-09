"use client";

import { useCallback, useEffect, useState } from "react";
import { usePlaidLink } from "react-plaid-link";

interface PlaidLinkButtonProps {
  onSuccess: (data: {
    item_id: string;
    accounts: unknown[];
    holdings: unknown[];
    transactions: unknown[];
    institution_name: string;
  }) => void;
  onError?: (err: string) => void;
  label?: string;
}

export function PlaidLinkButton({ onSuccess, onError, label = "Connect Bank Account" }: PlaidLinkButtonProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [exchanging, setExchanging] = useState(false);

  useEffect(() => {
    async function fetchToken() {
      setLoading(true);
      try {
        const res = await fetch("/api/plaid/create-link-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uuid: crypto.randomUUID() }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setLinkToken(data.link_token);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to initialize Plaid";
        onError?.(msg);
      } finally {
        setLoading(false);
      }
    }
    fetchToken();
  }, []);

  const handleSuccess = useCallback(
    async (public_token: string) => {
      setExchanging(true);
      try {
        const res = await fetch("/api/plaid/exchange-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ public_token }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        onSuccess(data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to connect account";
        onError?.(msg);
      } finally {
        setExchanging(false);
      }
    },
    [onSuccess, onError]
  );

  const { open, ready } = usePlaidLink({
    token: linkToken ?? "",
    onSuccess: (public_token) => handleSuccess(public_token),
    onExit: (err) => {
      if (err) onError?.(err.error_message ?? "Plaid exited with error");
    },
  });

  const disabled = loading || !ready || exchanging;

  return (
    <button
      onClick={() => open()}
      disabled={disabled}
      className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {(loading || exchanging) ? (
        <>
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          {exchanging ? "Connecting..." : "Initializing..."}
        </>
      ) : (
        <>
          <span>+</span>
          {label}
        </>
      )}
    </button>
  );
}

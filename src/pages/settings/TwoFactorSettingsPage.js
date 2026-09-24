import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import StatusBadge from "../../components/common/StatusBadge";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import authApi from "../../api/auth.api";
import { extractEntity, getApiError } from "../../utils/errors";

const METHODS = [
  { id: "email", label: "Email", description: "One-time codes sent to your verified email." },
  { id: "sms", label: "SMS", description: "One-time codes sent to your verified phone." },
  { id: "authenticator", label: "Authenticator", description: "Time-based codes from an authenticator app." },
];

export default function TwoFactorSettingsPage() {
  const [status, setStatus] = useState({ enabled: false, method: "" });
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [method, setMethod] = useState("authenticator");
  const [setup, setSetup] = useState(null);
  const [code, setCode] = useState("");
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [savedCodes, setSavedCodes] = useState(false);
  const [disableOpen, setDisableOpen] = useState(false);
  const [disableCode, setDisableCode] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = extractEntity((await authApi.get2FAStatus()).data) || {};
      setStatus({
        enabled: Boolean(data.enabled || data.isEnabled || data.twoFactorEnabled),
        method: data.method || data.type || "",
      });
    } catch {
      setStatus({ enabled: false, method: "" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const startSetup = async () => {
    setBusy(true);
    try {
      const data = extractEntity((await authApi.setup2FA({ method })).data) || {};
      setSetup(data);
      setStep(2);
    } catch (err) {
      toast.error(getApiError(err, "Could not start 2FA setup."));
    } finally {
      setBusy(false);
    }
  };

  const verifySetup = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      const data = extractEntity((await authApi.verifyTwoFactor({ method, code, otp: code })).data) || {};
      const codes = data.recoveryCodes || data.codes || [];
      setRecoveryCodes(Array.isArray(codes) ? codes : []);
      setStep(3);
      toast.success("Two-factor authentication enabled");
      load();
    } catch (err) {
      toast.error(getApiError(err, "Invalid verification code."));
    } finally {
      setBusy(false);
    }
  };

  const disable = async () => {
    setBusy(true);
    try {
      await authApi.disable2FA({ code: disableCode, otp: disableCode });
      toast.success("Two-factor authentication disabled");
      setDisableOpen(false);
      setDisableCode("");
      setStep(0);
      setSetup(null);
      setRecoveryCodes([]);
      load();
    } catch (err) {
      toast.error(getApiError(err, "Could not disable 2FA."));
    } finally {
      setBusy(false);
    }
  };

  const copyCodes = async () => {
    try {
      await navigator.clipboard.writeText(recoveryCodes.join("\n"));
      toast.success("Recovery codes copied");
    } catch {
      toast.error("Could not copy codes");
    }
  };

  const downloadCodes = () => {
    const blob = new Blob([recoveryCodes.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pwf-recovery-codes.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Two-Factor Authentication</h1>
      <p className="mt-1 text-sm text-textMuted">Add a second step after your password. Recovery codes are only shown if the backend returns them.</p>

      <div className="mt-6 rounded-2xl border border-border bg-surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-semibold">Status</p>
            <div className="mt-2">
              <StatusBadge status={status.enabled ? "verified" : "pending"}>
                {loading ? "Checking" : status.enabled ? "Enabled" : "Disabled"}
              </StatusBadge>
            </div>
            {status.method ? <p className="mt-2 text-xs capitalize text-textMuted">Method: {status.method}</p> : null}
          </div>
          {status.enabled ? (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setStep(1)}>
                Manage 2FA
              </Button>
              <Button variant="danger" onClick={() => setDisableOpen(true)}>
                Disable 2FA
              </Button>
            </div>
          ) : (
            <Button onClick={() => setStep(1)}>Enable 2FA</Button>
          )}
        </div>
      </div>

      {step >= 1 && !status.enabled ? (
        <div className="mt-4 space-y-4 rounded-2xl border border-border bg-surface p-5">
          <p className="text-sm font-semibold">Step 1 · Choose a method</p>
          <div className="grid gap-2">
            {METHODS.map((item) => (
              <label key={item.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-border px-3 py-3">
                <input type="radio" name="2fa-method" checked={method === item.id} onChange={() => setMethod(item.id)} />
                <span>
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="text-xs text-textMuted">{item.description}</span>
                </span>
              </label>
            ))}
          </div>
          {step === 1 ? (
            <Button onClick={startSetup} loading={busy}>
              Continue
            </Button>
          ) : null}

          {step >= 2 ? (
            <form onSubmit={verifySetup} className="space-y-3 border-t border-border pt-4">
              <p className="text-sm font-semibold">Step 2 · Verify</p>
              {setup?.otpauthUrl || setup?.qrCode ? (
                <p className="text-xs text-textMuted">Scan the authenticator secret returned by the server, then enter the code.</p>
              ) : (
                <p className="text-xs text-textMuted">Enter the verification code sent or generated for {method}.</p>
              )}
              {setup?.qrCode ? <img src={setup.qrCode} alt="Authenticator QR" className="h-40 w-40 rounded-xl border border-border" /> : null}
              {setup?.secret ? <p className="font-mono text-xs text-textSecondary">Secret: {setup.secret}</p> : null}
              <Input label="Verification code" value={code} onChange={(e) => setCode(e.target.value)} required />
              <Button type="submit" loading={busy}>
                Verify and enable
              </Button>
            </form>
          ) : null}

          {step >= 3 && recoveryCodes.length ? (
            <div className="space-y-3 border-t border-border pt-4">
              <p className="text-sm font-semibold">Step 3 · Recovery codes</p>
              <ul className="grid gap-1 rounded-xl bg-surfaceHard p-3 font-mono text-sm sm:grid-cols-2">
                {recoveryCodes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="secondary" size="sm" onClick={copyCodes}>
                  Copy recovery codes
                </Button>
                <Button type="button" variant="secondary" size="sm" onClick={downloadCodes}>
                  Download recovery codes
                </Button>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={savedCodes} onChange={(e) => setSavedCodes(e.target.checked)} />
                I have saved my recovery codes.
              </label>
              <Button disabled={!savedCodes} onClick={() => setStep(0)}>
                Done
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}

      <ConfirmDialog
        open={disableOpen}
        title="Disable Two-Factor Authentication?"
        confirmLabel="Disable 2FA"
        loading={busy}
        onClose={() => setDisableOpen(false)}
        onConfirm={disable}
      >
        <p className="mb-3 text-sm text-textSecondary">
          This requires a current 2FA code. The frontend will not turn 2FA off by itself.
        </p>
        <Input label="Current 2FA code" value={disableCode} onChange={(e) => setDisableCode(e.target.value)} />
      </ConfirmDialog>
    </div>
  );
}

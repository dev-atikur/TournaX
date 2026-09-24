import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Search, Upload, X, Image as ImageIcon, Video, CheckCircle2, UserCheck, UserX } from "lucide-react";
import Modal from "../common/Modal";
import Button from "../common/Button";
import Select from "../common/Select";
import Input from "../common/Input";
import reportApi from "../../api/report.api";
import leaderboardApi from "../../api/leaderboard.api";
import { REPORT_TYPES } from "../../utils/constants";
import { displayName } from "../../utils/format";
import { getApiError, extractList } from "../../utils/errors";

export default function ReportUserModal({ open, user, onClose }) {
  const [targetType, setTargetType] = useState("known");
  const [selectedUser, setSelectedUser] = useState(null);
  const [unknownIdentifier, setUnknownIdentifier] = useState("");
  
  // Search state
  const [userQuery, setUserQuery] = useState("");
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  
  // Form fields
  const [reason, setReason] = useState("Cheating");
  const [otherReason, setOtherReason] = useState("");
  const [description, setDescription] = useState("");
  const [matchId, setMatchId] = useState("");
  const [tournamentId, setTournamentId] = useState("");
  
  // Evidence state
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [evidenceUrl, setEvidenceUrl] = useState("");
  
  const [loading, setLoading] = useState(false);

  // Initialize target when modal opens or user prop changes
  useEffect(() => {
    if (open) {
      if (user) {
        setTargetType("known");
        setSelectedUser(user);
      } else {
        setTargetType("known");
        setSelectedUser(null);
      }
      setUserQuery("");
      setUserSearchResults([]);
      setReason("Cheating");
      setOtherReason("");
      setDescription("");
      setUnknownIdentifier("");
      setMatchId("");
      setTournamentId("");
      setEvidenceFiles([]);
      setEvidenceUrl("");
    }
  }, [open, user]);

  // Handle user search debounce
  useEffect(() => {
    if (!userQuery.trim() || targetType !== "known") {
      setUserSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearchingUsers(true);
      try {
        const res = await leaderboardApi.global({ search: userQuery.trim(), limit: 8 });
        const list = extractList(res.data).items || [];
        setUserSearchResults(list);
      } catch (err) {
        setUserSearchResults([]);
      } finally {
        setSearchingUsers(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [userQuery, targetType]);

  const handleFileUpload = (e, fileType) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEvidenceFiles((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(7),
            name: file.name,
            size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
            type: fileType,
            preview: event.target.result,
            progress: 100,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeEvidence = (id) => {
    setEvidenceFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const submit = async (event) => {
    event.preventDefault();

    if (targetType === "known" && !selectedUser) {
      toast.error("Please select a target user");
      return;
    }

    if (targetType === "unknown" && !unknownIdentifier.trim()) {
      toast.error("Please provide a user identifier");
      return;
    }

    if (reason === "Other" && !otherReason.trim()) {
      toast.error("Please describe the issue for 'Other'");
      return;
    }

    if (!description.trim()) {
      toast.error("Describe what happened");
      return;
    }

    setLoading(true);
    try {
      const compiledEvidence = [
        ...evidenceFiles.map((f) => f.preview),
        ...(evidenceUrl.trim() ? [evidenceUrl.trim()] : []),
      ].join("\n");

      const finalReason = reason === "Other" ? `Other: ${otherReason.trim()}` : reason;

      await reportApi.create({
        targetType,
        reportedUserId: targetType === "known" ? (selectedUser?.id || selectedUser?._id) : null,
        reportedIdentifier: targetType === "unknown" ? unknownIdentifier.trim() : displayName(selectedUser),
        type: reason,
        reason: finalReason,
        description: description.trim(),
        evidence: compiledEvidence || undefined,
        status: "pending",
        matchId: matchId.trim() || undefined,
        tournamentId: tournamentId.trim() || undefined,
      });

      toast.success(
        "Your report has been submitted. Our moderation team will review the evidence and take appropriate action if necessary.",
        { duration: 5000 }
      );
      onClose?.();
    } catch (error) {
      toast.error(getApiError(error, "Could not submit report"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Report User"
      description="Submit a fair-play report to our moderation team."
      size="lg"
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button form="report-user-form" type="submit" loading={loading}>
            Submit Report
          </Button>
        </>
      }
    >
      <form id="report-user-form" onSubmit={submit} className="space-y-4">
        {/* 1. Target Identification Mode */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-textSecondary">Target Options</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTargetType("known")}
              className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition ${
                targetType === "known"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-surfaceHard text-textSecondary hover:text-textPrimary"
              }`}
            >
              <UserCheck className="h-4 w-4" />
              Known User
            </button>
            <button
              type="button"
              onClick={() => setTargetType("unknown")}
              className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition ${
                targetType === "unknown"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-surfaceHard text-textSecondary hover:text-textPrimary"
              }`}
            >
              <UserX className="h-4 w-4" />
              Unknown User
            </button>
          </div>
        </div>

        {/* 1A. Known User Search & Selection */}
        {targetType === "known" ? (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-textSecondary">Search User</label>
            {selectedUser ? (
              <div className="flex items-center justify-between rounded-xl border border-primary/40 bg-primary/5 p-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-primary font-semibold">Selected User</p>
                  <p className="text-sm font-bold text-textPrimary">{displayName(selectedUser)}</p>
                  {selectedUser.username && (
                    <p className="text-xs text-textMuted">@{selectedUser.username}</p>
                  )}
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setSelectedUser(null);
                    setUserQuery("");
                  }}
                >
                  Change
                </Button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted" />
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  placeholder="Search user by FF Name or Username..."
                  className="w-full rounded-xl border border-border bg-surfaceHard py-3 pl-10 pr-4 text-sm text-textPrimary outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
                {searchingUsers && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-textMuted">
                    Searching...
                  </div>
                )}
                {userSearchResults.length > 0 && (
                  <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-border bg-surface p-1 shadow-xl">
                    {userSearchResults.map((u) => (
                      <button
                        key={u.id || u._id}
                        type="button"
                        onClick={() => {
                          setSelectedUser(u);
                          setUserQuery("");
                          setUserSearchResults([]);
                        }}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-surfaceHard"
                      >
                        <span className="font-medium text-textPrimary">{displayName(u)}</span>
                        <span className="text-xs text-textMuted">@{u.username || "player"}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* 2. Unknown User Identifier */
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-textSecondary">User Identifier</label>
            <input
              type="text"
              value={unknownIdentifier}
              onChange={(e) => setUnknownIdentifier(e.target.value)}
              placeholder="e.g. FF UID 12345678, FF Name, or username"
              className="w-full rounded-xl border border-border bg-surfaceHard px-4 py-3 text-sm text-textPrimary outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
            <p className="text-xs text-textMuted">
              You can provide an FF UID, FF Name, username, or any other information that may help us identify the user.
            </p>
          </div>
        )}

        {/* 3. Report Reason */}
        <Select
          label="Report Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        >
          {REPORT_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>

        {reason === "Other" && (
          <Input
            label="Describe the issue"
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
            placeholder="Specify the reason..."
          />
        )}

        {/* 4. Report Description */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-textSecondary">
            What happened?
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a detailed explanation of what took place..."
            className="w-full rounded-xl border border-border bg-surfaceHard px-4 py-3 text-sm text-textPrimary outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
        </div>

        {/* 5. Evidence Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-textSecondary">Evidence</label>
          <div className="flex flex-wrap gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-surfaceHard px-4 py-2.5 text-xs font-medium text-textPrimary hover:border-primary hover:bg-surfaceSoft transition">
              <ImageIcon className="h-4 w-4 text-primary" />
              Upload Screenshot
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileUpload(e, "image")}
                className="hidden"
              />
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-surfaceHard px-4 py-2.5 text-xs font-medium text-textPrimary hover:border-primary hover:bg-surfaceSoft transition">
              <Video className="h-4 w-4 text-primary" />
              Upload Video
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => handleFileUpload(e, "video")}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-xs text-textMuted">
            You can provide evidence to help our moderation team review the report.
          </p>

          {/* Uploaded Evidence Files List */}
          {evidenceFiles.length > 0 && (
            <div className="mt-2 space-y-2">
              {evidenceFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-surfaceSoft p-2.5 text-xs"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    {file.type === "image" ? (
                      <img
                        src={file.preview}
                        alt="Preview"
                        className="h-10 w-10 rounded-lg object-cover border border-border"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-surfaceHard text-primary">
                        <Video className="h-5 w-5" />
                      </div>
                    )}
                    <div className="truncate">
                      <p className="truncate font-medium text-textPrimary">{file.name}</p>
                      <div className="flex items-center gap-2 text-textMuted">
                        <span>{file.size}</span>
                        <span className="flex items-center gap-1 text-success">
                          <CheckCircle2 className="h-3 w-3" /> Ready
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeEvidence(file.id)}
                    className="rounded-lg p-1.5 text-textMuted hover:bg-surfaceHard hover:text-error"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Input
            label="Optional Evidence Link / URL"
            value={evidenceUrl}
            onChange={(e) => setEvidenceUrl(e.target.value)}
            placeholder="Paste YouTube, Imgur, or Google Drive link"
          />
        </div>

        {/* Match & Tournament optional context */}
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Match ID (Optional)"
            value={matchId}
            onChange={(e) => setMatchId(e.target.value)}
            placeholder="e.g. M-102"
          />
          <Input
            label="Tournament ID (Optional)"
            value={tournamentId}
            onChange={(e) => setTournamentId(e.target.value)}
            placeholder="e.g. T-505"
          />
        </div>
      </form>
    </Modal>
  );
}

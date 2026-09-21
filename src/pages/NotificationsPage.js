import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import toast from "react-hot-toast";
import Page from "../components/common/Page";
import EmptyState from "../components/common/EmptyState";
import Spinner from "../components/common/Spinner";
import Button from "../components/common/Button";
import notificationApi from "../api/notification.api";
import { extractList, getApiError } from "../utils/errors";
import { timeAgo } from "../utils/format";

export default function NotificationsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const response = await notificationApi.list({ limit: 50 });
      setItems(extractList(response.data).items);
    } catch (err) {
      toast.error(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markAll = async () => {
    try {
      await notificationApi.markAllRead();
      toast.success("All notifications marked as read");
      load();
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  const markOne = async (id) => {
    try {
      await notificationApi.markRead(id);
      load();
    } catch (err) {
      toast.error(getApiError(err));
    }
  };

  return (
    <Page width="max-w-3xl">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Button size="sm" variant="secondary" onClick={markAll}>Mark all read</Button>
      </div>
      <div className="mt-6">
        {loading ? (
          <Spinner />
        ) : items.length ? (
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id || item._id} className={`rounded-2xl border border-border p-4 ${item.isRead ? "bg-surface" : "bg-surfaceSoft"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-primary">{item.type}</p>
                    <h2 className="mt-1 font-semibold">{item.title}</h2>
                    <p className="mt-1 text-sm text-textSecondary">{item.message}</p>
                    <p className="mt-2 text-xs text-textMuted">{timeAgo(item.createdAt)}</p>
                  </div>
                  {!item.isRead ? (
                    <button type="button" onClick={() => markOne(item.id || item._id)} className="text-xs text-primary">
                      Mark read
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={Bell} title="No notifications" description="Tournament joins, match starts, and results will appear here." />
        )}
      </div>
    </Page>
  );
}

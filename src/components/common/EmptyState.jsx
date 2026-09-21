import Button from "./Button";

export default function EmptyState({ icon, title, description, actionLabel, onAction, to, as: Action = "button" }) {
  const Icon = icon;
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
      {Icon ? (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surfaceElevated text-textMuted">
          <Icon className="h-6 w-6" />
        </div>
      ) : null}
      <h2 className="mt-4 text-lg font-semibold text-textPrimary">{title}</h2>
      {description ? <p className="mt-1 max-w-md text-sm text-textMuted">{description}</p> : null}
      {actionLabel ? (
        <Button as={Action} to={to} onClick={onAction} className="mt-5" size="sm">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

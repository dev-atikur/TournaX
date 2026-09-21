export default function ErrorState({ title = "Unable to load this page", message, onRetry }) {
  return (
    <div className="rounded-2xl border border-error/30 bg-errorSoft/20 px-5 py-8 text-center">
      <h2 className="text-lg font-semibold text-textPrimary">{title}</h2>
      {message ? <p className="mt-2 text-sm text-textMuted">{message}</p> : null}
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-textDark hover:bg-primaryHover"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}

export function ErrorDisplay({ error }) {
  return (
    <p>
      Error: <code>{error.message}</code>
    </p>
  );
}

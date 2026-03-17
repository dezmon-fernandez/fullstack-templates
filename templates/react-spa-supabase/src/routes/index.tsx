import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-4xl font-bold">React + Supabase</h1>
      <p className="text-lg text-gray-500">
        Edit{" "}
        <code className="rounded bg-gray-100 px-2 py-1 text-sm">
          src/routes/index.tsx
        </code>{" "}
        to get started.
      </p>
    </main>
  );
}

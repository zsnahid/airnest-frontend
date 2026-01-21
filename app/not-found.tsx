import Link from "next/link";
import { MoveLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-base-200 text-center px-4">
      <h1 className="text-9xl font-bold text-primary">404</h1>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-base-content sm:text-5xl">
        Page not found
      </h2>
      <p className="mt-6 text-lg leading-7 text-base-content/70">
        Sorry, we couldn&apos;t find the page you&apos;re looking for.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Link href="/" className="btn btn-primary">
          <MoveLeft className="mr-2 h-4 w-4" />
          Go back home
        </Link>
      </div>
    </div>
  );
}

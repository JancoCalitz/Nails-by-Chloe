import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center md:py-32">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-5xl md:text-6xl">This page chipped</h1>
      <p className="mx-auto mt-4 max-w-md text-lg text-muted">The page you’re looking for doesn’t exist or has moved.</p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/" className="btn btn-primary">
          Go home
        </Link>
        <Link href="/gallery/" className="btn btn-secondary">
          See my work
        </Link>
      </div>
    </div>
  );
}

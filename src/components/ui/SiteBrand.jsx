import Link from "next/link";
import Image from "next/image";

/** Mark + wordmark lockup for headers. */
export default function SiteBrand({
  href = "/",
  label = "I Love Resumes home",
  priority = false,
  className = "site-brand",
}) {
  return (
    <Link href={href} className={className} aria-label={label}>
      <Image
        src="/logo.png"
        alt=""
        width={512}
        height={454}
        sizes="36px"
        className="site-brand-mark"
        priority={priority}
      />
      <Image
        src="/logo-text.png"
        alt=""
        width={900}
        height={95}
        sizes="160px"
        className="site-brand-wordmark"
        priority={priority}
      />
    </Link>
  );
}

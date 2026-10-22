import Image from 'next/image';

/** Original outlined artwork from the October 2026 brand kit. */
export default function BrandLogo({ theme = 'auto' }: { theme?: 'auto' | 'light' | 'dark' }) {
  const size = 'h-auto w-[150px] sm:w-[190px] max-w-full';
  return (
    <span className="inline-block shrink-0 leading-none">
      {theme !== 'dark' && (
        <Image src="/brand/Tatvavera-Header-Transparent.svg" alt="Tatvavera Health" width={1000} height={240} priority className={`${size} ${theme === 'auto' ? 'block dark:hidden' : 'block'}`} />
      )}
      {theme !== 'light' && (
        <Image src="/brand/Tatvavera-Header-White-Ink.svg" alt="Tatvavera Health" width={1000} height={240} priority className={`${size} ${theme === 'auto' ? 'hidden dark:block' : 'block'}`} />
      )}
    </span>
  );
}

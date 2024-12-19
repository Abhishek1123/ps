import Image from 'next/image';

export default function LogoDark() {
  return (
    <Image
      src="/icon-192x192.png"
      alt="Your Logo"
      width={118}
      height={42}
      className="object-contain"
    />
  );
} 
import Image from 'next/image';

export default function LogoLight() {
  return (
    <Image
      src="/icon-192x192.png" // Path to your logo
      alt="Your Logo"
      width={118}  // Adjust width as needed
      height={42}  // Adjust height as needed
      className="object-contain"  // This helps maintain aspect ratio
    />
  );
} 

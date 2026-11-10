import Image from "next/image";
import Link from "next/link";
export default function Header1() {
  return <Link href="/" className="brand-logo" aria-label="Broadcast Engineering Society India — Home"><Image src="/Images/Logo/logo_new.png" alt="Broadcast Engineering Society (India)" width={320} height={89} sizes="(max-width: 600px) 185px, 225px" priority /></Link>;
}

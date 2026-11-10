// components/SocialFooter.js

import Link from 'next/link';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import YouTubeIcon from '@mui/icons-material/YouTube';

export default function SocialMediaFooter() {
  return (

    <div className="container mx-auto flex justify-center space-x-8 mt-4 mb-4 items-center">
      <Link
        href="https://x.com/besindiaexpo"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Twitter"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-5-7.5L5.3 22H2.1l7.3-8.4L1.6 2H8l4.5 6.8L18.9 2ZM17.8 20h1.8L6.9 4H5.1l12.7 16Z" /></svg>

      </Link>
      <Link
        href="https://www.facebook.com/profile.php?id=61577322060235"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
      >
        <FacebookIcon className="text-white hover:text-blue-600 transition duration-300 cursor-pointer" fontSize="medium" />
      </Link>
      <Link
        href="https://www.instagram.com/besindiaexpo/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
      >
        <InstagramIcon
          // official brand color
          className="text-white hover:text-[#E1306C] hover:opacity-80 transition duration-300 cursor-pointer"

          fontSize="medium"
        />
      </Link>
      <Link
        href="https://www.linkedin.com/company/besindiaexpo"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LinkedIn"
      >
        <LinkedInIcon className="text-white hover:text-blue-500 transition duration-300 cursor-pointer" fontSize="medium" />
      </Link>
      <Link
        href="https://www.youtube.com/@besindiaexpo"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="YouTube"
      >
        <YouTubeIcon className="text-white hover:text-red-500 transition duration-300 cursor-pointer" fontSize="medium" />
      </Link>
    </div>

  );
}

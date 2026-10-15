import type { Metadata } from "next";
import { Home } from "@/components/Home";
import { homeCover } from "@/data/home";
import { SITE_NAME, SITE_DESCRIPTION } from "@/data/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    type: "website",
    url: "/",
    images: [{ url: homeCover.displayUrl, width: homeCover.width, height: homeCover.height, alt: SITE_NAME }],
  },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: SITE_DESCRIPTION },
};

export default function HomePage() {
  return <Home />;
}

import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Amara & Théo — Notre Mariage",
  description:
    "Découvrez les souvenirs de notre mariage : photos, vidéos, albums et invitation virtuelle. Un moment unique partagé avec nos proches.",
  keywords:
    "mariage, Amara, Théo, galerie photos, souvenirs, invitation mariage",
  openGraph: {
    title: "Amara & Théo — Notre Mariage",
    description:
      "Un moment unique, des souvenirs éternels. Rejoignez-nous pour célébrer notre amour.",
    type: "website",
    locale: "fr_FR",
    images: [
      {
        url: "/images/wedding-couple.png",
        width: 1200,
        height: 630,
        alt: "Mariage Amara & Théo",
      },
    ],
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Inter:wght@300;400;500;600;700&family=Great+Vibes&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

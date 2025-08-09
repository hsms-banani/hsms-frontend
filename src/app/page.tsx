// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { HeroSection } from "@/components/HomePage/HeroSection";
// import { FeaturedSection } from "@/components/HomePage/FeaturedSection";
import { DynamicRectorMessage } from "@/components/HomePage/DynamicRectorMessage";
// import { AboutUsSection } from "@/components/HomePage/AboutUsSection";
import { FacultyMembersSection } from "@/components/HomePage/FacultyMembersSection";
import FAQSection from "@/components/HomePage/FAQSection";
import UsefulInformationSection from "@/components/HomePage/UsefulInformationSection";
// import LatestNews from "@/components/Homepage/LatestNews";

export default function Home() {
  return (
    <main className="w-full">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Featured Section */}
      {/* <FeaturedSection /> */}
      
      {/* Dynamic Rector Message */}
      <DynamicRectorMessage isFullPage={false} showTitle={true} />
      
      {/* Latest News Section */}
      {/* <LatestNews limit={3} /> */}
      
      {/* Welcome Section */}
      <UsefulInformationSection />
      
      {/* About Us Section */}
      {/* <AboutUsSection /> */}
      
      {/* Holy Ones Section */}
      <FacultyMembersSection />
      
      {/* FAQ Section */}
      <FAQSection />
    </main>
  );
}
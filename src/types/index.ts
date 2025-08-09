// types/index.ts
export interface NavItem {
  name: string;
  href?: string;
  subItems?: SubNavItem[];
}

export interface SubNavItem {
  name: string;
  href: string;
}

export interface AnnouncementProps {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface EventProps {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  imageUrl?: string;
}

export interface NewsItemProps {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  imageUrl?: string;
  tags?: string[];
}

export interface TestimonialProps {
  id: string;
  quote: string;
  author: string;
  role: string;
  imageUrl?: string;
}

export interface StaffMemberProps {
  id: string;
  name: string;
  position: string;
  department: string;
  bio: string;
  imageUrl?: string;
  email: string;
  phone?: string;
}

export interface AchievementProps {
  id: string;
  title: string;
  description: string;
  year: number;
  imageUrl?: string;
}
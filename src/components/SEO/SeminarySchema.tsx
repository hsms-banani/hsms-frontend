// components/SEO/SeminarySchema.tsx
import { FC } from 'react';

interface SchoolSchemaProps {
  schoolName?: string;
  address?: string;
  telephone?: string;
  email?: string;
  website?: string;
  description?: string;
}

export const SchoolSchema: FC<SchoolSchemaProps> = ({
  schoolName = "HSMS Seminary",
  address = "Your School Address",
  telephone = "Your Phone Number",
  email = "info@hsms.edu",
  website = "https://hsms.edu",
  description = "A premier seminary institution dedicated to theological education and spiritual formation."
}) => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": schoolName,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": address,
    },
    "telephone": telephone,
    "email": email,
    "url": website,
    "description": description,
    "sameAs": [
      // Add your social media URLs here
      // "https://facebook.com/yourschool",
      // "https://twitter.com/yourschool",
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
};

// Export as default as well for flexibility
export default SchoolSchema;
// src/components/common/SafeContentRenderer.tsx - Fixed with Black Text
'use client';

import React from 'react';
import DOMPurify from 'isomorphic-dompurify';

interface SafeContentRendererProps {
  content: string;
  className?: string;
  allowedTags?: string[];
  allowedAttributes?: { [key: string]: string[] };
  stripTags?: boolean;
  preserveFormatting?: boolean;
  textStyle?: 'paragraph' | 'quote' | 'heading' | 'plain';
}

/**
 * SafeContentRenderer component that renders HTML content safely
 * and handles cleaning of unwanted formatting from rich text editors like Summernote
 */
const SafeContentRenderer: React.FC<SafeContentRendererProps> = ({
  content,
  className = '',
  allowedTags = ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'span'],
  allowedAttributes = {
    'a': ['href', 'title', 'target'],
    'img': ['src', 'alt', 'title', 'width', 'height'],
  },
  stripTags = false,
  preserveFormatting = true,
  textStyle = 'paragraph'
}) => {
  
  const cleanContent = (htmlContent: string): string => {
    if (!htmlContent) return '';
    
    // Pre-clean the content to remove problematic patterns from Summernote/Word
    let cleaned = htmlContent
      // Remove HTML comments
      .replace(/<!--[\s\S]*?-->/g, '')
      // Remove style blocks completely
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      // Remove script blocks
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      // Remove Microsoft Office specific elements
      .replace(/<o:p[\s\S]*?<\/o:p>/gi, '')
      .replace(/<\/?o:\w+[^>]*\/?>/gi, '')
      // Remove encoded style blocks that sometimes come from Summernote
      .replace(/&lt;style&gt;[\s\S]*?&lt;\/style&gt;/gi, '')
      .replace(/&lt;style[\s\S]*?&gt;[\s\S]*?&lt;\/style&gt;/gi, '')
      // Remove all inline styles - this is crucial for Summernote content
      .replace(/\s*style\s*=\s*"[^"]*"/gi, '')
      .replace(/\s*style\s*=\s*'[^']*'/gi, '')
      // Remove all CSS classes that come from rich text editors
      .replace(/\s*class\s*=\s*"[^"]*"/gi, '')
      .replace(/\s*class\s*=\s*'[^']*'/gi, '')
      // Remove Microsoft Office and Summernote specific attributes
      .replace(/mso-[^=]*="[^"]*"/gi, '')
      .replace(/lang="[^"]*"/gi, '')
      .replace(/xml:lang="[^"]*"/gi, '')
      .replace(/dir="[^"]*"/gi, '')
      .replace(/data-[^=]*="[^"]*"/gi, '') // Remove data attributes
      // Clean up font specifications from rich text editors
      .replace(/font-family:\s*[^;]*;?/gi, '')
      .replace(/font-size:\s*[^;]*;?/gi, '')
      .replace(/color:\s*[^;]*;?/gi, '')
      // Remove empty attributes
      .replace(/\s+=""/g, '')
      .replace(/\s+=''/g, '')
      // Clean up excessive whitespace
      .replace(/\s+/g, ' ')
      // Remove empty paragraphs and divs
      .replace(/<p[^>]*>\s*<\/p>/gi, '')
      .replace(/<div[^>]*>\s*<\/div>/gi, '')
      // Clean up problematic spans from Summernote
      .replace(/<span[^>]*>\s*<\/span>/gi, '')
      .replace(/<span[^>]*>\s*/gi, function(match) {
        // Only remove span if it has no useful attributes
        if (match.includes('style=') || match.includes('class=') || match.includes('font')) {
          return '';
        }
        return match;
      })
      .replace(/\s*<\/span>/gi, '')
      // Remove font tags completely (common in rich text editors)
      .replace(/<\/?font[^>]*>/gi, '')
      // Clean up nested formatting tags
      .replace(/<(b|strong)><(b|strong)>/gi, '<strong>')
      .replace(/<\/(b|strong)><\/(b|strong)>/gi, '</strong>')
      .replace(/<(i|em)><(i|em)>/gi, '<em>')
      .replace(/<\/(i|em)><\/(i|em)>/gi, '</em>')
      // Normalize paragraph tags (remove attributes)
      .replace(/<p[^>]*>/gi, '<p>')
      .replace(/<div[^>]*>/gi, '<div>')
      // Clean up multiple consecutive line breaks
      .replace(/(<br\s*\/?>){3,}/gi, '<br><br>')
      // Remove empty formatting tags
      .replace(/<(strong|b|em|i|u)>\s*<\/(strong|b|em|i|u)>/gi, '')
      .trim();

    // If stripTags is true, remove all HTML tags and return plain text
    if (stripTags) {
      return cleaned
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    // Use DOMPurify to sanitize the HTML with strict settings
    const sanitized = DOMPurify.sanitize(cleaned, {
      ALLOWED_TAGS: allowedTags,
      ALLOWED_ATTR: Object.keys(allowedAttributes).reduce((acc, tag) => {
        allowedAttributes[tag].forEach(attr => {
          if (!acc.includes(attr)) {
            acc.push(attr);
          }
        });
        return acc;
      }, [] as string[]),
      ALLOW_DATA_ATTR: false,
      ALLOW_UNKNOWN_PROTOCOLS: false,
      FORBID_ATTR: ['style', 'class', 'id', 'onclick', 'onerror', 'onload'],
      FORBID_TAGS: ['style', 'script', 'object', 'embed', 'iframe'],
      KEEP_CONTENT: true,
      REMOVE_TAGS_KEEP_CONTENT: ['span', 'font', 'div'],
      REMOVE_CONTENT: ['style', 'script'],
    });

    return sanitized;
  };

  // FIXED: Updated to use black text instead of gray
  const getTextStyleClasses = (style: string): string => {
    switch (style) {
      case 'quote':
        return 'text-xl italic text-black leading-relaxed'; // Changed from text-gray-700
      case 'heading':
        return 'text-2xl font-semibold text-black leading-tight'; // Changed from text-gray-900
      case 'plain':
        return 'text-base text-black'; // Changed from text-gray-600
      case 'paragraph':
      default:
        return 'text-lg text-black leading-relaxed'; // Changed from text-gray-600
    }
  };

  const sanitizedContent = cleanContent(content);

  // If content is empty after cleaning, show nothing
  if (!sanitizedContent.trim()) {
    return null;
  }

  const baseClasses = preserveFormatting 
    ? `prose prose-lg max-w-none ${getTextStyleClasses(textStyle)}`
    : getTextStyleClasses(textStyle);

  return (
    <div 
      className={`safe-content ${baseClasses} ${className}`}
      dangerouslySetInnerHTML={{ 
        __html: sanitizedContent 
      }}
      style={{
        // Ensure clean typography and reset any inherited styles
        lineHeight: textStyle === 'quote' ? '1.7' : '1.6',
        color: '#000000', // FIXED: Explicitly set to pure black
        fontFamily: 'inherit',
        // Override any potential styling from the cleaned content
        fontSize: 'inherit',
        fontWeight: 'inherit',
      }}
    />
  );
};

export default SafeContentRenderer;

// Utility function for extracting plain text from rich text content
export const extractPlainText = (htmlContent: string, maxLength?: number): string => {
  if (!htmlContent) return '';
  
  // Remove HTML tags and clean up whitespace
  const plainText = htmlContent
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
  
  if (maxLength && plainText.length > maxLength) {
    return plainText.substring(0, maxLength).replace(/\w+$/, '').trim() + '...';
  }
  
  return plainText;
};

// Custom hook for using the content renderer with preset configurations
export const useContentRenderer = () => {
  const renderCleanContent = (
    content: string, 
    options?: Partial<SafeContentRendererProps>
  ) => {
    return (
      <SafeContentRenderer 
        content={content} 
        allowedTags={['p', 'br', 'strong', 'em', 'i', 'b', 'u']}
        stripTags={false}
        preserveFormatting={true}
        {...options} 
      />
    );
  };

  const renderPlainText = (content: string, maxLength?: number) => {
    return extractPlainText(content, maxLength);
  };

  const renderQuote = (content: string, className?: string) => {
    return (
      <SafeContentRenderer 
        content={content}
        textStyle="quote"
        className={className}
        allowedTags={['strong', 'em', 'i', 'b']}
        stripTags={false}
      />
    );
  };

  return { 
    renderCleanContent, 
    renderPlainText, 
    renderQuote 
  };
};
// src/hooks/useSummernoteContent.ts - Fixed with Black Text
'use client';

import { useMemo } from 'react';
import DOMPurify from 'isomorphic-dompurify';

interface SummernoteContentOptions {
  preserveFormatting?: boolean;
  allowedTags?: string[];
  maxLength?: number;
  textStyle?: 'paragraph' | 'quote' | 'heading' | 'plain';
}

/**
 * Custom hook for handling Summernote rich text content
 * Provides consistent cleaning and processing of content from Django Summernote fields
 */
export const useSummernoteContent = (content: string, options: SummernoteContentOptions = {}) => {
  const {
    preserveFormatting = true,
    allowedTags = ['p', 'br', 'strong', 'em', 'i', 'b', 'u'],
    maxLength,
    textStyle = 'paragraph'
  } = options;

  const processedContent = useMemo(() => {
    if (!content) return { cleaned: '', plainText: '', isEmpty: true };

    // Aggressive cleaning specifically for Summernote content
    const aggressivelyCleaned = content
      // Remove all HTML comments
      .replace(/<!--[\s\S]*?-->/g, '')
      
      // Remove style and script blocks (including encoded versions from Summernote)
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/&lt;style&gt;[\s\S]*?&lt;\/style&gt;/gi, '')
      .replace(/&lt;script&gt;[\s\S]*?&lt;\/script&gt;/gi, '')
      
      // Remove Microsoft Word artifacts that often come through copy-paste
      .replace(/<o:p[\s\S]*?<\/o:p>/gi, '')
      .replace(/<\/?o:\w+[^>]*\/?>/gi, '')
      .replace(/mso-[^;:]*:[^;]*(;|$)/gi, '')
      
      // Remove ALL style attributes (common issue with Summernote)
      .replace(/\s*style\s*=\s*"[^"]*"/gi, '')
      .replace(/\s*style\s*=\s*'[^']*'/gi, '')
      
      // Remove ALL class attributes
      .replace(/\s*class\s*=\s*"[^"]*"/gi, '')
      .replace(/\s*class\s*=\s*'[^']*'/gi, '')
      
      // Remove data attributes and other Summernote artifacts
      .replace(/\s*data-[^=]*=\s*"[^"]*"/gi, '')
      .replace(/\s*contenteditable\s*=\s*"[^"]*"/gi, '')
      .replace(/\s*spellcheck\s*=\s*"[^"]*"/gi, '')
      
      // Remove empty attributes
      .replace(/\s+=""/g, '')
      .replace(/\s+=''/g, '')
      
      // Clean font specifications
      .replace(/font-family:[^;]*;?/gi, '')
      .replace(/font-size:[^;]*;?/gi, '')
      .replace(/color:[^;]*;?/gi, '')
      .replace(/background-color:[^;]*;?/gi, '')
      
      // Remove problematic tags while keeping content
      .replace(/<\/?font[^>]*>/gi, '')
      .replace(/<span[^>]*>/gi, '')
      .replace(/<\/span>/gi, '')
      .replace(/<div[^>]*>/gi, '<p>')
      .replace(/<\/div>/gi, '</p>')
      
      // Clean up paragraph tags (remove all attributes)
      .replace(/<p[^>]*>/gi, '<p>')
      
      // Handle nested formatting tags
      .replace(/<(strong|b)><(strong|b)>/gi, '<strong>')
      .replace(/<\/(strong|b)><\/(strong|b)>/gi, '</strong>')
      .replace(/<(em|i)><(em|i)>/gi, '<em>')
      .replace(/<\/(em|i)><\/(em|i)>/gi, '</em>')
      
      // Remove empty tags
      .replace(/<(p|strong|em|i|b|u)>\s*<\/\1>/gi, '')
      .replace(/<p>\s*<\/p>/gi, '')
      
      // Clean up excessive whitespace and line breaks
      .replace(/\s+/g, ' ')
      .replace(/(<br\s*\/?>){3,}/gi, '<br><br>')
      .replace(/(<p>\s*<br\s*\/?>\s*<\/p>)/gi, '')
      
      .trim();

    // Use DOMPurify for final sanitization
    const sanitized = DOMPurify.sanitize(aggressivelyCleaned, {
      ALLOWED_TAGS: preserveFormatting ? allowedTags : [],
      ALLOWED_ATTR: [],
      ALLOW_DATA_ATTR: false,
      ALLOW_UNKNOWN_PROTOCOLS: false,
      FORBID_ATTR: ['style', 'class', 'id', 'onclick', 'onerror', 'onload', 'data-*'],
      FORBID_TAGS: ['style', 'script', 'object', 'embed', 'iframe', 'form', 'input'],
      KEEP_CONTENT: true,
      REMOVE_TAGS_KEEP_CONTENT: ['span', 'font', 'div'],
      REMOVE_CONTENT: ['style', 'script'],
    });

    // Extract plain text
    const plainText = sanitized
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim();

    // Apply length limit if specified
    const finalPlainText = maxLength && plainText.length > maxLength
      ? plainText.substring(0, maxLength).replace(/\w+$/, '').trim() + '...'
      : plainText;

    return {
      cleaned: sanitized,
      plainText: finalPlainText,
      originalLength: content.length,
      cleanedLength: sanitized.length,
      plainTextLength: finalPlainText.length,
      isEmpty: !sanitized.trim(),
      hasFormatting: sanitized !== plainText
    };
  }, [content, preserveFormatting, allowedTags, maxLength]);

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

  return {
    content: processedContent,
    styleClasses: getTextStyleClasses(textStyle),
    isValid: !processedContent.isEmpty,
    // Helper methods
    getPlainText: () => processedContent.plainText,
    getCleanedHTML: () => processedContent.cleaned,
    hasContent: () => !processedContent.isEmpty,
    getWordCount: () => processedContent.plainText.split(/\s+/).length,
  };
};
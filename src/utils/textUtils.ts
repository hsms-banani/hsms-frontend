// src/utils/textUtils.ts
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  // Find the last space before the max length to avoid cutting words
  const trimmedText = text.substring(0, maxLength);
  const lastSpaceIndex = trimmedText.lastIndexOf(' ');
  
  if (lastSpaceIndex > 0) {
    return trimmedText.substring(0, lastSpaceIndex) + '...';
  }
  
  return trimmedText + '...';
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
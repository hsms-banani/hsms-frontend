// utils/fileUtils.ts

export const downloadFile = async (url: string, filename: string) => {
  try {
    // Create a temporary anchor element
    const link = document.createElement('a');
    
    // Try to fetch the file first to handle CORS issues
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // Create blob from response
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    
    // Set up download
    link.href = blobUrl;
    link.download = filename;
    link.style.display = 'none';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up blob URL
    window.URL.revokeObjectURL(blobUrl);
    
    return true;
  } catch (error) {
    console.error('Download failed:', error);
    
    // Fallback: try direct link download
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return false;
  }
};

export const getFileTypeFromUrl = (url: string): string => {
  const extension = url.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return 'pdf';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
    case 'bmp':
      return 'image';
    case 'doc':
    case 'docx':
    case 'txt':
    case 'rtf':
      return 'document';
    case 'xls':
    case 'xlsx':
    case 'csv':
      return 'spreadsheet';
    case 'ppt':
    case 'pptx':
      return 'presentation';
    case 'zip':
    case 'rar':
    case '7z':
      return 'archive';
    case 'mp3':
    case 'wav':
    case 'mp4':
    case 'avi':
    case 'mov':
      return 'media';
    default:
      return 'other';
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isPreviewable = (fileType: string): boolean => {
  return ['image', 'pdf'].includes(fileType);
};
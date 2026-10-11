import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Configure pdfjs-dist worker for browser execution using worker from unpkg/bundled URL or cdnjs
// In modern pdfjs-dist, we can configure workerSrc
try {
  if (typeof window !== 'undefined') {
    // Use matching pdfjs version worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.0.379'}/build/pdf.worker.min.mjs`;
  }
} catch (e) {
  console.warn('PDF.js worker initialization notice:', e);
}

/**
 * Extracts plain text from a File object (.pdf, .docx, .txt)
 * @param {File} file
 * @returns {Promise<string>}
 */
export async function extractText(file) {
  if (!file) {
    throw new Error('No file provided');
  }

  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.pdf')) {
    return extractFromPDF(file);
  } else if (fileName.endsWith('.docx')) {
    return extractFromDOCX(file);
  } else if (fileName.endsWith('.txt')) {
    return extractFromTXT(file);
  } else {
    throw new Error('Unsupported format. Please upload a PDF, DOCX, or TXT file.');
  }
}

/**
 * Reads PDF content page by page using pdfjs-dist
 */
async function extractFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  
  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
    isEvalSupported: false,
  });

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const textPieces = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    
    // Group text items by vertical position or line continuity
    let lastY = null;
    let pageLines = [];
    let currentLine = '';

    for (const item of content.items) {
      if (!('str' in item)) continue;
      
      const y = item.transform ? Math.round(item.transform[5]) : null;
      if (lastY !== null && y !== null && Math.abs(y - lastY) > 5) {
        if (currentLine.trim()) {
          pageLines.push(currentLine.trim());
        }
        currentLine = item.str;
      } else {
        currentLine += (currentLine.length > 0 && !currentLine.endsWith(' ') ? ' ' : '') + item.str;
      }
      lastY = y;
    }

    if (currentLine.trim()) {
      pageLines.push(currentLine.trim());
    }

    textPieces.push(pageLines.join('\n'));
  }

  const fullText = textPieces.join('\n\n').trim();

  if (!fullText || fullText.replace(/\s+/g, '').length < 30) {
    throw new Error(
      'Could not extract text from this PDF. It might be a scanned image or empty. Please ensure the PDF has selectable text.'
    );
  }

  return fullText;
}

/**
 * Extracts plain text from DOCX using mammoth
 */
async function extractFromDOCX(file) {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = result.value.trim();

  if (!text) {
    throw new Error('The DOCX file appears to be empty or contains no readable text.');
  }

  return text;
}

/**
 * Reads plain text from TXT file
 */
function extractFromTXT(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read TXT file.'));
    reader.readAsText(file);
  });
}

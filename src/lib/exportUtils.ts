import { Organization } from '../types';

interface ExportOptions {
  title: string;
  funder: string;
  draft: string;
  organization?: Organization | null;
  amount?: number;
  deadline?: string;
}

/**
 * Converts basic markdown formatting into HTML for document exporting
 */
function markdownToHTML(md: string): string {
  if (!md) return '';
  return md
    // Headers
    .replace(/^### (.*$)/gim, '<h3 style="font-size:14pt; font-weight:bold; color:#1e293b; margin-top:16pt; margin-bottom:6pt;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="font-size:16pt; font-weight:bold; color:#0f172a; margin-top:20pt; margin-bottom:8pt; border-bottom:1px solid #e2e8f0; padding-bottom:4pt;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="font-size:20pt; font-weight:bold; color:#065f46; margin-top:24pt; margin-bottom:12pt;">$1</h1>')
    // Bold & Italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Bullet lists
    .replace(/^\* (.*$)/gim, '<li style="margin-bottom:4pt;">$1</li>')
    .replace(/^- (.*$)/gim, '<li style="margin-bottom:4pt;">$1</li>')
    // Paragraphs
    .split('\n\n')
    .map(p => {
      p = p.trim();
      if (!p) return '';
      if (p.startsWith('<h') || p.startsWith('<li')) return p;
      if (p.includes('<li')) return `<ul style="margin-top:6pt; margin-bottom:12pt; padding-left:20pt;">${p}</ul>`;
      return `<p style="font-size:11pt; line-height:1.6; color:#334155; margin-bottom:12pt; text-align:justify;">${p.replace(/\n/g, '<br/>')}</p>`;
    })
    .join('');
}

/**
 * Export proposal narrative to Microsoft Word compatible file (.doc/.docx)
 */
export function exportToWord(options: ExportOptions) {
  const { title, funder, draft, organization, amount, deadline } = options;
  
  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const deadlineFormatted = deadline 
    ? new Date(deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'N/A';

  const bodyHTML = markdownToHTML(draft);

  const documentContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        @page {
          size: 8.5in 11in;
          margin: 1.0in 1.0in 1.0in 1.0in;
          mso-header-margin: .5in;
          mso-footer-margin: .5in;
        }
        body {
          font-family: 'Calibri', 'Arial', sans-serif;
          font-size: 11pt;
          line-height: 1.5;
          color: #1e293b;
        }
        .cover-box {
          border: 2px solid #059669;
          padding: 24pt;
          background-color: #f0fdf4;
          margin-bottom: 24pt;
          border-radius: 8pt;
        }
        .header-title {
          font-size: 22pt;
          font-weight: bold;
          color: #065f46;
          margin-bottom: 6pt;
        }
        .meta-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 12pt;
        }
        .meta-table td {
          padding: 4pt 8pt;
          font-size: 10pt;
        }
        .meta-label {
          font-weight: bold;
          color: #047857;
          width: 140pt;
        }
      </style>
    </head>
    <body>
      <div class="cover-box">
        <div class="header-title">${title}</div>
        <div style="font-size: 13pt; color: #047857; font-weight: bold;">Grant Proposal Narrative</div>
        <table class="meta-table">
          <tr>
            <td class="meta-label">Funding Opportunity:</td>
            <td>${title}</td>
          </tr>
          <tr>
            <td class="meta-label">Funding Agency:</td>
            <td>${funder}</td>
          </tr>
          <tr>
            <td class="meta-label">Applicant Entity:</td>
            <td>${organization?.name || 'Organization Applicant'}</td>
          </tr>
          <tr>
            <td class="meta-label">Requested Amount:</td>
            <td>${amount && amount > 0 ? `$${Number(amount).toLocaleString()}` : 'Refer to Budget Narrative'}</td>
          </tr>
          <tr>
            <td class="meta-label">Submission Deadline:</td>
            <td>${deadlineFormatted}</td>
          </tr>
          <tr>
            <td class="meta-label">Date Generated:</td>
            <td>${formattedDate}</td>
          </tr>
        </table>
      </div>

      <div style="margin-top: 24pt;">
        ${bodyHTML || '<p><em>No narrative content generated yet.</em></p>'}
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + documentContent], {
    type: 'application/msword'
  });

  const fileName = `${title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30)}_Proposal.doc`;
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

/**
 * Export proposal narrative to formatted PDF via browser print view
 */
export function exportToPDF(options: ExportOptions) {
  const { title, funder, draft, organization, amount, deadline } = options;

  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  const deadlineFormatted = deadline 
    ? new Date(deadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'N/A';

  const bodyHTML = markdownToHTML(draft);

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to export PDF.');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title} - Proposal</title>
      <style>
        @page {
          size: letter;
          margin: 1in;
        }
        body {
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 11pt;
          line-height: 1.6;
          color: #0f172a;
          padding: 20px;
        }
        .header {
          border-bottom: 2px solid #10b981;
          padding-bottom: 16px;
          margin-bottom: 24px;
        }
        .title {
          font-size: 20pt;
          font-weight: 800;
          color: #065f46;
          margin: 0 0 6px 0;
        }
        .subtitle {
          font-size: 12pt;
          color: #047857;
          font-weight: 600;
        }
        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          background: #f0fdf4;
          border: 1px solid #a7f3d0;
          padding: 16px;
          border-radius: 8px;
          margin-top: 16px;
          font-size: 10pt;
        }
        .grid-item span {
          font-weight: bold;
          color: #047857;
        }
        .content {
          margin-top: 24px;
        }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 20px; text-align: right;">
        <button onclick="window.print()" style="background:#059669; color:white; border:none; padding:10px 20px; font-weight:bold; border-radius:6px; cursor:pointer;">
          Print / Save as PDF
        </button>
      </div>

      <div class="header">
        <h1 class="title">${title}</h1>
        <div class="subtitle">Grant Proposal Narrative · ${funder}</div>
        <div class="grid">
          <div class="grid-item"><span>Applicant Organization:</span> ${organization?.name || 'Applicant'}</div>
          <div class="grid-item"><span>Funding Agency:</span> ${funder}</div>
          <div class="grid-item"><span>Funding Request:</span> ${amount && amount > 0 ? `$${Number(amount).toLocaleString()}` : 'Refer to Budget'}</div>
          <div class="grid-item"><span>Deadline:</span> ${deadlineFormatted}</div>
          <div class="grid-item"><span>Date Exported:</span> ${formattedDate}</div>
        </div>
      </div>

      <div class="content">
        ${bodyHTML || '<p><em>No narrative content generated.</em></p>'}
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 300);
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

/**
 * Generates and triggers download or print of a candidate's resume
 * @param {Object} profile - Candidate profile object
 */
export const downloadResumePdf = (profile) => {
  if (!profile) return;

  const candidateName = profile.fullName || 'Candidate';
  const email = profile.email || '';
  const phone = profile.phone || '';
  const location = profile.location || '';
  const summary = profile.summary || 'No professional summary provided.';
  const skills = profile.skills || [];
  const experience = profile.experience || [];
  const education = profile.education || [];

  const resumeHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${candidateName} - Resume</title>
  <style>
    @page {
      margin: 1.5cm;
      size: A4;
    }
    body {
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      line-height: 1.5;
      padding: 24px;
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
    }
    .header {
      border-bottom: 2px solid #4f46e5;
      padding-bottom: 16px;
      margin-bottom: 20px;
    }
    .name {
      font-size: 28px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 6px 0;
      letter-spacing: -0.5px;
    }
    .contact-info {
      font-size: 13px;
      color: #64748b;
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
    .contact-item {
      display: inline-block;
    }
    .section {
      margin-bottom: 20px;
    }
    .section-title {
      font-size: 15px;
      font-weight: 700;
      color: #4f46e5;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 4px;
      margin-bottom: 10px;
    }
    .summary-text {
      font-size: 14px;
      color: #334155;
      line-height: 1.6;
      margin: 0;
    }
    .skills-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .skill-badge {
      display: inline-block;
      background: #f1f5f9;
      color: #334155;
      padding: 3px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      border: 1px solid #e2e8f0;
    }
    .item-card {
      margin-bottom: 12px;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin-bottom: 2px;
    }
    .item-title {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
    }
    .item-meta {
      font-size: 12px;
      color: #64748b;
      font-weight: 500;
    }
    .item-subtitle {
      font-size: 13px;
      color: #4f46e5;
      font-weight: 600;
      margin-bottom: 4px;
    }
    .item-desc {
      font-size: 13px;
      color: #475569;
      line-height: 1.5;
      margin: 0;
    }
    .watermark {
      margin-top: 30px;
      padding-top: 12px;
      border-top: 1px dashed #cbd5e1;
      font-size: 11px;
      color: #94a3b8;
      text-align: center;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="name">${candidateName}</h1>
    <div class="contact-info">
      ${email ? `<span class="contact-item">📧 ${email}</span>` : ''}
      ${phone ? `<span class="contact-item">📱 ${phone}</span>` : ''}
      ${location ? `<span class="contact-item">📍 ${location}</span>` : ''}
      <span class="contact-item">⚡ TalentPulse Verified Candidate</span>
    </div>
  </div>

  ${
    summary
      ? `
  <div class="section">
    <div class="section-title">Professional Summary</div>
    <p class="summary-text">${summary}</p>
  </div>`
      : ''
  }

  ${
    skills && skills.length > 0
      ? `
  <div class="section">
    <div class="section-title">Technical Skills & Competencies</div>
    <div class="skills-grid">
      ${skills.map((s) => `<span class="skill-badge">${s}</span>`).join('')}
    </div>
  </div>`
      : ''
  }

  ${
    experience && experience.length > 0
      ? `
  <div class="section">
    <div class="section-title">Work Experience</div>
    ${experience
      .map(
        (exp) => `
      <div class="item-card">
        <div class="item-header">
          <span class="item-title">${exp.title || 'Role'}</span>
          <span class="item-meta">${exp.startYear || ''} - ${exp.endYear || 'Present'}</span>
        </div>
        <div class="item-subtitle">${exp.company || ''}</div>
        ${exp.description ? `<p class="item-desc">${exp.description}</p>` : ''}
      </div>`
      )
      .join('')}
  </div>`
      : ''
  }

  ${
    education && education.length > 0
      ? `
  <div class="section">
    <div class="section-title">Education & Certifications</div>
    ${education
      .map(
        (edu) => `
      <div class="item-card">
        <div class="item-header">
          <span class="item-title">${edu.degree || 'Degree'}</span>
          <span class="item-meta">${edu.startYear || ''} - ${edu.endYear || ''}</span>
        </div>
        <div class="item-subtitle">${edu.institution || ''}</div>
      </div>`
      )
      .join('')}
  </div>`
      : ''
  }

  <div class="watermark">
    Generated via TalentPulse Candidate Portal • Verified Application Document
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
`;

  // Create a new window or print-friendly document
  const printWindow = window.open('', '_blank', 'width=850,height=1100');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(resumeHtml);
    printWindow.document.close();
  } else {
    // Fallback: trigger file download as HTML/text resume file
    const safeFileName = `${candidateName.replace(/\s+/g, '_')}_Resume.html`;
    const blob = new Blob([resumeHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = safeFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};

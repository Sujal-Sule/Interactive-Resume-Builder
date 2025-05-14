// Add multiple project entries dynamically
async function downloadResume() {
    const filename = prompt("Enter a filename for your resume:", "resume");

    if (!filename) return;
      const { jsPDF } = window.jspdf;
      const resume = document.getElementById('resumePreview');
      const pageSizeSelect = document.getElementById('pageSizeSelect');
      const pageSize = pageSizeSelect ? pageSizeSelect.value : 'a4'; // default to A4
      const canvas = await html2canvas(resume, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', pageSize);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${filename}.pdf`);
    }
document.getElementById('addProjectBtn').addEventListener('click', () => {
    const projectsSection = document.getElementById('projectsSection');
  
    const projectDiv = document.createElement('div');
    projectDiv.classList.add('project-entry');
    projectDiv.style.marginTop = '15px';
  
    projectDiv.innerHTML = `
      <input type="text" name="projectName" placeholder="Project Name" />
      <textarea name="projectDescription" placeholder="Project Description"></textarea>
      <label class="file-label">Project Screenshots:</label>
      <input type="file" name="projectScreenshots" accept="image/*" multiple />
    `;
  
    projectsSection.appendChild(projectDiv);
    // Trigger preview update for new inputs
    attachProjectListeners(projectDiv);
  });
  
  // Change template style on selection
  function changeTemplate() {
    const select = document.getElementById('templateSelect');
    const preview = document.getElementById('resumePreview');
  
    preview.className = ''; // clear all classes
    preview.classList.add(select.value);
  }
  
  // Update resume preview live
  function updatePreview() {
    const form = document.getElementById('resumeForm');
    const preview = document.getElementById('resumePreview');
  
    const name = form.name.value.trim() || 'Your Name';
    const email = form.email.value.trim() || 'your.email@example.com';
    const phone = form.phone.value.trim() || '+1234567890';
    const linkedin = form.linkedin.value.trim();
    const summary = form.summary.value.trim() || 'A short professional summary goes here.';
    const skills = form.skills.value.trim() || 'Skill1, Skill2, Skill3';
  
    // Profile picture preview
    const profilePicFile = form.profilePic.files[0];
    if (profilePicFile) {
      const reader = new FileReader();
      reader.onload = function(e) {
        buildPreview(e.target.result);
      };
      reader.readAsDataURL(profilePicFile);
    } else {
      buildPreview('');
    }
  
    function buildPreview(profilePicURL) {
      const projectEntries = document.querySelectorAll('.project-entry');
      let projectsHTML = '';
  
      projectEntries.forEach((projectDiv) => {
        const projName = projectDiv.querySelector('input[name="projectName"]').value.trim();
        const projDesc = projectDiv.querySelector('textarea[name="projectDescription"]').value.trim();
        const projScreenshotsFiles = projectDiv.querySelector('input[name="projectScreenshots"]').files;
  
        let screenshotsHTML = '';
        if (projScreenshotsFiles.length > 0) {
          for (let i = 0; i < projScreenshotsFiles.length; i++) {
            const file = projScreenshotsFiles[i];
            const url = URL.createObjectURL(file);
            screenshotsHTML += `<img src="${url}" alt="Project Screenshot ${i+1}">`;
          }
        }
  
        if (projName || projDesc || screenshotsHTML) {
          projectsHTML += `
            <div class="project">
              <h3>${projName || 'Project Name'}</h3>
              <p>${projDesc || 'Project description goes here.'}</p>
              <div class="project-screenshots">${screenshotsHTML}</div>
            </div>
          `;
        }
      });
  
      preview.innerHTML = `
        ${profilePicURL ? `<img src="${profilePicURL}" alt="Profile Picture" class="profile-pic" loading="lazy">` : ''}
        <h1>${name}</h1>
        <p><strong>Email:</strong> ${email} | <strong>Phone:</strong> ${phone}</p>
        ${linkedin ? `<p><strong>LinkedIn:</strong> <a href="${linkedin}" target="_blank" rel="noopener">${linkedin}</a></p>` : ''}
        <section><h2>Professional Summary</h2><p>${summary}</p></section>
        <section><h2>Skills</h2><p>${skills}</p></section>
        ${projectsHTML ? `<section><h2>Projects</h2>${projectsHTML}</section>` : ''}
      `;
  
      changeTemplate();
    }
  }
  
  // Attach input/change listeners for live preview on all form inputs
  function attachListeners() {
    const form = document.getElementById('resumeForm');
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="url"], textarea, select, input[type="file"]');
  
    inputs.forEach(input => {
      input.addEventListener('input', updatePreview);
      input.addEventListener('change', updatePreview);
    });
  }
  
  // Attach listeners for dynamically added project inputs
  function attachProjectListeners(projectDiv) {
    const inputs = projectDiv.querySelectorAll('input, textarea');
  
    inputs.forEach(input => {
      input.addEventListener('input', updatePreview);
      input.addEventListener('change', updatePreview);
    });
  }
  
  // Initialize
  window.addEventListener('DOMContentLoaded', () => {
    attachListeners();
  
    // Attach listeners to existing project entry
    document.querySelectorAll('.project-entry').forEach(attachProjectListeners);
  
    // Initial preview
    updatePreview();
  });
  
let studentsData = [];
let filteredStudents = [];

async function loadData() {
  const res = await fetch("students.json");
  studentsData = await res.json();

  // Fill branch dropdown
  const branches = [...new Set(studentsData.map(s => s.branch))];
  const branchSelect = document.getElementById("branch");
  branches.forEach(b => {
    const opt = document.createElement("option");
    opt.value = b;
    opt.textContent = b;
    branchSelect.appendChild(opt);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadData();

  const branchSelect = document.getElementById("branch");
  const studentInput = document.getElementById("student");
  const suggestions = document.getElementById("suggestions");
  const loginBtn = document.getElementById("loginBtn");

  // Branch filter
  branchSelect.addEventListener("change", () => {
    studentInput.value = "";
    suggestions.innerHTML = "";
    suggestions.style.display = "none";
    filteredStudents = studentsData.filter(s => s.branch === branchSelect.value);
  });

  // Autocomplete
  studentInput.addEventListener("input", () => {
    const query = studentInput.value.toLowerCase();
    suggestions.innerHTML = "";
    if (!query) {
      suggestions.style.display = "none";
      return;
    }
    const matches = filteredStudents.filter(s => s.name.toLowerCase().includes(query));
    if (matches.length) {
      matches.forEach(m => {
        const li = document.createElement("li");
        li.textContent = `${m.name} (${m.id})`;
        li.onclick = () => {
          studentInput.value = m.name;
          studentInput.dataset.selectedId = m.id;
          suggestions.innerHTML = "";
          suggestions.style.display = "none";
        };
        suggestions.appendChild(li);
      });
      suggestions.style.display = "block";
    } else {
      suggestions.style.display = "none";
    }
  });

  // Redirect
  loginBtn.addEventListener("click", () => {
    const id = studentInput.dataset.selectedId;
    if (!id) {
      alert("Please select a student from suggestions");
      return;
    }
    // Redirect to student page
    window.location.href = `students/${id}.html`;
  });
});

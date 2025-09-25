let studentsData = [];
let filteredStudents = [];

async function loadData() {
  const res = await fetch("students.json"); // Your JSON file
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

  filteredStudents = studentsData;
}

document.addEventListener("DOMContentLoaded", () => {
  loadData();

  const branchSelect = document.getElementById("branch");
  const studentInput = document.getElementById("student");
  const suggestions = document.getElementById("suggestions");
  const loginBtn = document.getElementById("loginBtn");
  const resultDiv = document.getElementById("result");
  const resId = document.getElementById("resId");
  const resPass = document.getElementById("resPass");

  branchSelect.addEventListener("change", () => {
    const branch = branchSelect.value;
    filteredStudents = branch ? studentsData.filter(s => s.branch === branch) : studentsData;
    studentInput.value = "";
    suggestions.innerHTML = "";
    suggestions.style.display = "none";
  });

  studentInput.addEventListener("input", () => {
    const query = studentInput.value.toLowerCase();
    suggestions.innerHTML = "";
    if (!query) {
      suggestions.style.display = "none";
      return;
    }

    const matches = filteredStudents.filter(s =>
      s.name.toLowerCase().includes(query) || s.id.toLowerCase().includes(query)
    );

    if (matches.length) {
      matches.forEach(m => {
        const li = document.createElement("li");
        li.textContent = `${m.branch}-${m.name} (${m.id})`;
        li.onclick = () => {
          studentInput.value = m.name;
          studentInput.dataset.selectedId = m.id;
          studentInput.dataset.selectedPassword = m.password;
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

  loginBtn.addEventListener("click", () => {
    const id = studentInput.dataset.selectedId;
    const password = studentInput.dataset.selectedPassword;

    if (!id || !password) {
      alert("Please select a student from the suggestions.");
      return;
    }

    resId.textContent = id;
    resPass.textContent = password;
    resultDiv.style.display = "block";
  });

  document.getElementById("copyId").addEventListener("click", () => {
    navigator.clipboard.writeText(resId.textContent);
    alert("ID copied!");
  });

  document.getElementById("copyPass").addEventListener("click", () => {
    navigator.clipboard.writeText(resPass.textContent);
    alert("Password copied!");
  });
});

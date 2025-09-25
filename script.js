let studentsData = [];
let filteredStudents = [];

async function loadData() {
  const res = await fetch("students.json");
  studentsData = await res.json();

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

  branchSelect.addEventListener("change", () => {
    studentInput.value = "";
    studentInput.dataset.selectedId = "";
    suggestions.innerHTML = "";
    filteredStudents = studentsData.filter(s => s.branch === branchSelect.value);
  });

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
          studentInput.dataset.password = m.password;
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
    const password = studentInput.dataset.password;

    if (!id || !password) {
      alert("Please select a student from the suggestions.");
      return;
    }

    // Create hidden form to auto-submit
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://vvit-erp.edunxt.co.in/student/login";
    form.target = "_self";

    const inputId = document.createElement("input");
    inputId.type = "hidden";
    inputId.name = "username";  // must match login form field name
    inputId.value = id;

    const inputPwd = document.createElement("input");
    inputPwd.type = "hidden";
    inputPwd.name = "password";  // must match login form field name
    inputPwd.value = password;

    form.appendChild(inputId);
    form.appendChild(inputPwd);
    document.body.appendChild(form);
    form.submit();
  });
});

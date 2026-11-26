// ==========================================
// 1. DOM ELEMENTS
// Dapatkan elemen HTML yang diperlukan
// ==========================================

const addPatientButton = document.getElementById("addPatient");
const report = document.getElementById("report");
const btnSearch = document.getElementById("btnSearch");
const conditionInput = document.getElementById("conditionInput");
const resultDiv = document.getElementById("result");

// Simpan semua maklumat pesakit dalam array
const patients = [];

// ==========================================
// 2. ADD PATIENT
// Tambah maklumat pesakit ke dalam array
// ==========================================

function addPatient() {
  // Dapatkan nilai daripada input HTML
  const name = document.getElementById("name").value.trim();

  const gender = document.querySelector('input[name="gender"]:checked');

  const age = Number(document.getElementById("age").value);

  const condition = document.getElementById("condition").value;

  // Validasi input
  if (!name || !gender || !age || !condition) {
    alert("Please complete all patient information.");
    return;
  }

  if (age <= 0 || !Number.isInteger(age)) {
    alert("Please enter a valid age.");
    return;
  }

  // Simpan pesakit sebagai object dalam array
  const patient = {
    name: name,
    gender: gender.value,
    age: age,
    condition: condition,
  };

  patients.push(patient);

  // Kosongkan borang
  resetForm();

  // Jana laporan terkini
  generateReport();

  alert("Patient added successfully!");
}

// ==========================================
// 3. RESET FORM
// Kosongkan semua input selepas submit
// ==========================================

function resetForm() {
  document.getElementById("name").value = "";

  const selectedGender = document.querySelector('input[name="gender"]:checked');

  if (selectedGender) {
    selectedGender.checked = false;
  }

  document.getElementById("age").value = "";

  document.getElementById("condition").value = "";
}

// ==========================================
// 4. GENERATE REPORT
// Kira jumlah pesakit dan pecahan condition
// ==========================================

function generateReport() {
  // Kira jumlah pesakit
  const numPatients = patients.length;

  // Sediakan kategori condition
  const conditionsCount = {
    Diabetes: 0,
    Thyroid: 0,
    "High Blood Pressure": 0,
  };

  // Pecahan condition berdasarkan jantina
  const genderConditionsCount = {
    Male: {
      Diabetes: 0,
      Thyroid: 0,
      "High Blood Pressure": 0,
    },

    Female: {
      Diabetes: 0,
      Thyroid: 0,
      "High Blood Pressure": 0,
    },
  };

  // Loop semua pesakit untuk mengira statistik
  for (const patient of patients) {
    conditionsCount[patient.condition]++;

    genderConditionsCount[patient.gender][patient.condition]++;
  }

  // Kosongkan laporan lama
  report.innerHTML = "";

  // Paparkan jumlah pesakit
  const total = document.createElement("p");

  total.innerHTML = `<strong>Number of patients:</strong> ${numPatients}`;

  report.appendChild(total);

  // Paparkan pecahan condition
  const conditionTitle = document.createElement("h4");

  conditionTitle.textContent = "Conditions Breakdown";

  report.appendChild(conditionTitle);

  for (const condition in conditionsCount) {
    const paragraph = document.createElement("p");

    paragraph.textContent = `${condition}: ${conditionsCount[condition]}`;

    report.appendChild(paragraph);
  }

  // Paparkan pecahan berdasarkan jantina
  const genderTitle = document.createElement("h4");

  genderTitle.textContent = "Gender-Based Conditions";

  report.appendChild(genderTitle);

  for (const gender in genderConditionsCount) {
    const genderHeading = document.createElement("h5");

    genderHeading.textContent = gender;

    report.appendChild(genderHeading);

    for (const condition in genderConditionsCount[gender]) {
      const paragraph = document.createElement("p");

      paragraph.textContent = `${condition}: ${genderConditionsCount[gender][condition]}`;

      report.appendChild(paragraph);
    }
  }
}

// ==========================================
// 5. SEARCH CONDITION
// Cari maklumat kesihatan daripada JSON
// ==========================================

async function searchCondition() {
  // Dapatkan input carian
  const input = conditionInput.value.trim().toLowerCase();

  // Semak input kosong
  if (!input) {
    resultDiv.textContent = "Please enter a health condition.";

    return;
  }

  // Paparkan loading
  resultDiv.textContent = "Searching...";

  try {
    // Ambil data daripada JSON
    const response = await fetch("./health_analysis.json");

    // Semak status response
    if (!response.ok) {
      throw new Error("Unable to load health data.");
    }

    const data = await response.json();

    // Cari condition yang sepadan
    const condition = data.conditions.find(
      (item) => item.name.toLowerCase() === input,
    );

    // Kosongkan hasil carian lama
    resultDiv.innerHTML = "";

    // Jika condition tidak dijumpai
    if (!condition) {
      resultDiv.textContent = "Condition not found.";

      return;
    }

    // ======================================
    // Paparkan maklumat condition
    // ======================================

    const title = document.createElement("h3");

    title.textContent = condition.name;

    resultDiv.appendChild(title);

    // Paparkan gambar
    const image = document.createElement("img");

    image.src = condition.imagesrc;

    image.alt = `${condition.name} illustration`;

    image.className = "condition-result-image";

    resultDiv.appendChild(image);

    // Paparkan symptoms
    createResultSection("Symptoms", condition.symptoms.join(", "));

    // Paparkan prevention
    createResultSection("Prevention", condition.prevention.join(", "));

    // Paparkan treatment
    createResultSection("Treatment", condition.treatment);
  } catch (error) {
    // Paparkan error dalam console
    console.error("Search error:", error);

    resultDiv.textContent = "An error occurred while fetching health data.";
  }
}

// ==========================================
// 6. CREATE RESULT SECTION
// Fungsi reusable untuk paparan hasil carian
// ==========================================

function createResultSection(title, content) {
  // Heading
  const heading = document.createElement("h5");

  heading.textContent = title;

  // Description
  const paragraph = document.createElement("p");

  paragraph.textContent = content;

  // Masukkan ke dalam result container
  resultDiv.appendChild(heading);

  resultDiv.appendChild(paragraph);
}

// ==========================================
// 7. EVENT LISTENERS
// Hubungkan JavaScript dengan HTML
// ==========================================

// Event apabila butang Add Patient ditekan
addPatientButton.addEventListener("click", addPatient);

// Event apabila butang Search ditekan
btnSearch.addEventListener("click", searchCondition);

// Event apabila pengguna tekan Enter
conditionInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchCondition();
  }
});

class Student {

    #math;
    #programming;
    #english;
    #attendance;

    constructor(name, math, programming, english, attendance) {

        if (name.trim() === "") {
            throw new Error("Please enter student name.");
        }

        this.name = name.trim();

        this.math = math;
        this.programming = programming;
        this.english = english;
        this.attendance = attendance;
    }


    validateGrade(value, subject) {

        if (value === "") {
            throw new Error(subject + " cannot be empty.");
        }

        let number = Number(value);

        if (!Number.isFinite(number) || number < 0 || number > 100) {
            throw new Error(subject + " must be between 0 and 100.");
        }

        return number;
    }


    set math(value) {
        this.#math = this.validateGrade(value, "Math grade");
    }

    set programming(value) {
        this.#programming = this.validateGrade(value, "Programming grade");
    }

    set english(value) {
        this.#english = this.validateGrade(value, "English grade");
    }

    set attendance(value) {
        this.#attendance = this.validateGrade(value, "Attendance");
    }


    get math() {
        return this.#math;
    }

    get programming() {
        return this.#programming;
    }

    get english() {
        return this.#english;
    }

    get attendance() {
        return this.#attendance;
    }


    calculateAverage() {

        return (
            this.#math +
            this.#programming +
            this.#english
        ) / 3;

    }
}



let registeredStudents = [];

const nameInput = document.getElementById("nameInput");

const mathInput = document.getElementById("mathInput");

const programmingInput = document.getElementById("programmingInput");

const englishInput = document.getElementById("englishInput");

const attendanceInput = document.getElementById("attendanceInput");

const saveBtn = document.getElementById("saveBtn");

const committeeBtn = document.getElementById("committeeBtn");

const errorBox = document.getElementById("errorBox");

const studentContainer = document.getElementById("studentContainer");

const reportBox = document.getElementById("reportBox");



function clearError() {

    errorBox.textContent = "";

    errorBox.classList.add("d-none");

}



function clearForm() {

    nameInput.value = "";
    mathInput.value = "";
    programmingInput.value = "";
    englishInput.value = "";
    attendanceInput.value = "";

}


saveBtn.onclick = function () {

    try {

        clearError();

    

        let student = new Student(
            nameInput.value,
            mathInput.value,
            programmingInput.value,
            englishInput.value,
            attendanceInput.value
        );

        registeredStudents.push(student);



        const emptyMessage = studentContainer.querySelector("p");

        if (emptyMessage) {
            emptyMessage.remove();
        }



        let studentElement = document.createElement("div");

        studentElement.className = "student-item";

        studentElement.textContent =
            student.name +
            " | Average: " +
            student.calculateAverage().toFixed(2);

        studentContainer.appendChild(studentElement);

    

        clearForm();

    

        reportBox.innerHTML = `
            <p class="text-muted">
                Click Run Grace Committee to generate the report.
            </p>
        `;

    }

    catch (error) {

        errorBox.textContent = error.message;

        errorBox.classList.remove("d-none");

    }

};


committeeBtn.onclick = function () {

    clearError();


    const eligibleStudents = registeredStudents.filter(
        function(student) {

            let average = student.calculateAverage();

            return average >= 40 && average <= 49;

        }
    );



    const updatedStudents = eligibleStudents.map(
        function(student) {

            return {

                name: student.name,

                originalAverage: student.calculateAverage(),

                newAverage: student.calculateAverage() + 5

            };

        }
    );


    const totalAverage = updatedStudents.reduce(
        function(total, student) {

            return total + student.newAverage;

        }, 0
    );



    let generalAverage = 0;

    if (updatedStudents.length > 0) {

        generalAverage = totalAverage / updatedStudents.length;

    }



    if (updatedStudents.length === 0) {

        reportBox.innerHTML = `
            <div class="report-result">

                <h5>No Eligible Students</h5>

                <p>
                    No students have an average between 40 and 49.
                </p>

            </div>
        `;

        return;

    }


    let resultsHTML = "";

    updatedStudents.forEach(function(student) {

        const item = document.createElement("div");

        item.className = "student-item";

        const name = document.createElement("strong");
        name.textContent = student.name;

        const details = document.createElement("p");

        details.textContent =
            "Original Average: " +
            student.originalAverage.toFixed(2) +
            " | After Grace: " +
            student.newAverage.toFixed(2);

        item.appendChild(name);
        item.appendChild(details);

        resultsHTML += item.outerHTML;

    });


    reportBox.innerHTML = `

        <div class="report-result">

            <h5>Grace Committee Final Report</h5>

            <p>
                <strong>Number of Eligible Students:</strong>
                ${updatedStudents.length}
            </p>

            <h6>Student Names and Results:</h6>

            ${resultsHTML}

            <hr>

            <h5>
                General Average After Grace:
                ${generalAverage.toFixed(2)}
            </h5>

        </div>

    `;

};
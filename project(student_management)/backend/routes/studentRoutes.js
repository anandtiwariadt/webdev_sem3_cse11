import express from "express";

const router = express.Router();

//student data
const students = [
    {
        id: 101,
        name: "Rahul Sharma",
        email: "rahul@gmail.com",
        branch: "CSE",
        semester: 3,
        mobile: "9876543210"
    },
    {
        id: 102,
        name: "Priya Singh",
        email: "priya@gmail.com",
        branch: "ECE",
        semester: 4,
        mobile: "9876543211"
    }
];

const branches = ["CSE", "CS", "IT", "ECE"];

function validateStudent(data, isUpdate = false) {
    const { id, name, email, branch, semester, mobile } = data;
    const errors = {};

    if (!isUpdate && (id === undefined || id === "")) {
        errors.id = "Student ID is required";
    }

    if (id !== undefined && id !== "" && !Number.isInteger(Number(id))) {
        errors.id = "Student ID must be a number";
    }

    if (!name || !String(name).trim()) {
        errors.name = "Name is required";
    }

    if (!email || !String(email).trim()) {
        errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
        errors.email = "Enter a valid email address";
    }

    if (!branches.includes(branch)) {
        errors.branch = "Branch must be CSE, CS, IT or ECE";
    }

    if (semester === undefined || semester === "") {
        errors.semester = "Semester is required";
    } else if (!Number.isInteger(Number(semester)) || Number(semester) < 1 || Number(semester) > 8) {
        errors.semester = "Semester must be between 1 and 8";
    }

    if (!/^\d{10}$/.test(String(mobile ?? ""))) {
        errors.mobile = "Mobile number must contain exactly 10 digits";
    }

    return errors;
}

//fetch all students
router.get("/", (req, res) => {
    try {
        res.status(200).json({
            message: "Data received",
            students
        });
    } catch (err) {
        console.log("error:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

//fetch one student
router.get("/:id", (req, res) => {
    try {
        const id = Number(req.params.id);
        const student = students.find((s) => s.id === id);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({
            message: "Data received",
            student
        });
    } catch (err) {
        console.log("error:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

//add a student
router.post("/", (req, res) => {
    try {
        const errors = validateStudent(req.body);

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: "Validation failed",
                errors
            });
        }

        const id = Number(req.body.id);
        const existingStudent = students.find((s) => s.id === id);

        if (existingStudent) {
            return res.status(409).json({
                message: "Student ID must be unique"
            });
        }

        const newStudent = {
            id,
            name: req.body.name.trim(),
            email: req.body.email.trim(),
            branch: req.body.branch,
            semester: Number(req.body.semester),
            mobile: String(req.body.mobile)
        };

        students.push(newStudent);

        res.status(201).json({
            message: "Student added successfully",
            student: newStudent
        });
    } catch (err) {
        console.log("error:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
});
//update a student
router.put("/:id", (req, res) => {
    try {
        const id = Number(req.params.id);
        const studentIndex = students.findIndex((s) => s.id === id);

        if (studentIndex === -1) {
            return res.status(404).json({ message: "Student not found" });
        }

        const updatedData = {
            ...req.body,
            id
        };

        const errors = validateStudent(updatedData, true);

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: "Validation failed",
                errors
            });
        }

        const updatedStudent = {
            id,
            name: req.body.name.trim(),
            email: req.body.email.trim(),
            branch: req.body.branch,
            semester: Number(req.body.semester),
            mobile: String(req.body.mobile)
        };

        students[studentIndex] = updatedStudent;

        res.status(200).json({
            message: "Student updated successfully",
            student: updatedStudent
        });
    } catch (err) {
        console.log("error:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

//delete a student
router.delete("/:id", (req, res) => {
    try {
        const id = Number(req.params.id);
        const studentIndex = students.findIndex((s) => s.id === id);

        if (studentIndex === -1) {
            return res.status(404).json({ message: "Student not found" });
        }

        const deletedStudent = students.splice(studentIndex, 1)[0];

        res.status(200).json({
            message: "Student deleted successfully",
            student: deletedStudent
        });
    } catch (err) {
        console.log("error:", err.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
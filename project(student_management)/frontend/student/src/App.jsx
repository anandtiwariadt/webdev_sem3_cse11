import { useEffect, useState } from "react";
import StudentForm from "./components/StudentForm.jsx";
import StudentList from "./components/StudentList.jsx";
import SearchStudent from "./components/SearchStudent.jsx";

const API_URL = "http://localhost:3000/api/students";

function App() {
    const [students, setStudents] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("success");
    const [loading, setLoading] = useState(false);

    const showMessage = (text, type = "success") => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => {
            setMessage("");
        }, 2500);
    };

    const getStudents = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_URL);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            setStudents(data.students);
        } catch (error) {
            showMessage(error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getStudents();
    }, []);

    const saveStudent = async (student) => {
        try {
            const editing = editingStudent !== null;
            const url = editing ? `${API_URL}/${editingStudent.id}` : API_URL;
            const method = editing ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(student)
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.errors) {
                    throw new Error(Object.values(data.errors).join(" | "));
                }
                throw new Error(data.message || "Something went wrong");
            }

            showMessage(data.message);
            setEditingStudent(null);
            getStudents();
        } catch (error) {
            showMessage(error.message, "error");
            throw error;
        }
    };

    const editStudent = (student) => {
        setEditingStudent(student);
        window.scrollTo(0, 0);
    };

    const deleteStudent = async (id) => {
        const confirmDelete = window.confirm("Do you want to delete this student?");

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE"
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to delete student");
            }

            showMessage(data.message);
            setEditingStudent(null);
            getStudents();
        } catch (error) {
            showMessage(error.message, "error");
        }
    };

    const filteredStudents = students.filter((student) => {
        const search = searchTerm.toLowerCase().trim();

        return (
            String(student.id).includes(search) ||
            student.name.toLowerCase().includes(search)
        );
    });

    return (
        <div className="app">
            <header>
                <h1>Student Management System</h1>
                <p>React.js + Node.js + Express.js</p>
            </header>

            <main className="container">
                {message && (
                    <div className={`message ${messageType}`}>
                        {message}
                    </div>
                )}

                <StudentForm
                    editingStudent={editingStudent}
                    onSubmit={saveStudent}
                    onCancel={() => setEditingStudent(null)}
                />

                <section className="card">
                    <div className="list-top">
                        <h2>Student List</h2>
                        <SearchStudent
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                        />
                    </div>

                    <StudentList
                        students={filteredStudents}
                        loading={loading}
                        onEdit={editStudent}
                        onDelete={deleteStudent}
                        hasSearch={searchTerm.trim() !== ""}
                    />
                </section>
            </main>
        </div>
    );
}

export default App;
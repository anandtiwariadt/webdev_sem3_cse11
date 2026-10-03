function StudentList({ students, loading, onEdit, onDelete, hasSearch }) {
    if (loading) {
        return <p className="empty">Loading students...</p>;
    }

    if (students.length === 0) {
        return (
            <p className="empty">
                {hasSearch ? "No student found" : "No student records available"}
            </p>
        );
    }

    return (
        <div className="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Branch</th>
                        <th>Semester</th>
                        <th>Mobile Number</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student) => (
                        <tr key={student.id}>
                            <td>{student.id}</td>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.branch}</td>
                            <td>{student.semester}</td>
                            <td>{student.mobile}</td>
                            <td>
                                <button
                                    className="edit-button"
                                    onClick={() => onEdit(student)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="delete-button"
                                    onClick={() => onDelete(student.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default StudentList;
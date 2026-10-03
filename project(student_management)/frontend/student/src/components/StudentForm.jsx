import { useEffect, useState } from "react";

const emptyForm = {
    id: "",
    name: "",
    email: "",
    branch: "CSE",
    semester: "1",
    mobile: ""
};

function StudentForm({ editingStudent, onSubmit, onCancel }) {
    const [formData, setFormData] = useState(emptyForm);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (editingStudent) {
            setFormData({
                id: String(editingStudent.id),
                name: editingStudent.name,
                email: editingStudent.email,
                branch: editingStudent.branch,
                semester: String(editingStudent.semester),
                mobile: editingStudent.mobile
            });
        } else {
            setFormData(emptyForm);
            setErrors({});
        }
    }, [editingStudent]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.id) {
            newErrors.id = "Student ID is required";
        } else if (!/^\d+$/.test(formData.id)) {
            newErrors.id = "Student ID must be a number";
        }

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Enter a valid email";
        }

        if (Number(formData.semester) < 1 || Number(formData.semester) > 8) {
            newErrors.semester = "Semester must be 1 to 8";
        }

        if (!/^\d{10}$/.test(formData.mobile)) {
            newErrors.mobile = "Mobile number must be 10 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            setSaving(true);

            await onSubmit({
                id: Number(formData.id),
                name: formData.name.trim(),
                email: formData.email.trim(),
                branch: formData.branch,
                semester: Number(formData.semester),
                mobile: formData.mobile
            });
        } catch (error) {
            // Error message is shown by App.jsx
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="card">
            <h2>{editingStudent ? "Update Student" : "Add Student"}</h2>

            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <label>
                        Student ID
                        <input
                            type="number"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            disabled={Boolean(editingStudent)}
                        />
                        {errors.id && <small>{errors.id}</small>}
                    </label>

                    <label>
                        Name
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {errors.name && <small>{errors.name}</small>}
                    </label>

                    <label>
                        Email
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <small>{errors.email}</small>}
                    </label>

                    <label>
                        Branch
                        <select name="branch" value={formData.branch} onChange={handleChange}>
                            <option value="CSE">CSE</option>
                            <option value="CS">CS</option>
                            <option value="IT">IT</option>
                            <option value="ECE">ECE</option>
                        </select>
                    </label>

                    <label>
                        Semester
                        <select name="semester" value={formData.semester} onChange={handleChange}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                        </select>
                        {errors.semester && <small>{errors.semester}</small>}
                    </label>

                    <label>
                        Mobile Number
                        <input
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            maxLength="10"
                        />
                        {errors.mobile && <small>{errors.mobile}</small>}
                    </label>
                </div>

                <div className="form-buttons">
                    <button
                        className={editingStudent ? "update-button" : "add-button"}
                        type="submit"
                        disabled={saving}
                    >
                        {saving ? "Saving..." : editingStudent ? "Update Student" : "Add Student"}
                    </button>

                    {editingStudent && (
                        <button
                            type="button"
                            className="cancel-button"
                            onClick={onCancel}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </section>
    );
}

export default StudentForm;
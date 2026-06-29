
import { apiFetch } from "../../../lib/api";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AddAdminPage() {
    const navigate = useNavigate();

    // ======================
    // STATES
    // ======================
    const [existingUsers, setExistingUsers] = useState([]);
    const [emailExists, setEmailExists] = useState(false);
    const [roles, setRoles] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "", // If your backend needs the ID, we can change this to role._id
    });

    // ======================
    // FETCH USERS
    // ======================
    async function fetchUsers() {
        try {
            const response = await apiFetch("/admins");
            const data = await response.json();
            setExistingUsers(data.admins || []);
        } catch (error) {
            console.log(error);
        }
    }

    // ======================
    // FETCH ROLES
    // ======================
    async function fetchRoles() {
        try {
            const response = await apiFetch("/roles");
            const data = await response.json();
            setRoles(data.roles || []);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchRoles();
        fetchUsers();
    }, []);

    // ======================
    // HANDLE SUBMIT (Added back)
    // ======================
    async function handleSubmit(e) {
        e.preventDefault();

        if (emailExists) {
            alert("Please use a unique email address.");
            return;
        }

        try {
            const response = await apiFetch("/admins", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            // ERROR HANDLING
            if (!data.success) {
                alert(data.message || "Failed to add user");
                return;
            }

            // SUCCESS HANDLING
            alert("User Added Successfully");
            navigate("/admin/admins");
        } catch (error) {
            console.log("Submit Error:", error);
            alert("An error occurred while adding the user.");
        }
    }

    // ======================
    // UI
    // ======================
    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
            <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-6 sm:p-10">

                {/* Header */}
                <div className="mb-8 sm:mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
                        Add User
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Create new user
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">

                    {/* Name */}
                    <div>
                        <label className="block text-lg font-semibold text-gray-700 mb-2 sm:mb-3">
                            Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 bg-white text-black p-3 sm:p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-lg font-semibold text-gray-700 mb-2 sm:mb-3">
                            Email *
                        </label>
                        {emailExists && (
                            <p className="text-red-500 text-sm mb-2 font-medium">
                                Email already exists
                            </p>
                        )}
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={(e) => {
                                const value = e.target.value;
                                const exists = existingUsers.some(
                                    (item) =>
                                        item.email?.trim().toLowerCase() === value.trim().toLowerCase()
                                );
                                setEmailExists(exists);
                                setFormData({
                                    ...formData,
                                    email: value,
                                });
                            }}
                            className={`w-full border bg-white text-black p-3 sm:p-4 rounded-xl outline-none focus:ring-2 focus:ring-black ${emailExists ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                                }`}
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-lg font-semibold text-gray-700 mb-2 sm:mb-3">
                            Password *
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                            title="Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    password: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 bg-white text-black p-3 sm:p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
                        />
                    </div>

                    {/* Role */}
                    <div>
                        <label className="block text-lg font-semibold text-gray-700 mb-2 sm:mb-3">
                            Role *
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    role: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 bg-white text-black p-3 sm:p-4 rounded-xl outline-none focus:ring-2 focus:ring-black"
                            required
                        >
                            <option value="">Select Role</option>
                            {roles.map((role) => (
                                <option key={role._id} value={role.name}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={emailExists}
                            className="w-full sm:w-auto bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add User
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
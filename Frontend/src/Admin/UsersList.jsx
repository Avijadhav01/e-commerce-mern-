import React, { useEffect, useState } from 'react'
import "./AdminStyles/UsersList.css"
import { useDispatch, useSelector } from 'react-redux'
import { clearAdminSuccess, deleteUser, fetchUsers, removeAdminErrors, updateRole } from '../features/Admin/adminSlice';
import { toast } from "react-toastify"

import { FaSave, FaTrash } from "react-icons/fa";
import Navbar from "../components/Navbar"
import PageTitle from "../components/PageTitle"
import { Link } from 'react-router-dom';
// import Navbar from "../components/Navbar"

function UsersList() {
  const { users, error, loading, success, message } = useSelector(state => state.admin);
  const [roleChanges, setRoleChanges] = useState({});

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch])

  useEffect(() => {
    if (users) {
      // console.log(users)
    }
  }, [users])

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(removeAdminErrors());
    }
  }, [error, dispatch])

  useEffect(() => {
    if (success) {
      toast.success(message);
      // Refetch updated users list
      dispatch(fetchUsers());
      // Clear success state immediately to prevent duplicate triggers
      dispatch(clearAdminSuccess());
    }
  }, [success, message, dispatch]);


  const handleDelete = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(userId))
    }
  }

  const handleUpdateRole = (userId, newRole) => {
    dispatch(updateRole({ userId, role: newRole }));
  }

  return (
    <>
      <PageTitle title={"All Users"} />
      <Navbar cartIconHide={true} />
      <div className="usersList-container">
        <h1 className="usersList-title">All Users</h1>
        <div className="usersList-table-container">
          <table className="usersList-table">
            <thead>
              <tr>
                <th>SN</th>
                <th>Avatar</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, idx) => (
                  <tr key={user?._id}>
                    <td>{idx + 1}</td>
                    <td>
                      <img
                        src={user?.avatar?.url}
                        alt="Avatar"
                        className="user-image"
                      />
                    </td>
                    <td>{user?.fullName}</td>
                    <td>{user?.phone || "-"}</td>
                    <td>{user?.email}</td>
                    <td>
                      <select
                        name="role"
                        value={roleChanges[user?._id] || user?.role}
                        onChange={(e) =>
                          setRoleChanges({
                            ...roleChanges,
                            [user?._id]: e.target.value
                          })
                        } >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      {user?.createdAt
                        ?.slice(0, 10)
                        .split("-")
                        .reverse()
                        .join("-")}
                    </td>
                    <td>
                      <button
                        className="action-icon save-icon"
                        onClick={() => handleUpdateRole(user._id, roleChanges[user._id] || user.role)}
                      >
                        <FaSave
                          disabled={(roleChanges[user._id] || user.role) === user.role} />
                      </button>

                      <button
                        className="action-icon delete-icon"
                        onClick={() => handleDelete(user?._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                    Users not found!
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>
      </div>
    </>
  )
}

export default UsersList;
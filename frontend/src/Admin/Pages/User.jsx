import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiUsers, FiActivity, FiUser, FiInfo } from 'react-icons/fi';
import CommonTable from '../Component/CommonTable';
import CommonDeleteModal from '../Component/CommonDeleteModal';
import CommonViewModal from '../Component/CommonViewModal';
import { getAllUsers, deleteUser, getUserById, clearSelectedUser } from '../../redux/slices/userSlice';

// Helper for image URL
const getImageUrl = (image) => {
    if (!image) return null;
    if (typeof image === 'string') {
        return image.startsWith('http') ? image : `http://localhost:5000/uploads/${image}`;
    }
    return URL.createObjectURL(image);
};

const User = () => {
    const { isDark } = useOutletContext();
    const dispatch = useDispatch();

    const { users, loading, selectedUser, detailLoading } = useSelector((state) => state.user);

    // Local State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);

    const filteredUsers = useMemo(() => {
        return users.filter(user => user.role === 'user');
    }, [users]);

    const handleOpenDeleteModal = (user) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirm = () => {
        if (userToDelete) {
            dispatch(deleteUser(userToDelete._id)).then(() => {
                setIsDeleteModalOpen(false);
                setUserToDelete(null);
            });
        }
    };

    const handleViewUser = (user) => {
        dispatch(getUserById(user._id));
    };

    const columns = useMemo(() => [
        {
            header: 'User',
            accessor: 'firstName',
            render: (item) => (
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border overflow-hidden ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        {item.photo ? (
                            <img
                                src={getImageUrl(item.photo)}
                                alt={item.firstName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <FiUser className="text-slate-400" />
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.firstName} {item.lastName}</span>
                        <span className="text-[10px] text-slate-500 font-bold">{item.email}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'Role',
            accessor: 'role',
            render: (item) => (
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${item.role === 'admin'
                    ? 'bg-indigo-500/10 text-indigo-500'
                    : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                    {item.role || 'User'}
                </span>
            )
        },
        {
            header: 'Mobile',
            accessor: 'mobileNo',
            render: (item) => <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.mobileNo || 'N/A'}</span>
        },
        {
            header: 'Joined',
            accessor: 'createdAt',
            render: (item) => (
                <span className="text-[10px] font-bold text-slate-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                </span>
            )
        }
    ], [isDark]);

    return (
        <div className="">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className={`text-4xl font-black tracking-tighter flex items-center gap-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        User Base
                    </h1>
                    <p className="text-sm font-medium opacity-50 mt-1 uppercase tracking-[0.3em] flex items-center gap-2">
                        <span className="w-4 h-1 bg-emerald-500 rounded-full" /> Registered Accounts
                    </p>
                </motion.div>

                {/* Stats or Actions could go here */}
                <div className={`px-6 py-3 rounded-2xl border flex items-center gap-4 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100'}`}>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Total Users</span>
                        <span className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{filteredUsers.length}</span>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <FiUsers size={20} />
                    </div>
                </div>
            </div>

            <div className="w-full">
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
                    <div className={`rounded-md overflow-hidden ${isDark ? 'bg-[#0f172a] border-white/5 shadow-black' : 'bg-white border-slate-100 shadow-slate-200/40'}`}>
                        {/* Since backend doesn't support pagination yet, we rely on client-side pagination in CommonTable */}
                        <CommonTable
                            columns={columns}
                            data={filteredUsers}
                            isDark={isDark}
                            onView={handleViewUser}
                            onDelete={handleOpenDeleteModal}
                            showEdit={false} // No Edit for users
                            searchPlaceholder="Search users..."
                            itemsPerPage={10}
                        />
                    </div>
                </motion.div>
            </div>

            <CommonDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                isDark={isDark}
                title="Remove User?"
                message="This will permanently delete the user account and associated data."
                itemName={userToDelete ? `${userToDelete.firstName} ${userToDelete.lastName}` : 'User'}
            />

            <CommonViewModal
                isOpen={!!selectedUser || detailLoading}
                onClose={() => dispatch(clearSelectedUser())}
                isDark={isDark}
                title={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : ''}
                subtitle={selectedUser?.email}
                description={`User ID: ${selectedUser?._id}`}
                images={selectedUser?.photo ? [selectedUser.photo] : []}
                loading={detailLoading}
                tags={[
                    {
                        label: selectedUser?.role || 'User',
                        className: selectedUser?.role === 'admin'
                            ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/10'
                            : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/10'
                    }
                ]}
                stats={[
                    { label: 'Mobile', value: selectedUser?.mobileNo || 'N/A', icon: FiInfo, color: 'text-slate-400' },
                    { label: 'Joined', value: selectedUser ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A', icon: FiActivity, color: 'text-slate-400' }
                ]}
            />
        </div>
    );
};

export default User;
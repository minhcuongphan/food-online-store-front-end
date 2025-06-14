'use client'
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import BasicTableOne from "@/components/tables/BasicTableOne";
import Badge from "@/components/ui/badge/Badge";
import { fetchUsers, editUsers, deleteUser, createUser } from "@/services/users-services";
import { convertUserStatus, convertRoleToString } from "@/ultils/helpers";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Pagination } from "@mui/material";

export default function BasicTables() {
  // State
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone_number: ""
  });
  // Add state for create user modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    phone_number: ""
  });
  const [deleteUserId, setDeleteUserId] = useState<number | string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Data fetching
  const { data, isLoading, error } = useQuery({
    queryKey: ['users', page, search],
    queryFn: () => fetchUsers({ page, pageSize }),
    keepPreviousData: true,
  });

  const users = data?.results ?? [];
  const total = data?.count ?? 0;
  const totalPages = Math.ceil(total / pageSize);

  // React Query mutation for editing users
  const queryClient = useQueryClient();
  const editUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string | number, data: any }) => editUsers(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditUser(null);
    },
    onError: (error: any) => {
      alert(error?.message || "Failed to update user");
    }
  });

  // Delete mutation
  const deleteUserMutation = useMutation({
    mutationFn: (userId: string | number) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setDeleteUserId(null);
    },
    onError: (error: any) => {
      alert(error?.message || "Failed to delete user");
    }
  });

  // Add create user mutation (implement createUser in your services)
  const createUserMutation = useMutation({
    mutationFn: (data: any) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setCreateModalOpen(false);
      setCreateForm({
        first_name: "",
        last_name: "",
        username: "",
        email: "",
        phone_number: ""
      });
    },
    onError: (error: any) => {
      alert(error?.message || "Failed to create user");
    }
  });

  const handleCreateFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateForm({ ...createForm, [e.target.name]: e.target.value });
  };

  const handleCreateSave = () => {
    createUserMutation.mutate(createForm);
  };


  if (error) throw new Error("Lỗi khi tải danh sách người dùng");

  // Filter users based on search input
  const filteredUsers = users.filter((user: any) =>
    user.first_name?.toLowerCase().includes(search.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.phone_number?.toLowerCase().includes(search.toLowerCase())
  );

  // Handlers
  const handleEditClick = (user: any) => {
    setEditUser(user);
    setEditForm({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      username: user.username || "",
      email: user.email || "",
      phone_number: user.phone_number || "",
    });
  };

  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = () => {
    if (!editUser) return;
    editUserMutation.mutate({ id: editUser.id, data: editForm });
  };

  // Table columns
  const columns = [
    { header: "ID", accessor: "id" },
    { header: "First name", accessor: "first_name" },
    { header: "Last name", accessor: "last_name" },
    { header: "Email", accessor: "email" },
    { header: "Phone Number", accessor: "phone_number" },
    { header: "Role", accessor: "role", render: (value: number) => convertRoleToString(value) },
    {
      header: "Status",
      accessor: "is_active",
      render: (value: boolean) => (
        <Badge color={value ? 'success' : 'error'} size="md">{convertUserStatus(value)}</Badge>
      )
    },
    {
      header: "Action",
      render: (_: any, row: any) => (
        <div className="flex gap-2">
          <button
            type="button"
            className="text-gray-400 hover:text-blue-600 transition-colors focus:outline-none border-none bg-transparent shadow-none"
            title="View"
            onClick={() => console.log('View user', row.id)}
          >
            <VisibilityIcon fontSize="small" />
          </button>
          <button
            type="button"
            className="text-gray-400 hover:text-yellow-600 transition-colors focus:outline-none border-none bg-transparent shadow-none"
            title="Edit"
            onClick={() => handleEditClick(row)}
          >
            <EditIcon fontSize="small" />
          </button>
          <button
            type="button"
            className="text-gray-400 hover:text-red-600 transition-colors focus:outline-none border-none bg-transparent shadow-none"
            title="Delete"
            onClick={() => setDeleteUserId(row.id)}
          >
            <DeleteIcon fontSize="small" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageBreadcrumb pageTitle="Users" />
      <div className="space-y-6 relative">
        {/* Search Input & Create Button */}
        <div className="flex justify-between mb-2">
          <form>
            <div className="relative">
              <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
              </span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                type="text"
                placeholder="Search users..."
                className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
              />
            </div>
          </form>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<AddIcon fontSize="small" />}
            onClick={() => setCreateModalOpen(true)}
            sx={{ minWidth: 0, px: 1, py: 0 }}
            className="ml-4"
          >
            Create User
          </Button>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-gray-900/70 z-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div>
            <BasicTableOne data={filteredUsers} columns={columns} />
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-end mt-4">
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            shape="rounded"
            size="small"
            showFirstButton
            showLastButton
          />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteUserId}
        onClose={() => setDeleteUserId(null)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          root: { style: { zIndex: 99999 } }
        }}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteUserId(null)} color="inherit">Cancel</Button>
          <Button
            onClick={() => deleteUserMutation.mutate(deleteUserId!)}
            color="error"
            variant="contained"
            disabled={deleteUserMutation.isLoading}
          >
            {deleteUserMutation.isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog
        open={!!editUser}
        onClose={() => setEditUser(null)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          root: { style: { zIndex: 99999 } }
        }}
      >
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} py={1}>
            <TextField
              label="First Name"
              name="first_name"
              value={editForm.first_name}
              onChange={handleEditFormChange}
              fullWidth
              size="small"
              margin="dense"
            />
            <TextField
              label="Last Name"
              name="last_name"
              value={editForm.last_name}
              onChange={handleEditFormChange}
              fullWidth
              size="small"
              margin="dense"
            />
            <TextField
              label="Username"
              name="username"
              value={editForm.username}
              onChange={handleEditFormChange}
              fullWidth
              size="small"
              margin="dense"
            />
            <TextField
              label="Email"
              name="email"
              value={editForm.email}
              onChange={handleEditFormChange}
              fullWidth
              size="small"
              margin="dense"
            />
            <TextField
              label="Phone Number"
              name="phone_number"
              value={editForm.phone_number}
              onChange={handleEditFormChange}
              fullWidth
              size="small"
              margin="dense"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUser(null)} color="inherit">Cancel</Button>
          <Button
            onClick={handleEditSave}
            variant="contained"
            color="primary"
            disabled={editUserMutation.isLoading}
          >
            {editUserMutation.isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create User Modal */}
      <Dialog
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          maxWidth="xs"
          fullWidth
          slotProps={{
            root: { style: { zIndex: 99999 } }
          }}
        >
          <DialogTitle>Create User</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} py={1}>
              <TextField
                label="First Name"
                name="first_name"
                value={createForm.first_name}
                onChange={handleCreateFormChange}
                fullWidth
                size="small"
                margin="dense"
              />
              <TextField
                label="Last Name"
                name="last_name"
                value={createForm.last_name}
                onChange={handleCreateFormChange}
                fullWidth
                size="small"
                margin="dense"
              />
              <TextField
                label="Username"
                name="username"
                value={createForm.username}
                onChange={handleCreateFormChange}
                fullWidth
                size="small"
                margin="dense"
              />
              <TextField
                label="Email"
                name="email"
                value={createForm.email}
                onChange={handleCreateFormChange}
                fullWidth
                size="small"
                margin="dense"
              />
              <TextField
                label="Phone Number"
                name="phone_number"
                value={createForm.phone_number}
                onChange={handleCreateFormChange}
                fullWidth
                size="small"
                margin="dense"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCreateModalOpen(false)} color="inherit">Cancel</Button>
            <Button
              onClick={handleCreateSave}
              variant="contained"
              color="primary"
              disabled={createUserMutation.isLoading}
            >
              {createUserMutation.isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
  );
}

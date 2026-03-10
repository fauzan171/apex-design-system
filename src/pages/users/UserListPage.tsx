import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  UserCheck,
  UserX,
  Edit,
  Key,
  Users,
  Building2,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { userService, roleService } from "@/services/userService";
import type { User, Role, UserStatus, Department } from "@/types/user";
import {
  UserStatus as UserStatusEnum,
  Department as DepartmentEnum,
  departmentLabels,
  departmentColors,
  userStatusColors,
} from "@/types/user";
import { cn } from "@/lib/utils";

export function UserListPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [_roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Dialog states
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showReactivateDialog, setShowReactivateDialog] = useState(false);
  const [showResetPasswordDialog, setShowResetPasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [statusFilter, deptFilter]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [userData, roleData] = await Promise.all([
        userService.getUsers({
          status: statusFilter as UserStatus | "all",
          department: deptFilter as Department | "all",
          search: search || undefined,
        }),
        roleService.getRoles(),
      ]);
      setUsers(userData);
      setRoles(roleData);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    loadData();
  };

  const handleDeactivate = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await userService.deactivateUser(selectedUser.id);
      setShowDeactivateDialog(false);
      setSelectedUser(null);
      loadData();
    } catch (error) {
      console.error("Failed to deactivate user:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReactivate = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    try {
      await userService.reactivateUser(selectedUser.id);
      setShowReactivateDialog(false);
      setSelectedUser(null);
      loadData();
    } catch (error) {
      console.error("Failed to reactivate user:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser || !newPassword) return;
    setActionLoading(true);
    try {
      await userService.resetPassword(selectedUser.id, { newPassword });
      setShowResetPasswordDialog(false);
      setSelectedUser(null);
      setNewPassword("");
      loadData();
    } catch (error) {
      console.error("Failed to reset password:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Stats
  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === UserStatusEnum.ACTIVE).length,
    inactive: users.filter((u) => u.status === UserStatusEnum.INACTIVE).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-sm text-slate-500">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        <Button onClick={() => navigate("/users/create")} className="gap-2">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-slate-500">Total Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.active}
                </div>
                <div className="text-sm text-slate-500">Active</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <UserX className="h-5 w-5 text-slate-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-600">
                  {stats.inactive}
                </div>
                <div className="text-sm text-slate-500">Inactive</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch}>Search</Button>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {showFilters ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value={UserStatusEnum.ACTIVE}>Active</SelectItem>
                    <SelectItem value={UserStatusEnum.INACTIVE}>Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={deptFilter} onValueChange={setDeptFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {Object.entries(DepartmentEnum).map(([_key, value]) => (
                      <SelectItem key={value} value={value}>
                        {departmentLabels[value]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <Users className="h-12 w-12 text-slate-300 mb-4" />
              <p className="font-medium">No users found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-slate-600">
                            {user.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {user.fullName}
                          </p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          departmentColors[user.department],
                          "border-0"
                        )}
                      >
                        <Building2 className="h-3 w-3 mr-1" />
                        {departmentLabels[user.department]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(user.roles ?? []).map((role) => (
                          <Badge key={role.id} variant="secondary" className="text-xs">
                            {role.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          userStatusColors[user.status].bg,
                          userStatusColors[user.status].text,
                          userStatusColors[user.status].border
                        )}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => navigate(`/users/${user.id}/edit`)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user);
                              setShowResetPasswordDialog(true);
                            }}
                          >
                            <Key className="h-4 w-4 mr-2" />
                            Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status === UserStatusEnum.ACTIVE ? (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setShowDeactivateDialog(true);
                              }}
                              className="text-red-600"
                            >
                              <UserX className="h-4 w-4 mr-2" />
                              Deactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedUser(user);
                                setShowReactivateDialog(true);
                              }}
                              className="text-green-600"
                            >
                              <UserCheck className="h-4 w-4 mr-2" />
                              Reactivate
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Deactivate Dialog */}
      <Dialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate User</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate {selectedUser?.fullName}? This
              user will no longer be able to access the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeactivateDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeactivate}
              disabled={actionLoading}
            >
              {actionLoading && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reactivate Dialog */}
      <Dialog open={showReactivateDialog} onOpenChange={setShowReactivateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reactivate User</DialogTitle>
            <DialogDescription>
              Are you sure you want to reactivate {selectedUser?.fullName}? This
              user will regain access to the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReactivateDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReactivate}
              disabled={actionLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {actionLoading && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Reactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog
        open={showResetPasswordDialog}
        onOpenChange={setShowResetPasswordDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter a new password for {selectedUser?.fullName}. The user will be
              required to change this password on their next login.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <p className="text-xs text-slate-500">
                Password must be at least 8 characters
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowResetPasswordDialog(false);
                setNewPassword("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleResetPassword}
              disabled={actionLoading || newPassword.length < 8}
            >
              {actionLoading && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

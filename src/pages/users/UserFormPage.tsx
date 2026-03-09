import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  User as UserIcon,
  Mail,
  Building2,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { userService, roleService } from "@/services/userService";
import type {
  Role,
  Department,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/types/user";
import {
  Department as DepartmentEnum,
  departmentLabels,
} from "@/types/user";

export function UserFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    department: "" as Department | "",
    roleIds: [] as string[],
  });

  useEffect(() => {
    loadRoles();
    if (isEdit && id) {
      loadUser();
    }
  }, [id]);

  const loadRoles = async () => {
    try {
      const data = await roleService.getRoles();
      setRoles(data);
    } catch (error) {
      console.error("Failed to load roles:", error);
    }
  };

  const loadUser = async () => {
    if (!id) return;
    try {
      const user = await userService.getUserById(id);
      if (user) {
        setFormData({
          email: user.email,
          fullName: user.fullName,
          department: user.department,
          roleIds: user.roles.map((r) => r.id),
        });
      } else {
        navigate("/users");
      }
    } catch (error) {
      console.error("Failed to load user:", error);
      navigate("/users");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.department) {
      setError("Department is required");
      return false;
    }
    if (formData.roleIds.length === 0) {
      setError("At least one role must be assigned");
      return false;
    }
    if (!isEdit && !formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!isEdit && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Invalid email format");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setError("");

    try {
      if (isEdit) {
        const updateData: UpdateUserRequest = {
          fullName: formData.fullName,
          department: formData.department as Department,
          roleIds: formData.roleIds,
        };
        await userService.updateUser(id!, updateData);
      } else {
        const createData: CreateUserRequest = {
          email: formData.email,
          fullName: formData.fullName,
          department: formData.department as Department,
          roleIds: formData.roleIds,
        };
        await userService.createUser(createData);
      }
      navigate("/users");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save user");
    } finally {
      setSaving(false);
    }
  };

  const toggleRole = (roleId: string) => {
    setFormData((prev) => ({
      ...prev,
      roleIds: prev.roleIds.includes(roleId)
        ? prev.roleIds.filter((id) => id !== roleId)
        : [...prev.roleIds, roleId],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/users")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEdit ? "Edit User" : "Create User"}
          </h1>
          <p className="text-sm text-slate-500">
            {isEdit
              ? "Update user information and roles"
              : "Add a new user to the system"}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email Address {!isEdit && <span className="text-red-500">*</span>}
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={isEdit}
                className="pl-10"
              />
            </div>
            {isEdit && (
              <p className="text-xs text-slate-500">Email cannot be changed</p>
            )}
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                id="fullName"
                placeholder="Enter full name"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="pl-10"
              />
            </div>
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label htmlFor="department">
              Department <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
              <Select
                value={formData.department}
                onValueChange={(value) =>
                  setFormData({ ...formData, department: value as Department })
                }
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(DepartmentEnum).map(([_key, value]) => (
                    <SelectItem key={value} value={value}>
                      {departmentLabels[value]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roles */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-slate-500" />
            <CardTitle>Roles & Permissions</CardTitle>
          </div>
          <p className="text-sm text-slate-500">
            Select one or more roles for this user. Permissions from multiple
            roles will be merged.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {roles.map((role) => (
              <div
                key={role.id}
                className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => toggleRole(role.id)}
              >
                <Checkbox
                  checked={formData.roleIds.includes(role.id)}
                  onCheckedChange={() => toggleRole(role.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{role.name}</p>
                  <p className="text-sm text-slate-500">{role.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {role.permissions.slice(0, 3).map((perm) => (
                      <span
                        key={perm.id}
                        className="text-xs px-2 py-0.5 bg-slate-100 rounded-full text-slate-600"
                      >
                        {perm.module}:{perm.action}
                      </span>
                    ))}
                    {role.permissions.length > 3 && (
                      <span className="text-xs px-2 py-0.5 bg-slate-100 rounded-full text-slate-500">
                        +{role.permissions.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => navigate("/users")}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={saving} className="gap-2">
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {isEdit ? "Save Changes" : "Create User"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

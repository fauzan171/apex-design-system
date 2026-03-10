import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Shield,
  Users,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { roleService } from "@/services/userService";
import type { Role } from "@/types/user";

export function RolesListPage() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadRoles();
  }, [search]);

  const loadRoles = async () => {
    setLoading(true);
    try {
      const data = await roleService.getRoles({ search });
      setRoles(data);
    } catch (error) {
      console.error("Failed to load roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(search.toLowerCase()) ||
      role.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Role Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola role dan permission untuk user
          </p>
        </div>
        <Button onClick={() => navigate("/roles/create")} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Role
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Roles</p>
                <p className="text-xl font-semibold text-slate-900">
                  {roles.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Active Users</p>
                <p className="text-xl font-semibold text-slate-900">-</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Shield className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Permissions</p>
                <p className="text-xl font-semibold text-slate-900">
                  {roles.reduce((acc, r) => acc + (r.permissions?.length || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search roles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : filteredRoles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500">
              <Shield className="h-12 w-12 text-slate-300 mb-4" />
              <p className="font-medium">No roles found</p>
              <p className="text-sm">Create your first role to get started</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.map((role) => (
                  <TableRow
                    key={role.id}
                    className="cursor-pointer hover:bg-slate-50"
                    onClick={() => navigate(`/roles/${role.id}`)}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-slate-400" />
                        {role.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {role.description || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {role.permissions?.length || 0} permissions
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {new Date(role.createdAt).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="gap-1">
                        View Details
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
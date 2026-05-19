import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Plus, 
  LogOut, 
  Search,
  ToggleLeft,
  ToggleRight,
  Pencil,
  Trash2,
  BarChart3
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Member {
  id: string;
  member_id: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  manager_id: string | null;
}

interface SalesSummary {
  profile_id: string;
  total_sales: number;
  total_amount: number;
}

export default function AdminPanel() {
  const { user, isAdmin, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [members, setMembers] = useState<Member[]>([]);
  const [salesSummary, setSalesSummary] = useState<Record<string, SalesSummary>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Add/Edit member dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [formData, setFormData] = useState({
    member_id: "",
    full_name: "",
    email: "",
    phone: "",
    manager_id: "none" as string,
  });
  const [saving, setSaving] = useState(false);

  // Delete confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate("/admin-login");
      } else if (!isAdmin) {
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
        navigate("/");
      } else {
        fetchMembers();
      }
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fetchMembers = async () => {
    setLoading(true);
    
    // Fetch all profiles
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profilesError) {
      console.error("Error fetching members:", profilesError);
      toast({
        title: "Error",
        description: "Failed to load members.",
        variant: "destructive",
      });
    } else {
      setMembers(profilesData || []);
    }

    // Fetch sales summary
    const { data: salesData, error: salesError } = await supabase
      .from("sales")
      .select("profile_id, sale_amount");

    if (!salesError && salesData) {
      const summary: Record<string, SalesSummary> = {};
      salesData.forEach((sale) => {
        if (sale.profile_id) {
          if (!summary[sale.profile_id]) {
            summary[sale.profile_id] = {
              profile_id: sale.profile_id,
              total_sales: 0,
              total_amount: 0,
            };
          }
          summary[sale.profile_id].total_sales++;
          summary[sale.profile_id].total_amount += Number(sale.sale_amount) || 0;
        }
      });
      setSalesSummary(summary);
    }

    setLoading(false);
  };

  const handleOpenDialog = (member?: Member) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        member_id: member.member_id || "",
        full_name: member.full_name || "",
        email: member.email || "",
        phone: member.phone || "",
        manager_id: member.manager_id || "none",
      });
    } else {
      setEditingMember(null);
      setFormData({
        member_id: "",
        full_name: "",
        email: "",
        phone: "",
        manager_id: "none",
      });
    }
    setDialogOpen(true);
  };

  const handleSaveMember = async () => {
    if (!formData.member_id.trim()) {
      toast({
        title: "Error",
        description: "Member ID is required.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    if (editingMember) {
      // Update existing member
      const { error } = await supabase
        .from("profiles")
        .update({
          member_id: formData.member_id.toUpperCase().trim(),
          full_name: formData.full_name.trim() || null,
          email: formData.email.trim() || null,
          phone: formData.phone.trim() || null,
          manager_id: formData.manager_id === "none" ? null : formData.manager_id,
        })
        .eq("id", editingMember.id);

      if (error) {
        toast({
          title: "Error",
          description: error.message.includes("duplicate") 
            ? "This Member ID already exists." 
            : "Failed to update member.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Member updated successfully.",
        });
        setDialogOpen(false);
        fetchMembers();
      }
    } else {
      // Create new member (insert into profiles without user_id)
      const { error } = await supabase
        .from("profiles")
        .insert({
          member_id: formData.member_id.toUpperCase().trim(),
          full_name: formData.full_name.trim() || null,
          email: formData.email.trim() || null,
          phone: formData.phone.trim() || null,
          manager_id: formData.manager_id === "none" ? null : formData.manager_id,
          user_id: crypto.randomUUID(), // Generate a placeholder UUID
          is_active: true,
        });

      if (error) {
        toast({
          title: "Error",
          description: error.message.includes("duplicate") 
            ? "This Member ID already exists." 
            : "Failed to create member.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Member created successfully.",
        });
        setDialogOpen(false);
        fetchMembers();
      }
    }

    setSaving(false);
  };

  const handleToggleActive = async (member: Member) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_active: !member.is_active })
      .eq("id", member.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update member status.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Member ${member.is_active ? "deactivated" : "activated"} successfully.`,
      });
      fetchMembers();
    }
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", memberToDelete.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete member.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Member deleted successfully.",
      });
      fetchMembers();
    }

    setDeleteDialogOpen(false);
    setMemberToDelete(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin-login");
  };

  const filteredMembers = members.filter((member) => {
    const search = searchTerm.toLowerCase();
    return (
      (member.member_id?.toLowerCase().includes(search)) ||
      (member.full_name?.toLowerCase().includes(search)) ||
      (member.email?.toLowerCase().includes(search))
    );
  });

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-sm text-muted-foreground">Manage your sales team</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/scripts")}>
              <Pencil className="h-4 w-4 mr-2" />
              Scripts
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/sales-phases")}>
              <Pencil className="h-4 w-4 mr-2" />
              Sales Phases
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/banners")}>
              <Pencil className="h-4 w-4 mr-2" />
              Banners
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/payouts")}>
              <Pencil className="h-4 w-4 mr-2" />
              Payouts
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/admin/setup-invites")}>
              <Plus className="h-4 w-4 mr-2" />
              Setup Invites
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Members</p>
                  <p className="text-2xl font-bold">{members.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
                  <ToggleRight className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Members</p>
                  <p className="text-2xl font-bold">
                    {members.filter((m) => m.is_active).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                  <p className="text-2xl font-bold">
                    {Object.values(salesSummary).reduce((sum, s) => sum + s.total_sales, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Members Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage your sales team members</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-[200px]"
                  />
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => handleOpenDialog()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingMember ? "Edit Member" : "Add New Member"}
                      </DialogTitle>
                      <DialogDescription>
                        {editingMember 
                          ? "Update member information." 
                          : "Create a new team member with a unique Member ID."}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="member_id">Member ID *</Label>
                        <Input
                          id="member_id"
                          placeholder="e.g., SP001"
                          value={formData.member_id}
                          onChange={(e) =>
                            setFormData({ ...formData, member_id: e.target.value.toUpperCase() })
                          }
                          className="uppercase"
                          disabled={!!editingMember}
                        />
                        {editingMember && (
                          <p className="text-xs text-muted-foreground">
                            Member ID cannot be changed
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input
                          id="full_name"
                          placeholder="John Doe"
                          value={formData.full_name}
                          onChange={(e) =>
                            setFormData({ ...formData, full_name: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          placeholder="(555) 123-4567"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveMember} disabled={saving}>
                        {saving ? "Saving..." : editingMember ? "Update" : "Create"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredMembers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchTerm ? "No members found matching your search." : "No members yet. Add your first team member."}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Sales</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-mono font-bold">
                        {member.member_id || "—"}
                      </TableCell>
                      <TableCell>{member.full_name || "—"}</TableCell>
                      <TableCell>{member.email || "—"}</TableCell>
                      <TableCell>
                        {salesSummary[member.id]?.total_sales || 0} sales
                        {salesSummary[member.id]?.total_amount > 0 && (
                          <span className="text-muted-foreground ml-1">
                            (${salesSummary[member.id].total_amount.toLocaleString()})
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            member.is_active
                              ? "bg-green-500/10 text-green-600"
                              : "bg-red-500/10 text-red-600"
                          }`}
                        >
                          {member.is_active ? (
                            <>
                              <ToggleRight className="h-3 w-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="h-3 w-3" />
                              Inactive
                            </>
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleActive(member)}
                            title={member.is_active ? "Deactivate" : "Activate"}
                          >
                            {member.is_active ? (
                              <ToggleLeft className="h-4 w-4" />
                            ) : (
                              <ToggleRight className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(member)}
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setMemberToDelete(member);
                              setDeleteDialogOpen(true);
                            }}
                            title="Delete"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {memberToDelete?.full_name || memberToDelete?.member_id}? 
              This action cannot be undone and will also delete all their sales records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMember}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

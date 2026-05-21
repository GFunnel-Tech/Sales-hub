import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  FileText, Plus, Trash2, Pencil, Download, Users, ArrowLeft, Upload,
} from "lucide-react";
import { DOCUMENT_CATEGORIES, getCategoryLabel } from "@/lib/documentCategories";

interface Document {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_path: string;
  file_name: string;
  file_size: number | null;
  mime_type: string | null;
  requires_signature: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
}

interface SignatureRow {
  id: string;
  document_id: string;
  profile_id: string;
  signature_name: string;
  signed_at: string;
  profiles?: { full_name: string | null; member_id: string | null } | null;
}

export default function DocumentsAdmin() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Document | null>(null);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "agreements",
    requires_signature: false,
    sort_order: 0,
  });

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Document | null>(null);

  const [sigDialogOpen, setSigDialogOpen] = useState(false);
  const [sigDoc, setSigDoc] = useState<Document | null>(null);
  const [sigs, setSigs] = useState<SignatureRow[]>([]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) navigate("/admin-login");
      else if (!isAdmin) navigate("/");
      else fetchDocs();
    }
  }, [user, isAdmin, authLoading, navigate]);

  const fetchDocs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("documents")
      .select("*")
      .order("category")
      .order("sort_order");
    setDocs(data || []);
    setLoading(false);
  };

  const openDialog = (doc?: Document) => {
    if (doc) {
      setEditing(doc);
      setForm({
        title: doc.title,
        description: doc.description || "",
        category: doc.category,
        requires_signature: doc.requires_signature,
        sort_order: doc.sort_order,
      });
    } else {
      setEditing(null);
      setForm({
        title: "", description: "", category: "agreements",
        requires_signature: false, sort_order: 0,
      });
    }
    setFile(null);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast({ title: "Error", description: "Title is required.", variant: "destructive" });
      return;
    }
    if (!editing && !file) {
      toast({ title: "Error", description: "Please select a file.", variant: "destructive" });
      return;
    }
    setSaving(true);

    let file_path = editing?.file_path || "";
    let file_name = editing?.file_name || "";
    let file_size = editing?.file_size || null;
    let mime_type = editing?.mime_type || null;

    if (file) {
      const ext = file.name.split(".").pop();
      const path = `${form.category}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("documents")
        .upload(path, file, { contentType: file.type });
      if (upErr) {
        toast({ title: "Upload failed", description: upErr.message, variant: "destructive" });
        setSaving(false);
        return;
      }
      // Optionally remove old file if replacing
      if (editing?.file_path) {
        await supabase.storage.from("documents").remove([editing.file_path]);
      }
      file_path = path;
      file_name = file.name;
      file_size = file.size;
      mime_type = file.type;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      category: form.category,
      requires_signature: form.requires_signature,
      sort_order: form.sort_order,
      file_path, file_name, file_size, mime_type,
      created_by: user?.id,
    };

    const { error } = editing
      ? await supabase.from("documents").update(payload).eq("id", editing.id)
      : await supabase.from("documents").insert(payload);

    setSaving(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: `Document ${editing ? "updated" : "created"}.` });
      setDialogOpen(false);
      fetchDocs();
    }
  };

  const handleToggleActive = async (doc: Document) => {
    await supabase.from("documents").update({ is_active: !doc.is_active }).eq("id", doc.id);
    fetchDocs();
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    if (toDelete.file_path) {
      await supabase.storage.from("documents").remove([toDelete.file_path]);
    }
    await supabase.from("documents").delete().eq("id", toDelete.id);
    setDeleteOpen(false);
    setToDelete(null);
    fetchDocs();
    toast({ title: "Deleted" });
  };

  const handleDownload = async (doc: Document) => {
    const { data } = await supabase.storage.from("documents").createSignedUrl(doc.file_path, 60);
    if (data) window.open(data.signedUrl, "_blank");
  };

  const openSignatures = async (doc: Document) => {
    setSigDoc(doc);
    const { data } = await supabase
      .from("document_signatures")
      .select("*, profiles:profile_id(full_name, member_id)")
      .eq("document_id", doc.id)
      .order("signed_at", { ascending: false });
    setSigs((data as any) || []);
    setSigDialogOpen(true);
  };

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Document Library</h1>
              <p className="text-sm text-muted-foreground">Manage agreements, training, and handbooks</p>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => openDialog()}>
                <Plus className="h-4 w-4 mr-2" />Add Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editing ? "Edit Document" : "Upload Document"}</DialogTitle>
                <DialogDescription>
                  Upload PDFs or other files for your team to view and sign.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label>Title *</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {DOCUMENT_CATEGORIES.map((c) => (
                          <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Sort Order</Label>
                    <Input
                      type="number"
                      value={form.sort_order}
                      onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>File {editing && "(leave empty to keep current)"}</Label>
                  <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  {editing && !file && (
                    <p className="text-xs text-muted-foreground">Current: {editing.file_name}</p>
                  )}
                </div>
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <Label>Require signature</Label>
                    <p className="text-xs text-muted-foreground">
                      Members must sign this document to acknowledge it.
                    </p>
                  </div>
                  <Switch
                    checked={form.requires_signature}
                    onCheckedChange={(v) => setForm({ ...form, requires_signature: v })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>
                  <Upload className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : editing ? "Update" : "Upload"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>All Documents</CardTitle>
            <CardDescription>{docs.length} document{docs.length !== 1 ? "s" : ""}</CardDescription>
          </CardHeader>
          <CardContent>
            {docs.length === 0 ? (
              <p className="text-center py-12 text-muted-foreground">
                No documents yet. Click "Add Document" to upload one.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Signature</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {docs.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell>
                        <div className="font-medium">{doc.title}</div>
                        <div className="text-xs text-muted-foreground">{doc.file_name}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{getCategoryLabel(doc.category)}</Badge>
                      </TableCell>
                      <TableCell>
                        {doc.requires_signature ? (
                          <Badge>Required</Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Switch checked={doc.is_active} onCheckedChange={() => handleToggleActive(doc)} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1 justify-end">
                          {doc.requires_signature && (
                            <Button variant="ghost" size="icon" onClick={() => openSignatures(doc)} title="View signatures">
                              <Users className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => handleDownload(doc)} title="Download">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openDialog(doc)} title="Edit">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost" size="icon"
                            onClick={() => { setToDelete(doc); setDeleteOpen(true); }}
                            className="text-destructive"
                            title="Delete"
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

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete document?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{toDelete?.title}" and all its signature records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={sigDialogOpen} onOpenChange={setSigDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Signatures: {sigDoc?.title}</DialogTitle>
            <DialogDescription>
              {sigs.length} member{sigs.length !== 1 ? "s have" : " has"} signed this document.
            </DialogDescription>
          </DialogHeader>
          {sigs.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No signatures yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Signed As</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sigs.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="font-medium">{s.profiles?.full_name || "—"}</div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {s.profiles?.member_id || "—"}
                      </div>
                    </TableCell>
                    <TableCell>{s.signature_name}</TableCell>
                    <TableCell>{new Date(s.signed_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

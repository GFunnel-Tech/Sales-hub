import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useMember } from "@/hooks/useMember";
import { SalesHubNavigation } from "@/components/SalesHubNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileText, Download, PenLine, CheckCircle2, Search } from "lucide-react";
import { DOCUMENT_CATEGORIES, getCategoryLabel } from "@/lib/documentCategories";

interface Document {
  id: string;
  title: string;
  description: string | null;
  category: string;
  file_path: string;
  file_name: string;
  mime_type: string | null;
  requires_signature: boolean;
  sort_order: number;
  created_at: string;
}

interface Signature {
  document_id: string;
  signed_at: string;
  signature_name: string;
}

export default function Documents() {
  const { member, loading: memberLoading } = useMember();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [signatures, setSignatures] = useState<Record<string, Signature>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const [signOpen, setSignOpen] = useState(false);
  const [signDoc, setSignDoc] = useState<Document | null>(null);
  const [signName, setSignName] = useState("");
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    if (!memberLoading && !member) navigate("/member-entry");
  }, [member, memberLoading, navigate]);

  useEffect(() => {
    if (member) fetchAll();
  }, [member]);

  const fetchAll = async () => {
    setLoading(true);
    const { data: docs } = await supabase
      .from("documents")
      .select("*")
      .eq("is_active", true)
      .order("category")
      .order("sort_order");
    setDocuments(docs || []);

    if (member) {
      const { data: sigs } = await supabase
        .from("document_signatures")
        .select("document_id, signed_at, signature_name")
        .eq("profile_id", member.id);
      const map: Record<string, Signature> = {};
      (sigs || []).forEach((s) => (map[s.document_id] = s as Signature));
      setSignatures(map);
    }
    setLoading(false);
  };

  const handleDownload = async (doc: Document) => {
    const { data, error } = await supabase.storage
      .from("documents")
      .createSignedUrl(doc.file_path, 60);
    if (error || !data) {
      toast({ title: "Error", description: "Could not download file.", variant: "destructive" });
      return;
    }
    window.open(data.signedUrl, "_blank");
  };

  const openSign = (doc: Document) => {
    setSignDoc(doc);
    setSignName(member?.full_name || "");
    setSignOpen(true);
  };

  const handleSign = async () => {
    if (!signDoc || !member || !signName.trim()) return;
    setSigning(true);
    const { error } = await supabase.from("document_signatures").insert({
      document_id: signDoc.id,
      profile_id: member.id,
      signature_name: signName.trim(),
      user_agent: navigator.userAgent,
    });
    setSigning(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Signed", description: `You have acknowledged "${signDoc.title}".` });
      setSignOpen(false);
      fetchAll();
    }
  };

  const filtered = documents.filter((d) => {
    const matchCat = activeCategory === "all" || d.category === activeCategory;
    const q = search.toLowerCase();
    const matchSearch = !q || d.title.toLowerCase().includes(q) || d.description?.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  if (memberLoading || !member) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const pendingCount = documents.filter((d) => d.requires_signature && !signatures[d.id]).length;

  return (
    <div className="min-h-screen bg-background">
      <SalesHubNavigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FileText className="h-7 w-7 text-primary" /> Document Library
            </h1>
            <p className="text-muted-foreground mt-1">
              Agreements, training materials, handbooks, and policies.
            </p>
          </div>
          {pendingCount > 0 && (
            <Badge variant="destructive" className="text-sm py-1.5 px-3">
              {pendingCount} pending signature{pendingCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>

        <div className="relative mb-4 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            {DOCUMENT_CATEGORIES.map((c) => (
              <TabsTrigger key={c.value} value={c.value}>{c.label}</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-6">
            {loading ? (
              <p className="text-muted-foreground">Loading documents...</p>
            ) : filtered.length === 0 ? (
              <Card><CardContent className="py-12 text-center text-muted-foreground">
                No documents found.
              </CardContent></Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((doc) => {
                  const signed = signatures[doc.id];
                  return (
                    <Card key={doc.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{doc.title}</CardTitle>
                            <CardDescription className="mt-1">
                              <Badge variant="secondary" className="mr-2">
                                {getCategoryLabel(doc.category)}
                              </Badge>
                              {doc.requires_signature && (
                                signed ? (
                                  <Badge variant="default" className="bg-green-600">
                                    <CheckCircle2 className="h-3 w-3 mr-1" />Signed
                                  </Badge>
                                ) : (
                                  <Badge variant="destructive">Signature Required</Badge>
                                )
                              )}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {doc.description && (
                          <p className="text-sm text-muted-foreground mb-3">{doc.description}</p>
                        )}
                        {signed && (
                          <p className="text-xs text-muted-foreground mb-3">
                            Signed as <strong>{signed.signature_name}</strong> on{" "}
                            {new Date(signed.signed_at).toLocaleDateString()}
                          </p>
                        )}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleDownload(doc)}>
                            <Download className="h-4 w-4 mr-2" />View / Download
                          </Button>
                          {doc.requires_signature && !signed && (
                            <Button size="sm" onClick={() => openSign(doc)}>
                              <PenLine className="h-4 w-4 mr-2" />Sign
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={signOpen} onOpenChange={setSignOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign: {signDoc?.title}</DialogTitle>
            <DialogDescription>
              By typing your full name and clicking Sign, you acknowledge that you have read and
              agree to this document. Please review the document before signing.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <Button variant="outline" onClick={() => signDoc && handleDownload(signDoc)} className="w-full">
              <Download className="h-4 w-4 mr-2" />Open document to review
            </Button>
            <div className="space-y-2">
              <Label htmlFor="sig-name">Type your full name to sign</Label>
              <Input
                id="sig-name"
                value={signName}
                onChange={(e) => setSignName(e.target.value)}
                placeholder="Your full name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSignOpen(false)}>Cancel</Button>
            <Button onClick={handleSign} disabled={signing || !signName.trim()}>
              {signing ? "Signing..." : "Sign Document"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SalesNavigation } from "@/components/SalesNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMember } from "@/hooks/useMember";
import { memberApi } from "@/lib/memberApi";
import { 
  Search, 
  PlusCircle, 
  Filter,
  Calendar,
  DollarSign,
  Phone,
  User
} from "lucide-react";

interface Sale {
  id: string;
  customer_first_name: string;
  customer_last_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  product_service: string;
  sale_amount: number | null;
  disposition: string;
  call_type: string | null;
  created_at: string;
  follow_up_date: string | null;
}

const dispositionLabels: Record<string, string> = {
  sold: "Sold",
  no_sale: "No Sale",
  callback: "Callback",
  no_answer: "No Answer",
  not_interested: "Not Interested",
  needs_followup: "Needs Follow-up",
  sent_info: "Sent Info",
  scheduled_demo: "Scheduled Demo",
  left_voicemail: "Left Voicemail"
};

const dispositionColors: Record<string, string> = {
  sold: "bg-green-100 text-green-800",
  no_sale: "bg-red-100 text-red-800",
  callback: "bg-blue-100 text-blue-800",
  no_answer: "bg-gray-100 text-gray-800",
  not_interested: "bg-orange-100 text-orange-800",
  needs_followup: "bg-yellow-100 text-yellow-800",
  sent_info: "bg-purple-100 text-purple-800",
  scheduled_demo: "bg-indigo-100 text-indigo-800",
  left_voicemail: "bg-gray-100 text-gray-800"
};

export default function MySales() {
  const { member } = useMember();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dispositionFilter, setDispositionFilter] = useState<string>("all");

  useEffect(() => {
    if (member) {
      fetchSales();
    }
  }, [member]);

  const fetchSales = async () => {
    if (!member) return;
    try {
      const { sales } = await memberApi.listSales();
      setSales(sales || []);
    } catch (error) {
      console.error("Error fetching sales:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSales = sales.filter((sale) => {
    const matchesSearch = 
      sale.customer_first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sale.customer_last_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      sale.product_service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sale.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesDisposition = dispositionFilter === "all" || sale.disposition === dispositionFilter;

    return matchesSearch && matchesDisposition;
  });

  const totalSales = sales.filter(s => s.disposition === "sold").length;
  const totalRevenue = sales
    .filter(s => s.disposition === "sold" && s.sale_amount)
    .reduce((sum, s) => sum + (s.sale_amount || 0), 0);

  return (
    <div className="min-h-screen bg-[#f3f4f6]">
      <SalesNavigation />
      
      <main className="container mx-auto px-6 md:px-12 lg:px-16 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">My Sales</h1>
            <p className="text-muted-foreground">View and manage all your sales activities</p>
          </div>
          <Button asChild>
            <Link to="/log-sale">
              <PlusCircle className="w-4 h-4 mr-2" />
              Log New Sale
            </Link>
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Entries</p>
              <p className="text-2xl font-bold">{sales.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Closed Sales</p>
              <p className="text-2xl font-bold text-green-600">{totalSales}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold">
                {sales.length > 0 ? Math.round((totalSales / sales.length) * 100) : 0}%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, product, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="w-full md:w-48">
                <Select value={dispositionFilter} onValueChange={setDispositionFilter}>
                  <SelectTrigger>
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dispositions</SelectItem>
                    {Object.entries(dispositionLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sales List */}
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">Loading sales...</p>
            </CardContent>
          </Card>
        ) : filteredSales.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground mb-4">
                {sales.length === 0 
                  ? "No sales logged yet. Start by logging your first sale!"
                  : "No sales match your filters."}
              </p>
              {sales.length === 0 && (
                <Button asChild>
                  <Link to="/log-sale">Log Your First Sale</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredSales.map((sale) => (
              <Card key={sale.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          {sale.customer_first_name} {sale.customer_last_name}
                        </h3>
                        <Badge className={dispositionColors[sale.disposition]}>
                          {dispositionLabels[sale.disposition]}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          {sale.product_service}
                          {sale.sale_amount && ` - $${sale.sale_amount.toLocaleString()}`}
                        </span>
                        {sale.call_type && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {sale.call_type}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(sale.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {sale.customer_email && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {sale.customer_email}
                        </p>
                      )}
                    </div>
                    {sale.follow_up_date && new Date(sale.follow_up_date) > new Date() && (
                      <Badge variant="outline" className="shrink-0">
                        Follow-up: {new Date(sale.follow_up_date).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

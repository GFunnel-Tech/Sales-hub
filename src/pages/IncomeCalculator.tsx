import { useState, useMemo } from "react";
import { PartnerNavigation } from "@/components/PartnerNavigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Calculator, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Info, 
  Zap, 
  Crown,
  ExternalLink,
  Sparkles
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { 
  membershipTiers, 
  getTierById, 
  MembershipTier, 
  ACTION_HUB_URL,
  softwareProducts,
  serviceProducts,
  supportProducts
} from "@/lib/commissionConfig";

export default function IncomeCalculator() {
  // Membership tier selection
  const [selectedTier, setSelectedTier] = useState<MembershipTier>('office');
  const [hasElite, setHasElite] = useState(false);
  
  // Software referrals
  const [officeReferrals, setOfficeReferrals] = useState(5);
  const [businessReferrals, setBusinessReferrals] = useState(3);
  
  // DFY Services
  const [starterClients, setStarterClients] = useState(1);
  const [proClients, setProClients] = useState(2);
  const [scaleClients, setScaleClients] = useState(0);
  const [unlimitedClients, setUnlimitedClients] = useState(0);
  const [serviceCommission, setServiceCommission] = useState(20);
  
  // Support Plans
  const [proSupport, setProSupport] = useState(0);
  const [platinumSupport, setPlatinumSupport] = useState(1);
  const [premiumSupport, setPremiumSupport] = useState(0);
  const [supportCommission, setSupportCommission] = useState(20);
  
  // Modules/Add-ons
  const [moduleSales, setModuleSales] = useState(2);
  const [avgModuleValue, setAvgModuleValue] = useState(497);
  const [moduleCommission, setModuleCommission] = useState(70);
  
  // Team building
  const [directPartners, setDirectPartners] = useState(3);
  const [avgPartnerSales, setAvgPartnerSales] = useState(2000);
  const [thirdGenPartners, setThirdGenPartners] = useState(10);
  const [avgThirdGenSales, setAvgThirdGenSales] = useState(1500);

  const currentTier = getTierById(selectedTier);
  const directCommission = hasElite ? currentTier.eliteBoost : currentTier.commissions.direct;

  const calculations = useMemo(() => {
    // Software income (recurring)
    const officeIncome = officeReferrals * softwareProducts.office.price * (directCommission / 100);
    const businessIncome = businessReferrals * softwareProducts.business.price * (directCommission / 100);
    const softwareTotal = officeIncome + businessIncome;

    // DFY Services income
    const starterIncome = starterClients * serviceProducts.starter.price * (serviceCommission / 100);
    const proServIncome = proClients * serviceProducts.pro.price * (serviceCommission / 100);
    const scaleIncome = scaleClients * serviceProducts.scale.price * (serviceCommission / 100);
    const unlimitedIncome = unlimitedClients * serviceProducts.unlimited.price * (serviceCommission / 100);
    const servicesTotal = starterIncome + proServIncome + scaleIncome + unlimitedIncome;

    // Support Plans income
    const proSupportIncome = proSupport * supportProducts.pro.price * (supportCommission / 100);
    const platinumIncome = platinumSupport * supportProducts.platinum.price * (supportCommission / 100);
    const premiumIncome = premiumSupport * supportProducts.premium.price * (supportCommission / 100);
    const supportTotal = proSupportIncome + platinumIncome + premiumIncome;

    // Module income
    const moduleIncome = moduleSales * avgModuleValue * (moduleCommission / 100);

    const personalTotal = softwareTotal + servicesTotal + supportTotal + moduleIncome;

    // Team income (overrides) - based on tier eligibility
    const secondGenRate = currentTier.commissions.secondGen / 100;
    const thirdGenRate = currentTier.commissions.thirdGen / 100;
    
    const secondGenOverride = directPartners * avgPartnerSales * secondGenRate;
    const thirdGenOverride = thirdGenPartners * avgThirdGenSales * thirdGenRate;
    const teamTotal = secondGenOverride + thirdGenOverride;

    const grandTotal = personalTotal + teamTotal;

    return {
      softwareTotal,
      officeIncome,
      businessIncome,
      servicesTotal,
      supportTotal,
      moduleIncome,
      personalTotal,
      secondGenOverride,
      thirdGenOverride,
      teamTotal,
      grandTotal,
    };
  }, [
    officeReferrals, businessReferrals, directCommission,
    starterClients, proClients, scaleClients, unlimitedClients, serviceCommission,
    proSupport, platinumSupport, premiumSupport, supportCommission,
    moduleSales, avgModuleValue, moduleCommission,
    directPartners, avgPartnerSales, thirdGenPartners, avgThirdGenSales,
    currentTier
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const eliteSavings = useMemo(() => {
    if (hasElite) return 0;
    const boostDiff = currentTier.eliteBoost - currentTier.commissions.direct;
    const softwareBase = (officeReferrals * softwareProducts.office.price) + 
                         (businessReferrals * softwareProducts.business.price);
    return softwareBase * (boostDiff / 100);
  }, [hasElite, currentTier, officeReferrals, businessReferrals]);

  return (
    <div className="min-h-screen bg-background">
      <PartnerNavigation />
      
      {/* Header */}
      <section className="py-12 md:py-16 border-b border-border bg-muted/30">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="max-w-3xl">
            <div className="eyebrow mb-4">
              <Calculator className="w-4 h-4" />
              Income Calculator
            </div>
            <h1 className="text-headline mb-4">Project Your Partner Earnings</h1>
            <p className="text-lg text-muted-foreground">
              Select your membership tier and adjust the values to see your potential monthly income
            </p>
          </div>
        </div>
      </section>

      {/* Tier Selector */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div>
              <Label className="text-sm font-medium mb-3 block">Your Membership Tier</Label>
              <div className="flex gap-2">
                {membershipTiers.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setSelectedTier(tier.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedTier === tier.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {tier.name}
                    <span className="ml-2 text-xs opacity-70">
                      {tier.price === 0 ? 'Free' : `$${tier.price}/mo`}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-accent-gold/10 to-accent-orange/10 border border-accent-gold/20">
              <Crown className="w-5 h-5 text-accent-gold" />
              <div className="flex-1">
                <Label htmlFor="elite" className="text-sm font-semibold cursor-pointer">
                  Elite Upgrade
                </Label>
                <p className="text-xs text-muted-foreground">+$30/mo → Boost to {currentTier.eliteBoost}% Direct</p>
              </div>
              <Switch 
                id="elite" 
                checked={hasElite} 
                onCheckedChange={setHasElite}
              />
            </div>
          </div>

          {/* Commission Summary */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="px-3 py-1.5 rounded-full bg-success/10 text-success text-sm font-medium">
              Direct: {directCommission}%
            </div>
            {currentTier.commissions.secondGen > 0 && (
              <div className="px-3 py-1.5 rounded-full bg-accent-cyan/10 text-accent-cyan text-sm font-medium">
                2nd Gen: {currentTier.commissions.secondGen}%
              </div>
            )}
            {currentTier.commissions.thirdGen > 0 && (
              <div className="px-3 py-1.5 rounded-full bg-accent-orange/10 text-accent-orange text-sm font-medium">
                3rd Gen: {currentTier.commissions.thirdGen}%
              </div>
            )}
            {selectedTier === 'standard' && (
              <div className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-sm">
                Upgrade to unlock team overrides
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calculator Inputs */}
            <div className="lg:col-span-2 space-y-8">
              <Tabs defaultValue="personal" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 h-auto p-1 bg-muted">
                  <TabsTrigger value="personal" className="py-3">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Personal Sales
                  </TabsTrigger>
                  <TabsTrigger value="team" className="py-3" disabled={selectedTier === 'standard'}>
                    <Users className="w-4 h-4 mr-2" />
                    Team Building
                    {selectedTier === 'standard' && (
                      <span className="ml-2 text-xs text-muted-foreground">(Upgrade Required)</span>
                    )}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-6">
                  {/* Software Referrals */}
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center gap-2">
                        💻 Software Referrals
                        <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">
                          {directCommission}% Recurring
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Label>Office Plan ($97/mo)</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={officeReferrals}
                                onChange={(e) => setOfficeReferrals(Math.max(0, Number(e.target.value)))}
                                min={0}
                                className="w-20 h-8 text-right"
                              />
                              <span className="text-sm text-muted-foreground">referrals</span>
                            </div>
                          </div>
                          <Slider
                            value={[Math.min(officeReferrals, 100)]}
                            onValueChange={([v]) => setOfficeReferrals(v)}
                            max={100}
                            step={1}
                          />
                          <p className="text-xs text-muted-foreground">
                            = {formatCurrency(officeReferrals * 97 * (directCommission / 100))}/mo
                          </p>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Label>Business Plan ($297/mo)</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={businessReferrals}
                                onChange={(e) => setBusinessReferrals(Math.max(0, Number(e.target.value)))}
                                min={0}
                                className="w-20 h-8 text-right"
                              />
                              <span className="text-sm text-muted-foreground">referrals</span>
                            </div>
                          </div>
                          <Slider
                            value={[Math.min(businessReferrals, 100)]}
                            onValueChange={([v]) => setBusinessReferrals(v)}
                            max={100}
                            step={1}
                          />
                          <p className="text-xs text-muted-foreground">
                            = {formatCurrency(businessReferrals * 297 * (directCommission / 100))}/mo
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* DFY Services */}
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center gap-2">
                        🛠️ Done-For-You Services
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="w-4 h-4 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Monthly recurring service clients</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Label>Starter ($1,497/mo)</Label>
                            <Input
                              type="number"
                              value={starterClients}
                              onChange={(e) => setStarterClients(Math.max(0, Number(e.target.value)))}
                              min={0}
                              className="w-20 h-8 text-right"
                            />
                          </div>
                          <Slider
                            value={[Math.min(starterClients, 50)]}
                            onValueChange={([v]) => setStarterClients(v)}
                            max={50}
                            step={1}
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Label>Pro ($2,497/mo)</Label>
                            <Input
                              type="number"
                              value={proClients}
                              onChange={(e) => setProClients(Math.max(0, Number(e.target.value)))}
                              min={0}
                              className="w-20 h-8 text-right"
                            />
                          </div>
                          <Slider
                            value={[Math.min(proClients, 50)]}
                            onValueChange={([v]) => setProClients(v)}
                            max={50}
                            step={1}
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Label>Scale ($3,997/mo)</Label>
                            <Input
                              type="number"
                              value={scaleClients}
                              onChange={(e) => setScaleClients(Math.max(0, Number(e.target.value)))}
                              min={0}
                              className="w-20 h-8 text-right"
                            />
                          </div>
                          <Slider
                            value={[Math.min(scaleClients, 50)]}
                            onValueChange={([v]) => setScaleClients(v)}
                            max={50}
                            step={1}
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Label>Unlimited ($5,997/mo)</Label>
                            <Input
                              type="number"
                              value={unlimitedClients}
                              onChange={(e) => setUnlimitedClients(Math.max(0, Number(e.target.value)))}
                              min={0}
                              className="w-20 h-8 text-right"
                            />
                          </div>
                          <Slider
                            value={[Math.min(unlimitedClients, 50)]}
                            onValueChange={([v]) => setUnlimitedClients(v)}
                            max={50}
                            step={1}
                          />
                        </div>
                      </div>
                      <div className="pt-4 border-t border-border">
                        <div className="space-y-2">
                          <Label>Service Commission Rate (%)</Label>
                          <Input
                            type="number"
                            value={serviceCommission}
                            onChange={(e) => setServiceCommission(Number(e.target.value))}
                            min={0}
                            max={100}
                            className="w-32"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Support Plans */}
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center gap-2">
                        🎧 Support Plan Referrals
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Label>Pro ($399/mo)</Label>
                            <Input
                              type="number"
                              value={proSupport}
                              onChange={(e) => setProSupport(Math.max(0, Number(e.target.value)))}
                              min={0}
                              className="w-20 h-8 text-right"
                            />
                          </div>
                          <Slider
                            value={[Math.min(proSupport, 50)]}
                            onValueChange={([v]) => setProSupport(v)}
                            max={50}
                            step={1}
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Label>Platinum ($699/mo)</Label>
                            <Input
                              type="number"
                              value={platinumSupport}
                              onChange={(e) => setPlatinumSupport(Math.max(0, Number(e.target.value)))}
                              min={0}
                              className="w-20 h-8 text-right"
                            />
                          </div>
                          <Slider
                            value={[Math.min(platinumSupport, 50)]}
                            onValueChange={([v]) => setPlatinumSupport(v)}
                            max={50}
                            step={1}
                          />
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <Label>Premium ($1,299/mo)</Label>
                            <Input
                              type="number"
                              value={premiumSupport}
                              onChange={(e) => setPremiumSupport(Math.max(0, Number(e.target.value)))}
                              min={0}
                              className="w-20 h-8 text-right"
                            />
                          </div>
                          <Slider
                            value={[Math.min(premiumSupport, 50)]}
                            onValueChange={([v]) => setPremiumSupport(v)}
                            max={50}
                            step={1}
                          />
                        </div>
                      </div>
                      <div className="pt-4 border-t border-border">
                        <div className="space-y-2">
                          <Label>Support Commission Rate (%)</Label>
                          <Input
                            type="number"
                            value={supportCommission}
                            onChange={(e) => setSupportCommission(Number(e.target.value))}
                            min={0}
                            max={100}
                            className="w-32"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Modules */}
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center gap-2">
                        📦 Business Module Sales
                        <span className="text-xs bg-accent-orange/10 text-accent-orange px-2 py-0.5 rounded-full font-medium">
                          Upfront
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label>Modules Sold/Month</Label>
                          <Input
                            type="number"
                            value={moduleSales}
                            onChange={(e) => setModuleSales(Math.max(0, Number(e.target.value)))}
                            min={0}
                            className="w-20 h-8 text-right"
                          />
                        </div>
                        <Slider
                          value={[Math.min(moduleSales, 50)]}
                          onValueChange={([v]) => setModuleSales(v)}
                          max={50}
                          step={1}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Avg. Module Price ($)</Label>
                          <Input
                            type="number"
                            value={avgModuleValue}
                            onChange={(e) => setAvgModuleValue(Number(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Commission Rate (%)</Label>
                          <Input
                            type="number"
                            value={moduleCommission}
                            onChange={(e) => setModuleCommission(Number(e.target.value))}
                            min={0}
                            max={100}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="team" className="space-y-6">
                  {/* 2nd Gen */}
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center gap-2">
                        👥 Direct Partners (2nd Gen)
                        <span className="text-xs bg-accent-cyan/10 text-accent-cyan px-2 py-0.5 rounded-full">
                          {currentTier.commissions.secondGen}% Override
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label>Number of Direct Partners</Label>
                          <Input
                            type="number"
                            value={directPartners}
                            onChange={(e) => setDirectPartners(Math.max(0, Number(e.target.value)))}
                            min={0}
                            className="w-20 h-8 text-right"
                          />
                        </div>
                        <Slider
                          value={[Math.min(directPartners, 50)]}
                          onValueChange={([v]) => setDirectPartners(v)}
                          max={50}
                          step={1}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Avg. Monthly Sales per Partner ($)</Label>
                        <Input
                          type="number"
                          value={avgPartnerSales}
                          onChange={(e) => setAvgPartnerSales(Number(e.target.value))}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* 3rd Gen */}
                  <Card className={currentTier.commissions.thirdGen === 0 ? 'opacity-50' : ''}>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center gap-2">
                        🌐 Network Partners (3rd Gen)
                        {currentTier.commissions.thirdGen > 0 ? (
                          <span className="text-xs bg-accent-orange/10 text-accent-orange px-2 py-0.5 rounded-full">
                            {currentTier.commissions.thirdGen}% Override
                          </span>
                        ) : (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                            Business Plan Required
                          </span>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label>Number of 3rd Gen Partners</Label>
                          <Input
                            type="number"
                            value={thirdGenPartners}
                            onChange={(e) => setThirdGenPartners(Math.max(0, Number(e.target.value)))}
                            min={0}
                            className="w-20 h-8 text-right"
                            disabled={currentTier.commissions.thirdGen === 0}
                          />
                        </div>
                        <Slider
                          value={[Math.min(thirdGenPartners, 100)]}
                          onValueChange={([v]) => setThirdGenPartners(v)}
                          max={100}
                          step={1}
                          disabled={currentTier.commissions.thirdGen === 0}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Avg. Monthly Sales per Partner ($)</Label>
                        <Input
                          type="number"
                          value={avgThirdGenSales}
                          onChange={(e) => setAvgThirdGenSales(Number(e.target.value))}
                          disabled={currentTier.commissions.thirdGen === 0}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Card className="border-accent/30 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-accent-orange to-accent-cyan" />
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-accent" />
                      Monthly Income Projection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Personal Income */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-3">Personal Sales</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Software Referrals</span>
                          <span className="font-medium">{formatCurrency(calculations.softwareTotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>DFY Services</span>
                          <span className="font-medium">{formatCurrency(calculations.servicesTotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Support Plans</span>
                          <span className="font-medium">{formatCurrency(calculations.supportTotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Modules</span>
                          <span className="font-medium">{formatCurrency(calculations.moduleIncome)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-semibold pt-2 border-t border-border">
                          <span>Subtotal</span>
                          <span className="text-success">{formatCurrency(calculations.personalTotal)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Team Income */}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-3">Team Overrides</p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>2nd Gen ({currentTier.commissions.secondGen}%)</span>
                          <span className="font-medium">{formatCurrency(calculations.secondGenOverride)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>3rd Gen ({currentTier.commissions.thirdGen}%)</span>
                          <span className="font-medium">{formatCurrency(calculations.thirdGenOverride)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-semibold pt-2 border-t border-border">
                          <span>Subtotal</span>
                          <span className="text-success">{formatCurrency(calculations.teamTotal)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Grand Total */}
                    <div className="pt-4 border-t-2 border-border">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">Total Monthly</span>
                        <span className="text-2xl font-bold text-success">
                          {formatCurrency(calculations.grandTotal)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {formatCurrency(calculations.grandTotal * 12)}/year
                      </p>
                    </div>

                    {/* Elite Upsell */}
                    {!hasElite && eliteSavings > 0 && (
                      <div className="p-3 rounded-lg bg-gradient-to-r from-accent-gold/10 to-accent-orange/10 border border-accent-gold/20">
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-accent-gold mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-accent-gold">
                              Elite Upgrade Available
                            </p>
                            <p className="text-xs text-muted-foreground">
                              +$30/mo unlocks an extra {formatCurrency(eliteSavings)}/mo
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Action Hub CTA */}
                <Card className="bg-primary text-primary-foreground">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      <h3 className="font-semibold">Ready to Earn?</h3>
                    </div>
                    <p className="text-sm opacity-90">
                      Start referring clients and building your team through the Action Hub.
                    </p>
                    <Button 
                      className="w-full btn-payout"
                      onClick={() => window.open(ACTION_HUB_URL, '_blank')}
                    >
                      Go to Action Hub
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50">
                  <CardContent className="p-4">
                    <p className="text-xs text-muted-foreground">
                      <strong>Note:</strong> This calculator provides estimates based on the inputs you provide. 
                      Actual earnings depend on your sales performance, client retention, and team activity.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">G</span>
              </div>
              <span>GFunnel Partner Program</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

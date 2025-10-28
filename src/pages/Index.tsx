import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Users, Clock } from "lucide-react";
import CallDurationChart from "@/components/analytics/CallDurationChart";
import SuccessRateChart from "@/components/analytics/SuccessRateChart";
import SentimentChart from "@/components/analytics/SentimentChart";
import CallVolumeChart from "@/components/analytics/CallVolumeChart";
import EmailCaptureDialog from "@/components/analytics/EmailCaptureDialog";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { toast } = useToast();

  const handleEditRequest = () => {
    if (!userEmail) {
      setShowEmailDialog(true);
    }
  };

  const handleEmailSubmit = (email: string) => {
    setUserEmail(email);
    setShowEmailDialog(false);
    toast({
      title: "Email Saved",
      description: "You can now customize your analytics data.",
    });
  };

  const stats = [
    { icon: BarChart3, label: "Total Calls", value: "12,543", change: "+12.5%" },
    { icon: TrendingUp, label: "Success Rate", value: "94.2%", change: "+2.3%" },
    { icon: Users, label: "Active Agents", value: "24", change: "+4" },
    { icon: Clock, label: "Avg Duration", value: "4.2m", change: "-0.5m" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border backdrop-blur-sm sticky top-0 z-50 bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold">Voice Analytics</h1>
            </div>
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Export Report
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Call Analytics <span className="text-gradient">Dashboard</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Monitor your voice agents' performance with real-time insights and customizable metrics.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all hover:border-primary/50">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
                  <h3 className="text-3xl font-bold mb-1">{stat.value}</h3>
                  <p className="text-sm text-primary">{stat.change}</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/10">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CallDurationChart />
          <SuccessRateChart />
          <SentimentChart />
          <CallVolumeChart 
            userEmail={userEmail}
            onEditRequest={handleEditRequest}
          />
        </div>
      </main>

      {/* Email Capture Dialog */}
      <EmailCaptureDialog 
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        onEmailSubmit={handleEmailSubmit}
      />
    </div>
  );
};

export default Index;

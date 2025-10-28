import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Edit2, Save, X, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CallVolumeChartProps {
  userEmail: string | null;
  onEditRequest: () => void;
}

const defaultData = [
  { day: "Mon", calls: 245 },
  { day: "Tue", calls: 312 },
  { day: "Wed", calls: 289 },
  { day: "Thu", calls: 356 },
  { day: "Fri", calls: 398 },
  { day: "Sat", calls: 178 },
  { day: "Sun", calls: 156 },
];

const CallVolumeChart = ({ userEmail, onEditRequest }: CallVolumeChartProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [chartData, setChartData] = useState(defaultData);
  const [editedData, setEditedData] = useState(defaultData);
  const [previousData, setPreviousData] = useState<typeof defaultData | null>(null);
  const [showPreviousAlert, setShowPreviousAlert] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (userEmail) {
      loadUserData();
    }
  }, [userEmail]);

  const loadUserData = async () => {
    if (!userEmail) return;

    const { data, error } = await supabase
      .from("user_analytics")
      .select("chart_data")
      .eq("email", userEmail)
      .maybeSingle();

    if (error) {
      console.error("Error loading user data:", error);
      return;
    }

    if (data?.chart_data) {
      const savedData = data.chart_data as typeof defaultData;
      setPreviousData(savedData);
      setChartData(savedData);
      setEditedData(savedData);
    }
  };

  const handleEdit = () => {
    if (!userEmail) {
      onEditRequest();
      return;
    }

    if (previousData) {
      setShowPreviousAlert(true);
    } else {
      setIsEditing(true);
    }
  };

  const handleOverwrite = () => {
    setShowPreviousAlert(false);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setShowPreviousAlert(false);
    setEditedData(chartData);
  };

  const handleSave = async () => {
    if (!userEmail) {
      toast({
        title: "Error",
        description: "Please provide your email first.",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("user_analytics")
      .upsert({
        email: userEmail,
        chart_data: editedData,
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save data. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setChartData(editedData);
    setPreviousData(chartData);
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Your custom data has been saved.",
    });
  };

  const handleInputChange = (index: number, value: string) => {
    const newData = [...editedData];
    newData[index] = { ...newData[index], calls: parseInt(value) || 0 };
    setEditedData(newData);
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Weekly Call Volume (Editable)</CardTitle>
            <CardDescription>Customize your call volume data</CardDescription>
          </div>
          {!isEditing && !showPreviousAlert && (
            <Button onClick={handleEdit} variant="outline" size="sm" className="gap-2">
              <Edit2 className="w-4 h-4" />
              Edit Data
            </Button>
          )}
          {isEditing && (
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm" className="gap-2">
                <Save className="w-4 h-4" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm" className="gap-2">
                <X className="w-4 h-4" />
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {showPreviousAlert && (
          <Alert className="mb-4 border-primary">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>You have previous data saved. Do you want to overwrite it?</span>
              <div className="flex gap-2 ml-4">
                <Button onClick={handleOverwrite} size="sm">
                  Yes, Overwrite
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  Cancel
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {editedData.map((item, index) => (
                <div key={item.day} className="space-y-2">
                  <label className="text-sm font-medium">{item.day}</label>
                  <Input
                    type="number"
                    value={item.calls}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="day" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{ value: 'Calls', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Area 
                type="monotone" 
                dataKey="calls" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCalls)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default CallVolumeChart;

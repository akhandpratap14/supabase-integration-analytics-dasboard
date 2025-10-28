import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { agent: "Agent 1", rate: 96 },
  { agent: "Agent 2", rate: 94 },
  { agent: "Agent 3", rate: 92 },
  { agent: "Agent 4", rate: 98 },
  { agent: "Agent 5", rate: 91 },
];

const SuccessRateChart = () => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Success Rate by Agent</CardTitle>
        <CardDescription>Performance comparison across voice agents</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="agent" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              label={{ value: 'Success %', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar 
              dataKey="rate" 
              fill="hsl(var(--chart-2))"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default SuccessRateChart;

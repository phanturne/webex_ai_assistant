import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import React from "react";

export const TimeSeriesChart = ({ data, dataKey, name }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
            >
              <XAxis
                dataKey="timestamp"
                label={{
                  value: "Time (seconds)",
                  position: "bottom",
                  offset: 0,
                }}
              />
              <YAxis />
              <Tooltip
                formatter={(value) => {
                  if (typeof value === "number") {
                    return value.toFixed(2);
                  }
                  return value;
                }}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke="#8884d8"
                name={name}
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
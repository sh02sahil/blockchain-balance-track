import React from "react";
import { Line, LineChart, XAxis, YAxis } from "recharts";

const ChartContainer = ({ title, contractMetrics }) => {
  return (
    <div className="flex flex-col gap-10 px-8">
      <div className="flex gap-8">
        <div className="text-5xl">{title}</div>
        <div className="text-xl text-[#a3a3a3] self-center">
          {contractMetrics?.contractAddress}
        </div>
      </div>
      <div className="flex justify-around py-12">
        <LineChart
          className=""
          width={500}
          height={500}
          data={[
            { point: contractMetrics?.pastBalance, time: 0 },
            { point: contractMetrics?.currentBalance, time: 12 },
          ]}
        >
          <XAxis
            // ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
            unit="hrs"
            // range={[0, 12]}
            dataKey={"time"}
            // domain={[1, 12]}
            // type="number"
          />
          <YAxis
            width={80}
            dataKey={"point"}
            domain={["auto", "auto"]}
            // domain={["auto", "auto"]} \
          />
          <Line
            type="monotone"
            dataKey="point"
            stroke="#ffffff"
            strokeWidth={2}
          />
        </LineChart>
        <div className="flex flex-col self-center text-3xl align-middle ">
          <div>Past Balance : {contractMetrics?.pastBalance}</div>
          <div>Current Balance : {contractMetrics?.currentBalance}</div>
          <div>Percentage change : {contractMetrics?.percentageChange} %</div>
        </div>
      </div>
    </div>
  );
};

export default ChartContainer;

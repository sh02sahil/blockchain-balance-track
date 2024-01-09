"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export function InputWithButton({
  newMetrics,
  setNewMetrics,
  clickHandler,
  ...props
}) {
  console.log(newMetrics);
  return (
    <div className="flex items-center w-full space-x-2">
      <Select
        defaultValue={newMetrics?.chain}
        onValueChange={(e) => {
          console.log(e);
          return setNewMetrics((prevValues) => ({
            ...prevValues,
            chain: e,
          }));
        }}
      >
        <SelectTrigger className="">
          <SelectValue placeholder="Select Chain" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="mantle">Mantle</SelectItem>
          <SelectItem value="linea">Linea</SelectItem>
          <SelectItem value="kroma">Kroma</SelectItem>
        </SelectContent>
      </Select>
      <Input
        value={newMetrics?.contractAddress}
        onChange={(e) =>
          setNewMetrics((prevValues) => ({
            ...prevValues,
            contractAddress: e.target.value,
          }))
        }
        type="text"
        placeholder="Contract Address"
      />
      <Button onClick={clickHandler} type="submit">
        View Metrics
      </Button>
    </div>
  );
}

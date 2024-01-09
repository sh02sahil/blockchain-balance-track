"use client";
import { InputWithButton } from "@/components/InputWithButton";
import Image from "next/image";
import { LineChart, Line, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import ChartContainer from "@/components/ChartContainer";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

const getAddressMetrics = async (chain, contractAddress, pastHours) => {
  const reqData = {
    chain,
    contractAddress,
    pastHours,
  };
  const url =
    process.env.NODE_ENV === "production"
      ? "https://flintlabs-sahil-production.up.railway.app/api"
      : "http://localhost:3000/api";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqData),
  });
  return res.json();
};
const PAST_HOURS = 12;
export default function Home() {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState({
    mantle: null,
    kroma: null,
    linea: null,
    newContract: null,
  });
  const [addContract, setAddContract] = useState({
    chain: "",
    contractAddress: "",
  });
  useEffect(() => {
    const getMetrics = async () => {
      const mantleMetrics = await getAddressMetrics(
        "mantle",
        "0xDCBc586cAb42a1D193CaCD165a81E5fbd9B428d7",
        PAST_HOURS
      );
      const lineaMetrics = await getAddressMetrics(
        "linea",
        "0xDCBc586cAb42a1D193CaCD165a81E5fbd9B428d7",
        PAST_HOURS
      );
      const kromaMetrics = await getAddressMetrics(
        "kroma",
        "0x7afb9de72A9A321fA535Bb36b7bF0c987b42b859",
        PAST_HOURS
      );
      setMetrics({
        mantle: mantleMetrics,
        linea: lineaMetrics,
        kroma: kromaMetrics,
      });
    };
    getMetrics();
  }, []);

  const alertForChange = {
    MANTLE: false,
    LINEA: false,
    KROMA: false,
  };
  useEffect(() => {
    switch (true) {
      case metrics?.mantle?.percentageChange <= -10:
        alertForChange.MANTLE = true;
      case metrics?.linea?.percentageChange <= -10:
        alertForChange.LINEA = true;
      case metrics?.kroma?.percentageChange <= -10:
        alertForChange.KROMA = true;
    }
  }, [metrics.kroma, metrics.linea, metrics.mantle]);

  useEffect(() => {
    console.log(alertForChange);
    console.log(metrics);
    const alertMessages = Object.keys(alertForChange).filter((key) => {
      return alertForChange[key] === true;
    });
    console.log(alertMessages);
    const message = {
      title: "Following Contracts balance reduces by 10% in the last 12 hours",
      description: alertMessages.join(", "),
    };
    console.log(message);

    if (alertMessages.length) {
      toast(message);
    }
  }, [alertForChange]);

  const clickHandler = async (e) => {
    e.preventDefault();
    const data = await getAddressMetrics(
      addContract.chain,
      addContract.contractAddress,
      PAST_HOURS
    );
    setMetrics((prevValues) => ({ ...prevValues, newContract: data }));
  };
  return (
    <main className="flex flex-col justify-between w-full min-h-screen gap-24 px-16 py-24">
      <ChartContainer title="Mantle" contractMetrics={metrics.mantle} />
      <ChartContainer title="Linea" contractMetrics={metrics.linea} />
      <ChartContainer title="Kroma" contractMetrics={metrics.kroma} />
      <div className="flex flex-col gap-8">
        <div className="text-5xl ">Add new Address</div>
        <InputWithButton
          newMetrics={addContract}
          setNewMetrics={setAddContract}
          clickHandler={clickHandler}
        />
      </div>
      {metrics.newContract ? (
        <ChartContainer
          title={metrics?.newContract?.chain}
          contractMetrics={metrics.newContract}
        />
      ) : null}
      <Toaster />
    </main>
  );
}

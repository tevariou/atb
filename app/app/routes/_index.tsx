import type { MetaFunction } from "@remix-run/node";
import { useEffect, useState } from "react";

import "./_index.css";
import Bike from "~/features/bike/Bike";
import Form from "~/features/bike/Form";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix SPA" },
    { name: "description", content: "Welcome to Remix (SPA Mode)!" },
  ];
};

export default function Index() {
  const [spinAngle, setSpinAngle] = useState(0);

  useEffect(() => {
    const incrementAngle = () => {
      if (spinAngle < 360) {
        setSpinAngle(spinAngle + 1);
      } else {
        setSpinAngle(0);
      }
    };
    const interval = setInterval(() => incrementAngle(), 1);
    return () => {
      clearInterval(interval);
    };
  }, [spinAngle]);

  return (
    <div className="App">
      <Form />
      <Bike spinAngle={spinAngle} />
    </div>
  );
}

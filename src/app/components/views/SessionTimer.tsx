import { useState, useEffect } from "react";

export interface SessionTimerProps {
  timestamp: number;
  durationMS: number;
  buyMoreTime: () => void;
}
export function SessionTimer(props: SessionTimerProps) {
  const { timestamp, durationMS, buyMoreTime } = props;
  const [now, setNow] = useState(~0);
  
  const endTime = timestamp + durationMS;
  const timeLeft = endTime - now;
  const hasTime = timeLeft > 0;
  const isLoading = timestamp === 0 || now === ~0;

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [timestamp]);

  const formatTimeLeft = () => {
    if (!hasTime || isLoading) {
      return "";
    }

    const minutes = Math.floor(timeLeft / 1000 / 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);

    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="w-50">
      <p className="text-center mb-3">{formatTimeLeft()}</p>
      <button
        className="py-2 px-6 rounded-lg bg-blue-500 text-white"
        type={hasTime ? "submit" : "button"}
        onClick={hasTime ? () => {} : buyMoreTime}
      >
        {isLoading ? "Loading" : hasTime ? "Send" : "Buy More Time"}
      </button>
    </div>
  );
}

export default SessionTimer;

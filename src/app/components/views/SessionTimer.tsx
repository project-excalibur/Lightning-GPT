import { useState, useEffect } from "react"

export interface SessionTimerProps {
  timestamp: number
  durationMS: number
  buyMoreTime: () => void
}
export function SessionTimer(props: SessionTimerProps) {
  const { timestamp, durationMS, buyMoreTime } = props
  const [now, setNow] = useState(~0)

  const endTime = timestamp + durationMS
  const timeLeft = Math.min(endTime - now, durationMS)
  const hasTime = timeLeft > 0
  const isLoading = timestamp === 0 || now === ~0

  useEffect(() => {
    const intervalId = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    // Cleanup the interval when the component is unmounted
    return () => clearInterval(intervalId)
  }, [timestamp])

  const formatTimeLeft = () => {
    if (!hasTime || isLoading) {
      return "You have no time left!"
    }

    const minutes = Math.floor(timeLeft / 1000 / 60)
    const seconds = Math.floor((timeLeft / 1000) % 60)

    return `${minutes}m ${seconds}s`
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="mb-3 text-center">{formatTimeLeft()}</p>
      <button
        className="px-6 py-2 text-white bg-blue-500 rounded-lg"
        type={hasTime ? "submit" : "button"}
        onClick={hasTime || isLoading ? () => {} : buyMoreTime}>
        {isLoading ? "Loading" : hasTime ? "Send" : "Buy More Time"}
      </button>
    </div>
  )
}

export default SessionTimer

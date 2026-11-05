import { useEffect, useState } from 'react'

const format = (timeZone: string) =>
  new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone }).format(new Date())

/** Current time in the given IANA time zone as "HH:MM", refreshed every 20 seconds. */
export function useLocalTime(timeZone: string) {
  const [time, setTime] = useState(() => format(timeZone))

  useEffect(() => {
    const id = window.setInterval(() => setTime(format(timeZone)), 20_000)
    return () => window.clearInterval(id)
  }, [timeZone])

  return time
}

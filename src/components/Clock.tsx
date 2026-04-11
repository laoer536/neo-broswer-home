import { useState, useEffect, useRef } from 'react'

interface FlipDigitProps {
  value: string
  prev: string
}

// 数字组件，纯静态
const Digit = ({ n }: { n: string }) => <span>{n}</span>

function FlipDigit({ value, prev }: FlipDigitProps) {
  const [showExit, setShowExit] = useState(false)
  const [display, setDisplay] = useState(value)
  const prevRef = useRef(value)

  useEffect(() => {
    if (value !== prevRef.current) {
      prevRef.current = value
      setShowExit(true)
      setTimeout(() => {
        setDisplay(value)
        setShowExit(false)
      }, 250)
    }
  }, [value])

  return (
    <span
      // Tailwind 覆盖不了的部分用 inline style
      style={{
        display: 'inline-flex',
        width: '0.65em',
        height: '1em',
        lineHeight: 1,
      }}
      className="relative overflow-hidden items-center justify-center"
    >
      {showExit ? (
        <span className="digit-exit absolute inset-0 flex items-center justify-center">
          <Digit n={display} />
        </span>
      ) : (
        <span className="digit-enter absolute inset-0 flex items-center justify-center">
          <Digit n={display} />
        </span>
      )}
    </span>
  )
}

export function Clock() {
  const [now, setNow] = useState(new Date())
  const [prev, setPrev] = useState({ h: '00', m: '00' })

  useEffect(() => {
    const tick = () => {
      const h = now.getHours().toString().padStart(2, '0')
      const m = now.getMinutes().toString().padStart(2, '0')
      setPrev({ h, m })
      setNow(new Date())
    }
    const t = setInterval(tick, 1000)
    tick()
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const h = now.getHours().toString().padStart(2, '0')
  const m = now.getMinutes().toString().padStart(2, '0')
  const s = now.getSeconds().toString().padStart(2, '0')

  const week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日  ${week[now.getDay()]}`

  return (
    <div className="text-center select-none">
      <div
        className="text-white font-light tracking-widest inline-flex items-center"
        style={{ fontSize: 'clamp(3rem, 10vw, 7rem)', textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}
      >
        <FlipDigit value={h[0]} prev={prev.h[0]} />
        <FlipDigit value={h[1]} prev={prev.h[1]} />
        <span className="opacity-60 mx-1">:</span>
        <FlipDigit value={m[0]} prev={prev.m[0]} />
        <FlipDigit value={m[1]} prev={prev.m[1]} />
        <span
          className="opacity-40 ml-1.5"
          style={{ fontSize: '0.5em', transform: 'translateY(0.35em)' }}
        >
          :{s}
        </span>
      </div>
      <div
        className="text-white/70 font-light tracking-wider"
        style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', marginTop: '8px' }}
      >
        {dateStr}
      </div>
    </div>
  )
}

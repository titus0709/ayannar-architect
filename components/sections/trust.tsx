"use client"

import { useEffect, useRef, useState } from "react"
import { Reveal } from "@/components/reveal"

const trustStats = [
  {
    value: 10,
    suffix: "+",
    label: "Projects Completed",
  },
  {
    value: 25,
    suffix: "+",
    label: "Temples Designed",
  },
  {
    value: 20,
    suffix: "+",
    label: "Years of Experience",
  },
]

function CountUp({
  value,
  suffix,
}: {
  value: number
  suffix: string
}) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)

  // Start animation only when the number enters the viewport
  useEffect(() => {
    const element = ref.current

    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true)

          // Run only once
          observer.disconnect()
        }
      },
      {
        threshold: 0.3,
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  // Count-up animation
  useEffect(() => {
    if (!hasStarted) return

    const duration = 1400
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      )

      // Smooth ease-out animation
      const easedProgress = 1 - Math.pow(1 - progress, 3)

      setCount(Math.floor(value * easedProgress))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [hasStarted, value])

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  )
}

export function TrustSection() {
  return (
    <section
      aria-label="Sri Ayyanar Architects credibility"
      className="border-y border-[#a99468]/20 bg-[#181715] text-[#eee9dd]"
    >
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-10 sm:py-14 lg:px-16 lg:py-16">
        <div className="grid grid-cols-1 divide-y divide-[#eee9dd]/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {trustStats.map((stat, index) => (
            <Reveal
              key={stat.label}
              delay={index * 0.1}
            >
              <div className="flex items-center gap-5 py-7 sm:justify-center sm:px-8 sm:py-2">
                <span className="font-serif text-4xl leading-none tracking-tight text-[#a99468] sm:text-5xl">
                  <CountUp
                    value={stat.value}
                    suffix={stat.suffix}
                  />
                </span>

                <span className="max-w-32.5 text-[10px] font-medium uppercase leading-4 tracking-[0.18em] text-[#aaa49a]">
                  {stat.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
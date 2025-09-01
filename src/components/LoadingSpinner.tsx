"use client"
import React, { useEffect, useRef } from "react"
import gsap from "gsap"

export default function LoadingIcon({ 
  text = "", 
  color = "#1447e6" /*blue-700(tailwind)*/,
  width = 50,
  height = 54
}: { 
  text?: string, 
  color?: string,
  width?: number,
  height?: number 
}) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  

  useEffect(() => {
    if (!svgRef.current) return

    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 })

    // Animation de l'apparition
    tl.fromTo(
      "#container",
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, ease: "back.out(1.7)", duration: 0.8 }
    )
      .fromTo(
        "#m",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(
        "#arrow",
        { x: -10, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
        "-=0.2"
      )
      // Lignes du bas qui s'écrivent
      .fromTo(
        ["#lines-in", "#lines-out"],
        {
          strokeDasharray: (i, el: any) => el.getTotalLength(),
          strokeDashoffset: (i, el: any) => el.getTotalLength(),
        },
        {
          strokeDashoffset: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power2.inOut",
        },
        "-=0.2"
      )

    // Effet flottant du conteneur
    gsap.to("#icone-45x50", {
      y: "+=6",
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    })
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-10 overflow-visible">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox="0 0 50 54"
        fill="none"
        className="overflow-visible"
      >
        <g id="icone-45x50">
          <path
            id="arrow"
            d="M36.3812 20.9978V12.4092H40.3463V20.9978H43.2972C43.7177 20.9978 43.6814 21.4491 43.6199 21.6047L38.6865 27.3926H38.1793C36.6117 25.5878 33.4303 21.9034 33.2459 21.6047C33.0615 21.3059 33.2767 21.1223 33.4303 20.9978H36.3812Z"
            fill={color}
          />
          <path
            id="lines-in"
            d="M14.6649 34.1608H40.3463M14.7111 39.8088L33.1537 39.7164"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            id="container"
            d="M11.2992 51.9916C6.68854 52.2156 5.92009 47.9151 6.04305 45.5034V8.53497V7.69478C6.04305 3.13906 8.76333 1.98665 11.2992 2.00012C20.0902 2.04679 38.7219 2.00011 42.9283 2.00012C46.8474 2.00012 48 4.70741 48 7.69476V45.5034C48 51.1514 45.9713 51.7115 42.9283 51.9916H11.2992Z"
            stroke={color}
            strokeWidth="4"
          />
          <path
            id="lines-out"
            d="M3 8.81503H8.44057M3 17.4037H8.44057M3 37.1015H8.44057M3 45.5034H8.44057"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            id="m"
            d="M17.2841 27.3926H14.0195V10.9622H17.8358L22.5258 17.5344L27.0779 10.9622H30.8023V27.3926H27.3997V16.3138L22.5258 23.0268H22.112L17.2841 16.3138V27.3926Z"
            fill={color}
          />
        </g>
      </svg>
      <span style={{color}} className={`font-semibold text-lg mt-4`}>{text}</span>
    </div>
  )
}
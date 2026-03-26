"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-950 group-[.toaster]:border-slate-200 group-[.toaster]:shadow-lg",
          title: "font-semibold font-inter",
          description: "group-[.toast]:text-slate-500 font-inter text-sm",
          actionButton:
            "group-[.toast]:bg-blue-600 group-[.toast]:text-white font-inter",
          cancelButton:
            "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-500 font-inter",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

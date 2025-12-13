import { useTheme } from "../theme-provider"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme()

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast:
                        "group toast group-[.toaster]:bg-white/10 group-[.toaster]:backdrop-blur-xl group-[.toaster]:border-white/20 group-[.toaster]:shadow-xl group-[.toaster]:rounded-xl group-[.toaster]:text-foreground group-[.toaster]:data-[type=success]:bg-[#10B981]/20 group-[.toaster]:data-[type=success]:border-[#10B981]/30 group-[.toaster]:data-[type=error]:bg-[#EF4444]/20 group-[.toaster]:data-[type=error]:border-[#EF4444]/30 group-[.toaster]:data-[type=warning]:bg-[#F59E0B]/20 group-[.toaster]:data-[type=warning]:border-[#F59E0B]/30 group-[.toaster]:data-[type=info]:bg-[#2563EB]/20 group-[.toaster]:data-[type=info]:border-[#2563EB]/30",
                    description: "group-[.toast]:text-muted-foreground",
                    actionButton:
                        "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                    cancelButton:
                        "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
                },
            }}
            {...props}
        />
    )
}

export { Toaster }

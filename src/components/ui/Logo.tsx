import { cn } from '@/lib/utils';
import logo from '@/assets/logo.png';

interface LogoProps {
    className?: string;
}

export function Logo({ className }: LogoProps) {
    return (
        <img
            src={logo}
            alt="Balaping Logo"
            className={cn("object-contain", className)}
        />
    );
}

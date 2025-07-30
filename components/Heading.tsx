import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface HeadingProps {
  label: string;
  desciption?: string;
  icon: LucideIcon;
  color?: string;
  bgColor?: string;
}

const Heading = ({ label, desciption, icon: Icon, color, bgColor }: HeadingProps) => {
  return (
      <div className="px-4 lg:px-8 flex items-center gap-x-3 mb-8">
        <div className={cn("p-2 w-fit rounded-md", bgColor)}>
          <Icon className={cn('w-10 h-10', color)} />
        </div>

        <div>
          <h2 className="text-3xl font-bold">
            {label}
          </h2>

          <p className="text-sm text-muted-foreground">{desciption}</p>
        </div>
      </div>
  )
}

export default Heading

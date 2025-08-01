'use client'
import { Menu } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import Sidebar from "./Sidebar"
import { useEffect, useState } from "react"

const MobileSidebar = ({ apiLimitCount = 0, isPro = false }: { apiLimitCount: number, isPro: boolean }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  })

  if (!isMounted) return null;
  
  return (
    <div className="flex justify-start">
      <Sheet>
        <SheetTrigger className="md:hidden">
          <Menu />
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <Sidebar apiLimitCount={apiLimitCount} isPro={isPro} />
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileSidebar

import { UserButton } from "@clerk/nextjs"
import MobileSidebar from "./MobileSidebar"
import { getApiLimitCount } from "@/lib/apiLimit"
import { checkSubscription } from "@/lib/subscription";

const Navbar = async () => {
  const apiLimitCount = await getApiLimitCount();
  const isPro = await checkSubscription();

  return (
    <div className="flex items-center p-4 sticky top-0 bg-white border-b shadow-sm z-50">
      <MobileSidebar apiLimitCount={apiLimitCount} isPro={isPro} />
      
      <div className="flex w-full justify-end">
        <UserButton />
      </div>
    </div>
  )
}

export default Navbar

import Navbar from "@/components/Navbar"
import Sidebar from "@/components/Sidebar"
import { getApiLimitCount } from "@/lib/apiLimit"
import { checkSubscription } from "@/lib/subscription";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const apiLimitCount = await getApiLimitCount();
  const isPro = await checkSubscription();

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 bg-gray-900">
        <Sidebar apiLimitCount={apiLimitCount} isPro={isPro} />
      </div>
      <main className="md:pl-72 flex flex-col min-h-screen overflow-y-auto">
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout

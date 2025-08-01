import Heading from '@/components/Heading'
import SubscriptionButton from '@/components/SubscriptionButton';
import { routes } from '@/constants'
import { checkSubscription } from '@/lib/subscription';
import React from 'react'

const SettingsPage = async () => {
  const pageInfo = routes.find(obj => obj.label === 'Settings');
  const isPro = await checkSubscription();


  return (
    <div>
      <Heading {...pageInfo!} desciption='Manage account settings.' />

      <div className='px-4 lg:px-8 space-y-4'>
        <div className='text-muted-foreground text-sm'>
          {isPro ? "You are currently on a pro plan." : "You are currently on a free plan."}
        </div>
        <SubscriptionButton isPro={isPro} />
      </div>
    </div>
  )
}

export default SettingsPage

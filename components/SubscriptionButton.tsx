'use client'
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Zap } from 'lucide-react'
import axios from 'axios'

const SubscriptionButton = ({ isPro = false }: { isPro: boolean }) => {
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    try {
      setLoading(true);

      const res = await axios.get('/api/stripe');

      window.location.href = res.data.url
    } catch (error) {
      console.error("BILLING_ERROR", error)
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button disabled={loading} variant={isPro ? "default" : 'premium'} onClick={onClick}>
      {isPro ? "Manage Subscription" : "Upgrade"}
      {!isPro && <Zap className='w-4 h-4 ml-2 fill-white' />}
    </Button>
  )
}

export default SubscriptionButton

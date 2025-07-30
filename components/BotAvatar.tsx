import React from 'react'
import { Avatar, AvatarImage } from './ui/avatar'

const BotAvatar = () => {
  return (
    <Avatar className='h-8 w-8'>
      <AvatarImage className='p-1' src='/images/logo.ico' />
    </Avatar>
  )
}

export default BotAvatar

import { 
  Code, 
  File, 
  HeadphonesIcon, 
  ImageIcon, 
  LayoutDashboard, 
  MessageSquare, 
  Music, 
  Settings, 
  VideoIcon 
} from "lucide-react";
import * as z from 'zod';

export const MAX_FREE_COUNTS = 5;

export const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    color: 'text-sky-500',
  },
  {
    label: 'Conversation',
    icon: MessageSquare,
    href: '/conversation',
    color: 'text-violet-500',
  },
  {
    label: 'Image Generation',
    icon: ImageIcon,
    href: '/image',
    color: 'text-pink-700',
  },
  {
    label: 'Video Generation',
    icon: VideoIcon,
    href: '/video',
    color: 'text-orange-700',
  },
  {
    label: 'Music Generation',
    icon: Music,
    href: '/music',
    color: 'text-emerald-500',
  },
  {
    label: 'Code Generation',
    icon: Code,
    href: '/code',
    color: 'text-green-700',
  }, 
  {
    label: 'Voice Conversation',
    icon: HeadphonesIcon,
    href: '/voice',
    color: 'text-pink-900'
  },
  {
    label: 'PDF | Resume Analyzer',
    icon: File,
    href: '/pdf',
    color: 'text-pink-900',
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
  },
];

export const tools = [
  {
    label: 'Conversation',
    icon: MessageSquare,
    href: '/conversation',
    color: 'text-violet-500',
    bgColor: 'bg-violet-500/10'
  },
  {
    label: 'Image Generation',
    icon: ImageIcon,
    href: '/image',
    color: 'text-pink-700',
    bgColor: 'bg-pink-700/10'
  },
  {
    label: 'Video Generation',
    icon: VideoIcon,
    href: '/video',
    color: 'text-orange-700',
    bgColor: 'bg-orange-700/10'
  },
  {
    label: 'Music Generation',
    icon: Music,
    href: '/music',
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10'
  },
  {
    label: 'Code Generation',
    icon: Code,
    href: '/code',
    color: 'text-green-700',
    bgColor: 'bg-green-700/10'
  }, 
  {
    label: 'Voice Conversation',
    icon: HeadphonesIcon,
    href: '/voice',
    color: 'text-pink-900',
    bgColor: 'bg-black/20'
  },
  {
    label: 'PDF | Resume Analyzer',
    icon: File,
    href: '/pdf',
    color: 'text-pink-900',
    bgColor: 'bg-black/20'
  },
];

export const formSchema = z.object({
  prompt: z.string().min(1, { message: 'Prompt is required'})
})

export const imageFormSchema = z.object({
  prompt: z.string().min(1, { message: 'Image prompt is required' }),
  amount: z.string().min(1),
  resolution: z.string().min(1)
})

export const amountOptions = [
  {
    value: '1',
    label: '1 Photo'
  },
  {
    value: '2',
    label: '2 Photos'
  },
  {
    value: '3',
    label: '3 Photos'
  },
  {
    value: '4',
    label: '4 Photos'
  },
  {
    value: '5',
    label: '5 Photos'
  },
]

export const resolutionOptions = [
  {
    value: '512x512',
    label: '512x512'
  },
  {
    value: '1024x1024',
    label: '1024x1024'
  },
]

export const testimonials = [
  {
    name: "Vasilis",
    avatar: "A",
    title: 'Data / Software Engineer & ML',
    description: "Best App!"
  }
]
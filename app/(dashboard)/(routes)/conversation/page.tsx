'use client'
import Heading from "@/components/Heading"
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tools, formSchema } from "@/constants"
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from 'zod';
import Empty from "@/components/Empty";
import { ChatCompletionMessageParam } from 'openai/resources';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import Loader from "@/components/Loader";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/UserAvatar";
import BotAvatar from "@/components/BotAvatar";

const ConversationPage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    }
  });
  const pageInfo = tools.find(obj => obj.label === 'Conversation');
  const isLoading = form.formState.isSubmitting;
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: ChatCompletionMessageParam = {
        role: 'user',
        content: values.prompt
      }
      
      const newMessages = [...messages, userMessage];

      const res = await axios.post('/api/conversation', {
        messages: newMessages
      });

      setMessages([...newMessages, res.data])

      form.reset();
    } catch (error) {
      console.error(error);
      setMessages(current => [
        ...current,
        { role: 'assistant', content: "Sorry, I couldn't generate a response. Please try again." }
      ])
    } finally {
      router.refresh();
    }
  }

  return (
    <div>
      <Heading 
        {...pageInfo!}
        desciption="Our most advanced conversation model."
      />

      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(onSubmit)} 
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2 shadow-md"
            >
              <FormField name="prompt" render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl className="m-0 p-0">
                    <Input 
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent" 
                      disabled={isLoading} 
                      placeholder="How do I calculate the radius of a circle?" 
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}/>
              <Button className="col-span-12 lg:col-span-2 w-full cursor-pointer" disabled={isLoading}>
                {!isLoading ? 'Generate' : 'Generating...'}
              </Button>
            </form>
          </Form>
        </div>

        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex flex-col items-center justify-center bg-muted space-y-1">
              <Loader />
            </div>
          )}
          {messages.length === 0 && !isLoading && (
            <Empty label="No Conversation started" />
          )}
          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message, idx) => (
              <div 
                key={`${message.role}-${idx}`} 
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg border border-l-4 border-solid text-sm",
                  message.role === 'user' ?  'bg-white border-[#2196f3]' : 'bg-muted border-[#4caf50]'
                )}
              >
                {message.role === 'user' ? <UserAvatar /> : <BotAvatar />}
                <span className="text-sm">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {message.content?.toString()}
                  </ReactMarkdown>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConversationPage

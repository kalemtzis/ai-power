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
import Loader from "@/components/Loader";

const MusicPage = () => {
  const router = useRouter();
  const [music, setMusic] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    }
  });
  const pageInfo = tools.find(obj => obj.label === 'Music Generation');
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setMusic(undefined);

      const res = await axios.post('/api/music', values);

      setMusic(res.data.audio);

      form.reset();
    } catch (error) {
      console.error(error);
    } finally {
      router.refresh();
    }
  }

  return (
    <div>
      <Heading 
        {...pageInfo!}
        desciption="Turn your prompt into music."
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
                      placeholder="Piano solo" 
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
          {!music && !isLoading && (
            <Empty label="No Music generated." />
          )}

          <div>Music</div>
        </div>
      </div>
    </div>
  )
}

export default MusicPage

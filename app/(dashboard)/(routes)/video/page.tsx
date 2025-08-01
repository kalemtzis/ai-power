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
import axios from 'axios';
import Loader from "@/components/Loader";
import { useProModal } from "@/hooks/use-pro-modal";
import toast from "react-hot-toast";

const VideoPage = () => {
  const router = useRouter();
  const [video, setVideo] = useState<string | undefined>("");
  const proModal = useProModal();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    }
  });
  const pageInfo = tools.find(obj => obj.label === 'Video Generation');
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setVideo(undefined);

      const res = await axios.post('/api/video', values);

      setVideo(res.data[0]);

      form.reset();
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        proModal.onOpen();
      } else {
        toast.error('Something went wrong.');
      }
    } finally {
      router.refresh();
    }
  }

  return (
    <div>
      <Heading 
        {...pageInfo!}
        desciption="Turn your prompt into a video."
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
                      placeholder="Clown fish swimming around a coral reef" 
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
          {!video && !isLoading && (
            <Empty label="No Video generated." />
          )}

          {video && (
            <video className="w-full aspect-video mt-8 rounded-lg border bg-black" controls>
              <source src={video} />
            </video>
          )}
        </div>
      </div>
    </div>
  )
}

export default VideoPage

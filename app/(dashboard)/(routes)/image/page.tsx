'use client'
import Heading from "@/components/Heading"
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tools, imageFormSchema, amountOptions, resolutionOptions } from "@/constants"
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from 'zod';
import Empty from "@/components/Empty";
import axios from 'axios';
import Loader from "@/components/Loader";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Download } from "lucide-react";

const ImagePage = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof imageFormSchema>>({
    resolver: zodResolver(imageFormSchema),
    defaultValues: {
      prompt: "",
      amount: "1",
      aspect_ratio: '4:3',
    }
  });

  const pageInfo = tools.find(obj => obj.label === 'Image Generation');
  const [images, setImages] = useState<string[]>([]);
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof imageFormSchema>) => {
    try { 
      setImages([]);

      const res = await axios.post('/api/image', values);

      const urls = res.data.map((img: { url: string }) => img.url);

      setImages(urls);

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
        desciption="Turn your prompt into an image."
      />

      <div className="px-4 lg:px-8">
        <div>
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(onSubmit)} 
              className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2 shadow-md"
            >
              <FormField name="prompt" render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-6">
                  <FormControl className="m-0 p-0">
                    <Input 
                      className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent" 
                      disabled={isLoading} 
                      placeholder="A picture of a horse in Swiss alps" 
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}/>

              <FormField name="amount" control={form.control} render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-2">
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {amountOptions.map(({ value, label }, idx) => (
                        <SelectItem key={`${value}-${idx}`} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />

              <FormField name="aspect_ratio" control={form.control} render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-2">
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {resolutionOptions.map(({ value, label }, idx) => (
                        <SelectItem key={`${value}-${idx}`} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                      </SelectContent>
                  </Select>
                </FormItem>
              )} />

              <Button className="col-span-12 lg:col-span-2 w-full cursor-pointer" disabled={isLoading}>
                {!isLoading ? 'Generate' : 'Generating...'}
              </Button>
            </form>
          </Form>
        </div>

        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-20">
              <Loader />
            </div>
          )}

          {images.length === 0 && !isLoading && (
            <Empty label="No images generated." />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:gird-cols-4 gap-4 mt-8">
            {images.map((src, idx) => (
              <Card
                key={`${src}-${idx}`}
                className="rounded-lg overflow-hidden"
              >
                <div className="relative aspect-square">
                  <Image src={src} alt={`Image-${idx}`} fill />
                </div>

                <CardFooter className="p-2">
                  <Button variant='secondary' className="w-full" onClick={() => window.open(src)}>
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImagePage

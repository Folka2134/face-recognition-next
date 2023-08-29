"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

import DetectedFaces from "./DetectedFaces";

interface Concept {
  app_id: string;
  id: string;
  name: string;
  value: number;
}

interface BoundingBox {
  bottom_row: number;
  left_col: number;
  right_col: number;
  top_row: number;
}

interface RegionInfo {
  bounding_box: BoundingBox;
}

interface Region {
  data: { concepts: Concept[] };
  id: string;
  region_info: RegionInfo;
  value: number;
}

interface Output {
  data: { regions: Region[] };
}

interface ApiResponse {
  outputs: Output[];
}

const imageUrlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))/i;
const formSchema = z.object({
  imageUrl: z.string().refine((url) => imageUrlRegex.test(url), {
    message: "Invalid image URL",
  }),
});

export default function inputForm() {
  const [displayImageUrl, setDisplayImageUrl] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);

  // useEffect(() => {
  //   if (apiResponse) {
  //     // TEST >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  //     // console.log("apiResponse:", apiResponse);

  //     const boxes = apiResponse.outputs[0].data.regions.map(
  //       (region: Region) => region.region_info.bounding_box,
  //     );

  //     console.log("boxes:", boxes);

  //     setBoundingBoxes(boxes);
  //   }
  // }, [apiResponse]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Destructure imageUrl from the validated form data
    const { imageUrl } = values;

    // Your Clarifai API configuration
    const PAT = "0e401cfcdede4fcaaf65b43e30a21ebf";
    const USER_ID = "clarifai";
    const APP_ID = "main";
    const MODEL_ID = "face-detection";
    const MODEL_VERSION_ID = "6dc7e46bc9124c5c8824be4822abe105";

    // Prepare the API request body and headers
    const raw = JSON.stringify({
      user_app_id: { user_id: USER_ID, app_id: APP_ID },
      inputs: [{ data: { image: { url: imageUrl } } }],
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Key " + PAT,
      },
      body: raw,
    };

    try {
      // Make the API call
      const response = await fetch(
        `https://api.clarifai.com/v2/models/${MODEL_ID}/versions/${MODEL_VERSION_ID}/outputs`,
        requestOptions,
      );

      // Check if the API call was successful
      if (response.ok) {
        const result = await response.json();
        // console.log("Clarifai API call result:", result);
        const boxes = result.outputs[0].data.regions.map(
          (region: Region) => region.region_info.bounding_box,
        );

        setBoundingBoxes(boxes);
      } else {
        const error = await response.json();
        console.error("Clarifai API call failed:", error);
      }
    } catch (error) {
      // Handle any errors that occurred during the fetch
      console.error("An error occurred while calling the Clarifai API:", error);
    }

    setDisplayImageUrl(values.imageUrl);
  }

  return (
    <>
      {displayImageUrl && (
        <DetectedFaces
          imageUrl={displayImageUrl}
          boundingBoxes={boundingBoxes}
        />
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-5"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Enter a URL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Detect</Button>
        </form>
      </Form>
    </>
  );
}

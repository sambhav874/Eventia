'use client'

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import {
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  DollarSignIcon,
  UsersIcon,
  ClockIcon,
  PlusIcon,
  XIcon,
} from "lucide-react";
import Script from "next/script";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ImageUploader from "@/components/EditableImageUploader";
import VideoUploader from "@/components/EditableVideoUploader";
import { eventsWithLogos } from "@/components/ui/logos/logos";
import LocationPicker from "../../components/LocationPicker/page";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  start_date: z.date(),
  end_date: z.date(),
  time: z.string().min(1, { message: "Time is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  organiser: z.string(),
  creator: z.string(),
  capacity: z
    .number()
    .min(0, { message: "Capacity must be greater than or equal to 0" }),
  price: z
    .number()
    .min(0, { message: "Price must be a positive number" })
    .optional(),
  duration: z
    .number()
    .min(0, { message: "Duration must be a positive number" }),
  isPaid: z.boolean(),
  tags: z.array(z.string()),
  rules: z.array(z.string()),
  terms_conditions: z.array(z.string()),
  specialReqs: z.array(z.string()),
  images: z
    .array(z.string())
    .min(1, { message: "At least one image is required" }),
  videos: z
    .array(z.string())
    .min(1, { message: "At least one video is required" }),
  lastRegisterationDate: z.date(),
  entryProcedure: z.string().optional(),
  eligibilityCriteria: z.string().optional(),
  miniEvents: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ).optional(),
  
  locationCoordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  certificates: z.array(z.string()).optional(),
  prizes: z.array(
    z.object({
      place: z.string(),
      prize: z.string(),
    })
  ).optional(),
  faqs: z.array(
    z.object({
      question: z.string().min(1, { message: "Question is required" }),
      answer: z.string().min(1, { message: "Answer is required" }),
    })
  ),
});

type EventFormValues = z.infer<typeof formSchema>;

export default function CreateEventForm() {
  const [step, setStep] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useUser();
  

  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      start_date: new Date(),
      end_date: new Date(),
      time: "",
      location: "",
      organiser: "",
      creator: "",
      isPaid: false,
      capacity: 0,
      price: 0,
      duration: 0,
      tags: [],
      rules: [""],
      terms_conditions: [""],
      specialReqs: [],
      images: [],
      videos: [],
      lastRegisterationDate: new Date(),
      entryProcedure: "",
      eligibilityCriteria: "",
      miniEvents: [{title : '' , description : ''}],
      locationCoordinates: { lat: 40.749933, lng: -73.98633 },
      certificates: [],
      prizes: [],
      faqs: [{ question: "", answer: "" }],
    },
  });

  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTag,
  } = useFieldArray({
    control: form.control,
    name: "tags",
  });

  const {
    fields: ruleFields,
    append: appendRule,
    remove: removeRule,
  } = useFieldArray({
    control: form.control,
    name: "rules",
  });

  const {
    fields: termsFields,
    append: appendTerm,
    remove: removeTerm,
  } = useFieldArray({
    control: form.control,
    name: "terms_conditions",
  });

  const {
    fields: specialReqFields,
    append: appendSpecialReq,
    remove: removeSpecialReq,
  } = useFieldArray({
    control: form.control,
    name: "specialReqs",
  });

  const {
    fields: miniEventFields,
    append: appendMiniEvent,
    remove: removeMiniEvent,
  } = useFieldArray({
    control: form.control,
    name: "miniEvents",
  });

  const {
    fields: prizeFields,
    append: appendPrize,
    remove: removePrize,
  } = useFieldArray({
    control: form.control,
    name: "prizes",
  });

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control: form.control,
    name: "faqs",
  });

  useEffect(() => {
    if (user?.emailAddresses[0]?.emailAddress) {
      fetchUsernameByEmail(user.emailAddresses[0].emailAddress);
    }
  }, [user]);

  async function fetchUsernameByEmail(email: string) {
    try {
      const response = await fetch("/api/get-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        form.setValue("organiser", data.username);
        form.setValue("creator", data.creator);
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  const onSubmit = async (values: EventFormValues) => {
    try {
      const parsedData = {
        ...values,
        start_date: values.start_date.toISOString(),
        end_date: values.end_date.toISOString(),
        lastRegisterationDate: values.lastRegisterationDate.toISOString(),
        capacity: Number(values.capacity),
        price: values.price ? Number(values.price) : 0,
        duration: Number(values.duration),
        isPaid: Boolean(values.isPaid),
      };

      console.log(parsedData);

      const response = await axios.post("/api/events", parsedData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Success:", response.data);
      alert("Event created successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create event");
    }
  };

  const handleNext = async () => {
    const fields = getFieldsForStep(step);
    const isValid = await form.trigger(fields);
    if (isValid) {
      setStep((prev) => Math.min(prev + 1, 5));
    }
  };

  const handlePrevious = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const getFieldsForStep = (step: number): (keyof EventFormValues)[] => {
    switch (step) {
      case 1:
        return ["title", "description", "start_date", "end_date", "time", "lastRegisterationDate"];
      case 2:
        return ["location", "organiser", "tags", "rules", "terms_conditions"];
      case 3:
        return ["capacity", "isPaid", "price", "duration", "specialReqs"];
      case 4:
        return ["images", "videos", "certificates"];
      case 5:
        return ["entryProcedure", "eligibilityCriteria", "miniEvents", "prizes", "locationCoordinates", "faqs"];
      default:
        return [];
    }
  };

  const handleLocationSelect = (location) => {
    form.setValue("location", location.address);
    form.setValue("locationCoordinates", { lat: location.lat, lng: location.lng });
  };

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="lazyOnload"
        onLoad={() => {
          const script = document.createElement('script');
          script.src = 'https://unpkg.com/@googlemaps/extended-component-library@0.6';
          script.type = 'module';
          script.onload = initMap;
          document.body.appendChild(script);
        }}
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">
                Create New Event
              </CardTitle>
              <CardDescription className="text-center text-gray-400">
                Fill in the details to create your event
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {step === 1 && (
                    <>
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter event title"
                                {...field}
                                className="bg-gray-700 text-white border-gray-600"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe your event"
                                {...field}
                                className="bg-gray-700 text-white border-gray-600"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="start_date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Start Date</FormLabel>
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                className="rounded-md border border-gray-600"
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="end_date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>End Date</FormLabel>
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                className="rounded-md border border-gray-600"
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Time</FormLabel>
                            <FormControl>
                              <Input
                                type="time"
                                {...field}
                                className="bg-gray-700 text-white border-gray-600"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastRegisterationDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Last Registration Date</FormLabel>
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              className="rounded-md border border-gray-600"
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <FormField
  control={form.control}
  name="location"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Event Location</FormLabel>
      <FormControl>
        <LocationPicker 
          onLocationSelect={(location) => {
            field.onChange(location.address);
            form.setValue('locationCoordinates', { 
              lat: location.lat, 
              lng: location.lng 
            });
          }} 
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>


                      <FormField
                        control={form.control}
                        name="organiser"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Organiser</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input
                                  id="organizer-input"
                                  placeholder="Event Organiser"
                                  {...field}
                                  className="bg-gray-700 text-white border-gray-600 pl-10"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div>
                        <FormLabel>Event Tags</FormLabel>
                        <div className="space-y-2">
                          {tagFields.map((field, index) => (
                            <FormField
                              key={field.id}
                              control={form.control}
                              name={`tags.${index}`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <div className="flex items-center space-x-2">
                                      <Input
                                        placeholder="Enter a tag"
                                        {...field}
                                        className="bg-gray-700 text-white border-gray-600"
                                      />
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => removeTag(index)}
                                      >
                                        <XIcon className="h-4 w-4" />
                                        <span className="sr-only">Remove tag</span>
                                      </Button>
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>

                        <div className="mt-2">
                          <Input
                            placeholder="Search events"
                            className="mb-2 bg-gray-700 text-white border-gray-600"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                          {searchQuery && (
                            <div className="max-h-40 overflow-y-auto bg-gray-700 border border-gray-600 rounded-md">
                              {eventsWithLogos
                                .filter((event) =>
                                  event.name.toLowerCase().includes(searchQuery.toLowerCase())
                                )
                                .map((event) => (
                                  <div
                                    key={event.name}
                                    className="p-2 text-sm cursor-pointer hover:bg-gray-600"
                                    onClick={() => {
                                      appendTag(event.name);
                                      setSearchQuery("");
                                    }}
                                  >
                                    {event.name}
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => appendTag("")}
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Add Tag
                        </Button>

                        <FormLabel className="mt-4 block">Event Rules</FormLabel>
                        {ruleFields.map((field, index) => (
                          <FormField
                            key={field.id}
                            control={form.control}
                            name={`rules.${index}`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Input
                                      placeholder="Enter a rule"
                                      {...field}
                                      className="bg-gray-700 text-white border-gray-600"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => removeRule(index)}
                                    >
                                      <XIcon className="h-4 w-4" />
                                      <span className="sr-only">Remove rule</span>
                                    </Button>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => appendRule("")}
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Add Rule
                        </Button>

                        <FormLabel className="mt-4 block">Terms and Conditions</FormLabel>
                        {termsFields.map((field, index) => (
                          <FormField
                            key={field.id}
                            control={form.control}
                            name={`terms_conditions.${index}`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Input
                                      placeholder="Enter a term or condition"
                                      {...field}
                                      className="bg-gray-700 text-white border-gray-600"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => removeTerm(index)}
                                    >
                                      <XIcon className="h-4 w-4" />
                                      <span className="sr-only">Remove term</span>
                                    </Button>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => appendTerm("")}
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Add Term
                        </Button>
                      </div>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <FormField
                        control={form.control}
                        name="capacity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Capacity</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <UsersIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input
                                  type="number"
                                  placeholder="Enter event capacity"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                  className="bg-gray-700 text-white border-gray-600 pl-10"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="isPaid"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border border-gray-600 p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Paid Event
                              </FormLabel>
                              <FormDescription>
                                Is this a paid event?
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      {form.watch("isPaid") && (
                        <FormField
                          control={form.control}
                          name="price"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Event Price</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <DollarSignIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                  <Input
                                    type="number"
                                    placeholder="Enter event price"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                    className="bg-gray-700 text-white border-gray-600 pl-10"
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Duration (in hours)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input
                                  type="number"
                                  placeholder="Enter event duration"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                  className="bg-gray-700 text-white border-gray-600 pl-10"
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div>
                        <FormLabel>Special Requirements</FormLabel>
                        {specialReqFields.map((field, index) => (
                          <FormField
                            key={field.id}
                            control={form.control}
                            name={`specialReqs.${index}`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Input
                                      placeholder="Enter a special requirement"
                                      {...field}
                                      className="bg-gray-700 text-white border-gray-600"
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="icon"
                                      onClick={() => removeSpecialReq(index)}
                                    >
                                      <XIcon className="h-4 w-4" />
                                      <span className="sr-only">Remove special requirement</span>
                                    </Button>
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => appendSpecialReq("")}
                        >
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Add Special Requirement
                        </Button>
                      </div>
                    </>
                  )}

                  {step === 4 && (
                    <>
                      <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Images</FormLabel>
                            <FormControl>
                              <ImageUploader
                                onChange={(images) => {
                                  field.onChange(images);
                                  form.trigger("images");
                                }}
                                value={field.value || []}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="videos"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Videos</FormLabel>
                            <FormControl>
                              <VideoUploader
                                onChange={(videos) => {
                                  field.onChange(videos);
                                  form.trigger("videos");
                                }}
                                value={field.value || []}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="certificates"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Certificates</FormLabel>
                            <FormControl>
                              <ImageUploader
                                onChange={(certificates) => {
                                  field.onChange(certificates);
                                  form.trigger("certificates");
                                }}
                                value={field.value || []}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {step === 5 && (
                    <>
                      <FormField
                        control={form.control}
                        name="entryProcedure"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Entry Procedure</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe the entry procedure"
                                {...field}
                                className="bg-gray-700 text-white border-gray-600"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="eligibilityCriteria"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Eligibility Criteria</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe the eligibility criteria"
                                {...field}
                                className="bg-gray-700 text-white border-gray-600"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div>
                        <FormLabel>Mini Events</FormLabel>
                        {miniEventFields.map((field, index) => (
                          <div key={field.id} className="space-y-2 mb-4">
                            <FormField
                              control={form.control}
                              name={`miniEvents.${index}.title`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      placeholder="Mini Event Title"
                                      {...field}
                                      className="bg-gray-700 text-white border-gray-600"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`miniEvents.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Mini Event Description"
                                      {...field}
                                      className="bg-gray-700 text-white border-gray-600"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeMiniEvent(index)}
                            >
                              Remove Mini Event
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => appendMiniEvent({ title: "", description: "" })}
                        >
                          Add Mini Event
                        </Button>
                      </div>

                      <div>
                        <FormLabel>Prizes</FormLabel>
                        {prizeFields.map((field, index) => (
                          <div key={field.id} className="space-y-2 mb-4">
                            <FormField
                              control={form.control}
                              name={`prizes.${index}.place`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      placeholder="Prize Place (e.g., 1st, 2nd)"
                                      {...field}
                                      className="bg-gray-700 text-white border-gray-600"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`prizes.${index}.prize`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      placeholder="Prize Description"
                                      {...field}
                                      className="bg-gray-700 text-white border-gray-600"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removePrize(index)}
                            >
                              Remove Prize
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => appendPrize({ place: "", prize: "" })}
                        >
                          Add Prize
                        </Button>
                      </div>

                      <div>
                        <FormLabel>FAQs</FormLabel>
                        {faqFields.map((field, index) => (
                          <div key={field.id} className="space-y-2 mb-4">
                            <FormField
                              control={form.control}
                              name={`faqs.${index}.question`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      placeholder="FAQ Question"
                                      {...field}
                                      className="bg-gray-700 text-white border-gray-600"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name={`faqs.${index}.answer`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Textarea
                                      placeholder="FAQ Answer"
                                      {...field}
                                      className="bg-gray-700 text-white border-gray-600"
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeFaq(index)}
                            >
                              Remove FAQ
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => appendFaq({ question: "", answer: "" })}
                        >
                          Add FAQ
                        </Button>
                      </div>
                    </>
                  )}
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
              {step > 1 && (
                <Button type="button" onClick={handlePrevious} variant="outline">
                  Previous
                </Button>
              )}
              {step < 5 ? (
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
                  Create Event
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
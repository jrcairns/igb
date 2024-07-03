"use client"

import { cn } from "@/lib/utils"
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from "@tanstack/react-query"
import React from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { Button } from "./ui/button"
import { CardDescription, CardTitle } from "./ui/card"
import { Checkbox } from "./ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Input } from "./ui/input"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { ScrollArea } from "./ui/scroll-area"
import { InstagramBusinessAccount, InstagramMedia } from "@/app/fb/types"

const connectAccountFormSchema = z.object({
    accountId: z.string().min(1)
})

type ConnectAccountFormSchema = z.infer<typeof connectAccountFormSchema>

function ConnectAccountForm() {
    const state = useMultistepForm()

    const form = useForm<ConnectAccountFormSchema>({
        resolver: zodResolver(connectAccountFormSchema),
        defaultValues: {
            accountId: state.data.accountId
        }
    })
    function onSubmit({ accountId }: ConnectAccountFormSchema) {
        state.setData(prevState => ({
            ...prevState,
            accountId
        }))
        state.forward()
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                <FormField
                    control={form.control}
                    name="accountId"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    {state.accounts?.map(account => (
                                        <FormItem className="relative space-y-0" key={account.id}>
                                            <FormControl>
                                                <RadioGroupItem value={account.id} className="peer absolute block top-1/2 -translate-y-1/2 right-4 border-border data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white" />
                                            </FormControl>
                                            <FormLabel className={cn(
                                                "cursor-pointer relative p-4 border rounded-md flex space-x-3 font-normal group hover:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:border-primary",
                                            )}>
                                                <div className="flex-1 flex flex-col space-y-1">
                                                    <span className="font-medium">{account.name}</span>
                                                    <span className="text-muted-foreground">@{account.username}</span>
                                                </div>
                                            </FormLabel>
                                        </FormItem>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="ml-auto">Connect account</Button>
            </form>
        </Form>
    )
}
const createStoreFormSchema = z.object({
    storeName: z.string().min(1)
})

type CreateStoreFormSchema = z.infer<typeof createStoreFormSchema>

function CreateStoreForm() {
    const state = useMultistepForm()

    const form = useForm<CreateStoreFormSchema>({
        resolver: zodResolver(createStoreFormSchema),
        defaultValues: {
            storeName: state.data.storeName
        }
    })
    function onSubmit({ storeName }: CreateStoreFormSchema) {
        state.setData(prevState => ({
            ...prevState,
            storeName
        }))
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                <FormField
                    name="storeName"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex h-9 w-full rounded-md border border-input bg-transparent p-1 pl-3 text-sm shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring">
                                <FormControl>
                                    <Input placeholder="new-shop" className="border-none h-auto p-0 shadow-none focus:!ring-0" {...field} />
                                </FormControl>
                                <span className="leading-none text-muted-foreground bg-muted text-xs flex items-center rounded-md border px-2">.example.shop</span>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end space-x-2">
                    <Button onClick={() => state.back()} variant="outline" type='button'>Back</Button>
                    <Button type="submit">Create store</Button>
                </div>
            </form>
        </Form>
    )
}

const generateProductsFormSchema = z.object({
    posts: z.array(z.string()).min(1)
})

type GenerateProductsFormSchema = z.infer<typeof generateProductsFormSchema>

function GenerateProductsForm() {
    const state = useMultistepForm()

    const form = useForm<GenerateProductsFormSchema>({
        resolver: zodResolver(generateProductsFormSchema),
        defaultValues: {
            posts: state.data.posts
        }
    })

    const query = useQuery({
        queryKey: ['media', state.data.accountId],
        queryFn: async () => {
            const res = await fetch(`/api/fb/accounts/${state.data.accountId}/media`)
            const data = await res.json() as InstagramMedia[]
            return data
        },
        enabled: !!state.data.accountId
    })

    function onSubmit({ posts }: GenerateProductsFormSchema) {
        state.setData(prevState => ({
            ...prevState,
            posts
        }))
        state.forward()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-4">
                <ScrollArea className="h-48 overlfow-auto p-2 border bg-muted dark:bg-muted/20 rounded-md shadow-inner">
                    <FormField
                        control={form.control}
                        name="posts"
                        render={() => (
                            <FormItem className="space-y-0">
                                <div className="grid grid-cols-3 gap-1">
                                    {query.data?.map((item) => (
                                        <FormField
                                            key={item.id}
                                            control={form.control}
                                            name="posts"
                                            render={({ field }) => {
                                                const isChecked = field.value?.includes(item.id)
                                                return (
                                                    <FormItem className="space-y-0 relative" key={item.id}>
                                                        <FormControl>
                                                            <Checkbox
                                                                className="peer absolute right-2 top-2 z-10"
                                                                checked={isChecked}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, item.id])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== item.id
                                                                            )
                                                                        )
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="relative flex cursor-pointer rounded-md overflow-hidden">
                                                            <img src={item.media_url} alt="" className="rounded-md border" />
                                                            {isChecked && <span className="absolute inset-0 bg-primary/50"></span>}
                                                        </FormLabel>
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    ))}
                                </div>
                            </FormItem>
                        )}
                    />
                </ScrollArea>
                {form.formState.errors.posts && <FormMessage>{form.formState.errors.posts.message}</FormMessage>}
                <div className="flex justify-end space-x-2">
                    <Button onClick={() => state.back()} variant="outline" type='button'>Back</Button>
                    <Button type="submit">Generate products</Button>
                </div>
            </form>
        </Form>
    )
}

type MultistepFormContextProps = {
    accounts: InstagramBusinessAccount[];
    data: typeof defaultData;
    setData: React.Dispatch<React.SetStateAction<typeof defaultData>>;
    currentStep: string;
    back: () => void;
    forward: () => void;
}

const MultistepFormContext = React.createContext<MultistepFormContextProps | null>(null)

function useMultistepForm() {
    const context = React.useContext(MultistepFormContext)
    if (!context) throw new Error("context error")
    return context
}

const defaultData = {
    accountId: "",
    posts: [] as string[],
    storeName: "",
}

export function Onboarding({ accounts }: { accounts: InstagramBusinessAccount[] }) {
    const [currentStep, setCurrentStep] = React.useState(accounts.length === 0 ? "1" : "0")

    const [data, setData] = React.useState(defaultData)

    return (
        <MultistepFormContext.Provider value={{
            accounts,
            data,
            setData,
            currentStep,
            back: () => setCurrentStep(prevState => (Number(prevState) - 1).toString()),
            forward: () => setCurrentStep(prevState => (Number(prevState) + 1).toString()),
        }}>
            <Accordion value={currentStep} onValueChange={setCurrentStep} type="single" className="w-full rounded-xl border bg-card text-card-foreground">
                <AccordionItem value={"0"}>
                    <AccordionTrigger disabled className="flex flex-col space-y-1.5 p-6">
                        <CardTitle>Select an account</CardTitle>
                        <CardDescription className="text-left">Choose one of your connected accounts.</CardDescription>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0">
                        <ConnectAccountForm />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem disabled={!data.accountId} value={"1"} className="data-[disabled]:opacity-50 transition-opacity">
                    <AccordionTrigger disabled className="flex flex-col space-y-1.5 p-6">
                        <CardTitle>Generate some products</CardTitle>
                        <CardDescription className="text-left">Select posts to generate products. You can add more later.</CardDescription>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0 relative">
                        <GenerateProductsForm />
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem disabled={!data.accountId || !data.posts.length} value={"2"} className="data-[disabled]:opacity-50 transition-opacity border-b-0">
                    <AccordionTrigger disabled className="flex flex-col space-y-1.5 p-6">
                        <CardTitle>Create a store</CardTitle>
                        <CardDescription className="text-left">A URL will be auto-generated based on the store name.</CardDescription>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-1">
                        <CreateStoreForm />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </MultistepFormContext.Provider>

    )
}
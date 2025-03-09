"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "@/components/ui/form";
import { Save, Eye, EyeOff, CheckCircle } from "lucide-react";
import { updateApiKeys } from "@/lib/server-actions";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// Define the Zod schema for a single API provider - allow ANY value for apiKey
const apiProviderSchema = z.object({
  name: z.string(),
  slug: z.string(),
  // Accept ANY value for apiKey - including empty strings, null, undefined, etc.
  apiKey: z.string().nullable(),
  enabled: z.boolean(),
});

// Define the Zod schema for our API keys form
const apiKeysSchema = z.object({
  providers: z.array(apiProviderSchema)
});

type ApiKeysFormValues = z.infer<typeof apiKeysSchema>;

interface ApiKeysFormProps {
  defaultProviders: {
    name: string;
    slug: string;
    apiKey?: string | null;
    enabled: boolean;
  }[];
}

export function ApiKeysForm({ defaultProviders }: ApiKeysFormProps) {
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const normalizedProviders = defaultProviders.map(provider => ({
    ...provider,
    apiKey: provider.apiKey || "",
  }));

  const form = useForm<ApiKeysFormValues>({
    resolver: zodResolver(apiKeysSchema),
    defaultValues: { providers: normalizedProviders }, 
  });
  
  const { control, handleSubmit, watch, setValue } = form;

  // Field array for providers
  const { fields } = useFieldArray({
    control,
    name: "providers",
  });

  // Watch providers to auto-enable when API key is entered
  const providersWatch = watch("providers");
  
  useEffect(() => {
    providersWatch.forEach((provider, index) => {
      if (provider.apiKey && provider.apiKey.trim() !== "" && !provider.enabled) {
        setValue(`providers.${index}.enabled`, true);
      }
    });
  }, [providersWatch, setValue]);

  // Toggle password visibility
  const togglePasswordVisibility = (slug: string) => {
    setShowPassword(prev => ({
      ...prev,
      [slug]: !prev[slug]
    }));
  };

  // Save all providers
  const onSubmit = async (data: ApiKeysFormValues) => {
    setIsSaving(true);
    setSaveSuccess(false);
    console.log(data);
    
    try {
      // Process the data before sending to server
      const processedData = data.providers.map(provider => ({
        ...provider,
        // If the API key is an empty string, set it to null to avoid empty API key issues
        apiKey: provider.apiKey && provider.apiKey.trim() !== "" ? provider.apiKey : null
      }));
      
      await updateApiKeys(processedData);
      setIsSaving(false);
      setSaveSuccess(true);
      
      // Reset success indicator after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
      
      toast.success("API Settings Saved", {
        description: "Your API configurations have been updated successfully.",
      });
    } catch (error) {
      console.error("Failed to update API keys:", error);
      setIsSaving(false);
      
      toast.error("Error Saving API Settings", {
        description: "There was a problem updating your API configurations.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          {fields.map((field, index) => (
            <Card key={field.id} className="border-border/60 shadow-sm hover:shadow-md transition-all">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <CardTitle className="text-xl">{field.name}</CardTitle>
                    <CardDescription>Configure your {field.name} integration</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {providersWatch[index]?.enabled ? 
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800">
                          Active
                        </Badge> : 
                        <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-900 dark:text-gray-400 dark:border-gray-700">
                          Inactive
                        </Badge>
                      }
                    </span>
                    <Controller
                      control={control}
                      name={`providers.${index}.enabled`}
                      render={({ field: switchField }) => (
                        <Switch
                          checked={switchField.value}
                          onCheckedChange={switchField.onChange}
                          className={switchField.value ? "bg-emerald-500" : ""}
                        />
                      )}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <FormField
                  control={control}
                  name={`providers.${index}.apiKey`}
                  render={({ field: inputProps }) => (
                    <FormItem>
                      <FormLabel className="text-foreground">API Key</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword[field.slug] ? "text" : "password"}
                            placeholder={`Enter your ${field.name} API key`}
                            value={inputProps.value || ""} 
                            onChange={inputProps.onChange}
                            onBlur={inputProps.onBlur}
                            name={inputProps.name}
                            ref={inputProps.ref}
                            className="pr-10 font-mono text-sm"
                          />
                          <button 
                            type="button"
                            onClick={() => togglePasswordVisibility(field.slug)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={showPassword[field.slug] ? "Hide password" : "Show password"}
                          >
                            {showPassword[field.slug] ? 
                              <EyeOff className="h-4 w-4" /> : 
                              <Eye className="h-4 w-4" />
                            }
                          </button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        {`Your ${field.name} API key`}
                      </FormDescription>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Single Save button */}
        <div className="flex items-center justify-end gap-4 pt-4">
          {saveSuccess && (
            <span className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              All settings saved
            </span>
          )}
          <Button 
            type="submit" 
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 transition-colors"
            disabled={isSaving}
            size="lg"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save API Settings"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
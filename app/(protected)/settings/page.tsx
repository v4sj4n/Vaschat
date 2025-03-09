import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ArrowLeft, AlertCircle, User, Sliders, Key } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ApiKeysForm } from "@/components/custom-ui/api-keys-form";

export default async function SettingsPage() {
  const session = await auth();
  const totalProviders = await prisma.modelProvider.findMany({
    select: {
      name: true,
      slug: true,
    },
    orderBy: {
      name: "asc",
    }
  });
  const userProviders = await prisma.modelProviderUserKey.findMany({
    where: {
      user: {
        email: session.user.email,
      },
    },
    select: {
      modelProvider: true,
      apiKey: true,
    },
  });


// In SettingsPage component
const totalProvidersPlusUserProviders = totalProviders.map((provider) => {
  const userProvider = userProviders.find(
    (up) => up.modelProvider.name === provider.name
  );
  
  return {
    ...provider,
    apiKey: userProvider?.apiKey || null, // Pass actual API key if exists
    enabled: !!userProvider?.apiKey, // Convert to boolean
  };
});

  console.log(totalProvidersPlusUserProviders);


  return (
    <div className="w-full h-full overflow-auto pb-16">
      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col items-baseline gap-4 mb-8">
          <Link
            href="/chat"
            className="flex items-center text-sm hover:text-primary transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-0.5 transition-transform" />
            Back to Chat
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="api-keys" className="w-full">
            {/* list */}
            <TabsList className="mb-8 grid grid-cols-3 gap-4 w-full max-w-md">
              <TabsTrigger value="api-keys" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                <span>API Keys</span>
              </TabsTrigger>
              <TabsTrigger
                value="preferences"
                className="flex items-center gap-2"
              >
                <Sliders className="h-4 w-4" />
                <span>Preferences</span>
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Account</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="api-keys" className="space-y-8">
              <Card className="border-border/60 shadow-sm">
                <CardHeader>
                  <CardTitle>API Configuration</CardTitle>
                  <CardDescription>
                    Add your service API keys to enable AI capabilities.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert className="mb-6 bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/20 dark:border-amber-800 dark:text-amber-500">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription>
                      Your API keys are stored securely and never shared with
                      third parties.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-6">
                    {/* {totalProvidersPlusUserProviders.map((provider) => {
                      return (
                        <div key={provider.name} className="grid gap-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="openai-key" className="font-medium">
                              {provider.name} API Key
                            </Label>
                            <Switch id="openai-enabled" checked={provider.enabled} />
                          </div>
                          <Input
                            id="openai-key"
                            type="password"
                            placeholder="sk-..."
                            className="w-full"
                          />
                        </div>
                      );
                    })} */}
                    <ApiKeysForm defaultProviders={totalProvidersPlusUserProviders} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card className="border-border/60 shadow-sm h-[300px] flex items-center justify-center">
                <div className="text-center py-8 text-muted-foreground space-y-2">
                  <Sliders className="h-12 w-12 mx-auto opacity-50 mb-4" />
                  <h3 className="text-lg font-medium text-foreground">
                    Preference Settings
                  </h3>
                  <p>Will be available soon</p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <Card className="border-border/60 shadow-sm h-[300px] flex items-center justify-center">
                <div className="text-center py-8 text-muted-foreground space-y-2">
                  <User className="h-12 w-12 mx-auto opacity-50 mb-4" />
                  <h3 className="text-lg font-medium text-foreground">
                    Account Settings
                  </h3>
                  <p>Will be available soon</p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t mt-12">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} VasChat. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

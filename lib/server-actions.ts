"use server";

import { auth } from "@/auth";
import { prisma } from "./prisma";

export async function updateApiKeys(
  data: {
    name: string;
    slug: string;
    apiKey?: string | null;
    enabled: boolean;
  }[]
) {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  await Promise.all(
    data.map(async (provider) => {
      console.log(provider);
      const modelProvider = await prisma.modelProvider.findUnique({
        where: { slug: provider.slug },
      });
      if (!modelProvider) throw new Error("Model provider not found");

      await prisma.modelProviderUserKey.update({
        where: {
          modelProviderId_userId: {
            userId: user.id,
            modelProviderId: modelProvider.id,
          },
        },
        data: {
          apiKey: provider.apiKey || "",
        },
      });
    })
  );
}

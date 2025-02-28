import claudeIcon from "../../assets/claude.svg";
import geminiIcon from "../../assets/gemini.svg";
import mistralIcon from "../../assets/mistral.svg";
import cohereIcon from "../../assets/cohere.svg";
import openaiIcon from "../../assets/openai.svg";
import deepseekIcon from "../../assets/deepseek.svg";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { titleCaser } from "@/lib/utils";
import { ProviderNamesType } from "@/lib/config";

export const ChatIconProvider = ({
  provider,
}: {
  provider: ProviderNamesType;
}) => {
  const getProviderIcon = (provider: ProviderNamesType) => {
    switch (provider) {
      case "openai":
        return openaiIcon.src;
      case "anthropic":
        return claudeIcon.src;
      case "deepseek":
        return deepseekIcon.src;
      case "mistral":
        return mistralIcon.src;
      case "google":
        return geminiIcon.src;
      case "cohere":
        return cohereIcon.src;
      default:
        return openaiIcon.src;
    }
  };

  return (
    <Avatar className="h-4">
      <AvatarImage
        className="text-foreground dark:prose-invert dark:invert"
        src={getProviderIcon(provider)}
        alt={titleCaser(provider)}
      />
      <AvatarFallback>{provider.substring(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};

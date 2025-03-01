import claudeIcon from "../../assets/providers/claude.svg";
import geminiIcon from "../../assets/providers/gemini.svg";
import mistralIcon from "../../assets/providers/mistral.svg";
import cohereIcon from "../../assets/providers/cohere.svg";
import openaiIcon from "../../assets/providers/openai.svg";
import deepseekIcon from "../../assets/providers/deepseek.svg";
import llamaIcon from "../../assets/providers/meta.svg";
import qwenIcon from "../../assets/providers/qwen.svg";
import grokIcon from "../../assets/providers/grok.svg";

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
        return openaiIcon;
      case "anthropic":
        return claudeIcon;
      case "deepseek":
        return deepseekIcon;
      case "mistral":
        return mistralIcon;
      case "google":
        return geminiIcon;
      case "cohere":
        return cohereIcon;
      case "llama":
        return llamaIcon;
      case "qwen":
        return qwenIcon;
      case "grok":
        return grokIcon;
    }
  };

  return (
    <img
      src={getProviderIcon(provider.toLowerCase())}
      className="dark:prose-invert dark:invert"
      alt={titleCaser(provider)}
    />
  );
};

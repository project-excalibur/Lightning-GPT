import { ChatGPTAPI } from "chatgpt";
import { ENV } from "../../models/env";

export const gptApi = new ChatGPTAPI({
    apiKey: ENV.chatGPTKey as string,
    completionParams: {
      model: 'gpt-4',
      temperature: 0.5,
      top_p: 0.8
    }
  })

  
import { ChatMessage } from "chatgpt";
import { ENV } from "../models/env";
import { gptApi } from "./server/server";

export function countTokens(text: string): number {
    // A rough approximation of OpenAI's tokenization rules
    // Note: this is still not 100% accurate!
  
    // 1. Split by spaces
    let tokens = text.split(/\s+/);
  
    // 2. Split further by punctuation
    tokens = tokens.flatMap(t => t.split(/(?<=[.,!?])/));
    
    const tokenCount = tokens.length;
  
    // Add a 34% safety margin
    const safetyMargin = 0.20;
    const tokenCountWithMargin = Math.ceil(tokenCount * (1 + safetyMargin));
  
    return tokenCountWithMargin;
  }


  export const callChatGPT = async (
    question: string, 
    conversationId?: string, 
    parentMessageId?: string
  ) => {

      const response = await gptApi.sendMessage(question, {
        conversationId,
        parentMessageId
    })

      return {
        response,
        cost: 0
      };

    }
"use client";
import { useEffect, useRef, useState } from "react";
import { FaGithub, FaTwitter } from "react-icons/fa";
import { ChatMessage } from "chatgpt";
import { callChatGPT, countTokens } from "./components/controllers/utils";
import { ENV } from "./components/models/env";
import Head from "next/head";
import { WebLNProvider, requestProvider } from "webln";
import {
  LightningInvoice,
  checkInvoicePaid,
  createInvoice,
} from "./components/controllers/lightning";
import { useQRCode } from "next-qrcode";
import Modal from "./components/modals/Modal";
// https://legend.lnbits.com/wallet?usr=3d7875e5fbb0418e835f3e7228e375a2&wal=692ed658d75147a1aec12f51632847e4

interface ExtendedChatMessage extends ChatMessage {
  isUser: boolean;
}

export default function Home() {
  // -------------- STATE ---------------------------
  const [webln, setWebln] = useState<null | WebLNProvider>(null);
  const [lightningInvoice, setLightningInvoice] =
    useState<null | LightningInvoice>(null);
  const [questionText, setQuestionText] = useState("");
  const [userMessageData, setUserMessageData] = useState<null | any>(null)
  const [chatGPTData, setChatGPTData] = useState<null | any>(null)
  const [questionCost, setQuestionCost] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ExtendedChatMessage[]>([]);
  const [shakeFeedbackOn, setShakeFeedbackOn] = useState(false);
  const [lastTransactionCost, setLastTransactionCost] = useState<number | null>(
    null
  );
  const [checkInterval, setCheckInterval] = useState<ReturnType<
    typeof setInterval
  > | null>(null);

  const { Canvas } = useQRCode();
  const questionInputRef = useRef<HTMLTextAreaElement>(null);

  // -------------- EFFECTS ---------------------------

  useEffect(() => {
    requestProvider().then(setWebln);
  }, []);

  // // Question Costs
  // useEffect(() => {
  //   setQuestionCost(0);
  // }, [questionText, countTokens]);

  // Focus on start
  useEffect(() => {
    questionInputRef.current?.focus();
    setMessages([
      {
        isUser: false,
        id: "",
        text: "Hello there! Welcome to Lightning-GPT! Here you can spend small amounts of lightning per Chat-GPT4 question. To start you will need to: ... \n\n",
        role: "system",
      },
    ]);
  }, []);

  // -------------- FUNCTIONS ---------------------------

  const shake = () => {
    if (shakeFeedbackOn) return;
    setShakeFeedbackOn(true);
    setTimeout(() => setShakeFeedbackOn(false), 555);
  };

  // ------------ HANDLERS -------------------

  const handleSendMessage = (e: any) => {
    // So Enter can be used
    e.preventDefault();

    // Shakes if nothing entered
    if (!questionText) {
      shake();
      return;
    }

    // Checks loading
    if (isLoading) return;
    setIsLoading(true);

    // Sets up question
    const userMessage: ExtendedChatMessage = {
      conversationId:
        messages.length > 0 ? messages[0].conversationId : undefined,
      parentMessageId:
        messages.length > 0 ? messages[messages.length - 1].id : undefined,
      text: questionText,
      isUser: true,
      id: "",
      role: "user",
    };

    callChatGPT(
      questionText,
      userMessage.conversationId,
      userMessage.parentMessageId
    )
      .then((data) => {
        setChatGPTData(data);
        setUserMessageData(userMessage);
        webLNFunction();
      })
      .catch((e) => {
        alert(`${e}`);
        console.error(e);
      })
      .finally(() => {
        setIsLoading(false);
        setQuestionText("");
      });
  };

  const handleInputChange = (e: any) => {
    setQuestionText(e.target.value);
    setQuestionCost(countTokens(e.target.value));
  };

  const reportQA = ()=>{
    if(chatGPTData){
        const aiMessage = { ...chatGPTData.response, isUser: false };
        setMessages([...messages, userMessageData, aiMessage]);
        setLastTransactionCost(chatGPTData.cost);
        setChatGPTData(null);
        setUserMessageData(null);
    }
  }

  const webLNFunction = () => {
    if (webln) {
      if (!lightningInvoice) {
        createInvoice({
          amount: questionCost,
          memo: "Lightning-GPT",
          // expiry: 30, //seconds
        }).then((invoice) => {
          setLightningInvoice(invoice);
        });
      } else {
        checkInvoicePaid(lightningInvoice).then((isPaid) => {
          if (isPaid) {
            setLightningInvoice(null);
            reportQA();
          }
        });
      }
    }
  };

  return (
    <>
      {/* Metadata */}
      <Head>
        <title>Lightning-GPT</title>
        <meta property="og:title" content="Lightning-GPT" key="title" />
        <meta name="description" content="Pay Per Question!" />
        <meta property="og:title" content="Lightning-GPT" />
        <meta property="og:description" content="Pay Per Question!" />
        <meta property="og:type" content="website" />
      </Head>

      <div className="flex flex-col h-screen bg-gray-900 text-white">
        {/* Socials */}
        <div
          className="absolute z-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-opacity-10 text-5xl"
          style={{ top: "calc(50% - 5vh)" }}
        >
          Lightning-GPT
        </div>

        {/* Socials */}

        <div className="absolute h-screen bg-gray-900 text-white">
          {/* Icons Section */}
          <div className="absolute top-4 left-4 space-x-4">
            <a
              href="https://github.com/CoachChuckFF/Solana-GPT"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="text-2xl text-white hover:text-blue-500 cursor-pointer" />
            </a>
            <a
              href="https://twitter.com/CoachChuckFF"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="text-2xl text-white hover:text-blue-500 cursor-pointer" />
            </a>
          </div>
        </div>

        {/* Loader Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <p className="animate-pulse text-5xl">Loading...</p>
          </div>
        )}

        {/* Loader Overlay */}
        {lightningInvoice &&  (
          <Modal isOpen={true}>
             <div className="flex flex-col gap-4 items-center justify-center">
                <p className="font-semibold mx-auto flex-wrap w-72 text-center">Scan the Qrcode and complete the payment to access your answer.</p>
               <Canvas  
              text={lightningInvoice.invoice}
              options={{
                errorCorrectionLevel: "M",
                margin: 3,
                scale: 4,
                width: 200,
                color: {
                  dark: "#010599FF",
                  light: "#FFBF60FF",
                },
              }}
            />
            {questionCost} satoshis
            <button className="py-2 px-6 rounded-lg bg-blue-500 text-white" onClick={webLNFunction}>Check Payment</button>
            </div>
          
           </Modal>
        )}

        {/* Chat Section */}
        <div className="flex-grow overflow-auto space-y-4 flex items-center justify-center h-[80vh] z-1">
          <div className="w-full h-full overflow-y-auto px-32 pr-64">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`my-5 mx-4 p-3 rounded-lg max-w-md ${
                  message.isUser
                    ? "ml-auto bg-blue-500 text-white"
                    : "mr-auto bg-gray-700 text-white"
                }`}
              >
                <p className="text-base whitespace-pre-wrap">{message.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Input Section */}
        <div className="flex flex-col items-center px-4 pb-2 bg-gray-800 border-t-2 border-gray-700 z-2">
          <form
            onSubmit={handleSendMessage}
            className="flex justify-between items-center w-full mt-5"
          >
            <textarea
              maxLength={4000}
              style={{ height: "18vh" }}
              className={`border-2 border-gray-600 rounded-lg flex-grow mr-4 py-2 px-4 bg-gray-700 text-white placeholder-gray-400 ${
                shakeFeedbackOn ? "animate-shake" : ""
              }`}
              value={questionText}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Ask a question..."
              ref={questionInputRef}
            />
            <button
              className="py-2 px-6 rounded-lg bg-blue-500 text-white"
              type="submit"
            >
              Send
            </button>
          </form>
          <p className="text-sm mt-3 text-gray-400">
            This question will cost roughly {questionCost} Satoshis
          </p>
        </div>
      </div>
    </>
  );
}

"use client"
import { useEffect, useRef, useState } from "react"
import { FaGithub, FaTwitter } from "react-icons/fa"
import { ChatMessage } from "chatgpt"
import Head from "next/head"
import { WebLNProvider, requestProvider } from "webln"
import { useQRCode } from "next-qrcode"
import Modal from "./components/modals/Modal"
import { LightningInvoice } from "./components/models/lightningModels"
import {
  checkInvoicePaid,
  createInvoice,
  getTimestamp,
} from "./components/controllers/lightningClient"
import { useChat } from "ai/react"
import { getUUID } from "./components/controllers/getId"
import SessionTimer from "./components/views/SessionTimer"

export default function Home() {
  // -------------- STATE ---------------------------
  const [webln, setWebln] = useState<null | WebLNProvider>(null)
  const [lightningInvoice, setLightningInvoice] =
    useState<null | LightningInvoice>(null)
  const [shakeFeedbackOn, setShakeFeedbackOn] = useState(false)
  const [userUUID, setUserUUID] = useState<string | null>(null)
  const [timestamp, setTimestamp] = useState<number>(0)
  const invoiceIntervalRef = useRef<NodeJS.Timer | null>(null)

  const { Canvas } = useQRCode()
  const questionInputRef = useRef<HTMLTextAreaElement>(null)
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    body: { uuid: userUUID },
  })

  // -------------- EFFECTS ---------------------------

  useEffect(() => {
    requestProvider()
      .then(setWebln)
      .catch(e => {
        console.log("No LN Provider")
      })
  }, [])

  useEffect(() => {
    return () => {
      if (invoiceIntervalRef.current) {
        clearInterval(invoiceIntervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserUUID(getUUID())
    }
  }, [])

  useEffect(() => {
    if (userUUID) {
      getTimestamp(userUUID).then(setTimestamp)
    }
  }, [userUUID])

  // -------------- FUNCTIONS ---------------------------

  const shake = () => {
    if (shakeFeedbackOn) return
    setShakeFeedbackOn(true)
    setTimeout(() => setShakeFeedbackOn(false), 555)
  }

  // ------------ HANDLERS -------------------

  const handleSendMessage = (e: any) => {
    e.preventDefault()

    if (!input) {
      shake()
      return
    }

    handleSubmit(e)
  }

  const buyMoreTime = () => {
    if (!lightningInvoice && userUUID) {
      createInvoice({
        amount: Number(process.env.NEXT_PUBLIC_SESSION_COST),
        memo: "Lightning-GPT",
        uuid: userUUID,
        // expiry: 30, //seconds
      }).then(invoice => {
        setLightningInvoice(invoice)
        const interval = setInterval(() => {
          checkInvoicePaid(invoice).then(isPaid => {
            if (isPaid) {
              setLightningInvoice(null)
              getTimestamp(userUUID).then(setTimestamp)
              if (invoiceIntervalRef.current) {
                clearInterval(invoiceIntervalRef.current)
                invoiceIntervalRef.current = null
              }
            }
          })
        }, 1000)
        invoiceIntervalRef.current = interval // Store the interval in the ref

        if (webln) {
          webln.sendPayment(invoice.invoice)
        }
      })
    }
  }

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

      <div className="flex flex-col h-screen text-white bg-gray-900">
        {/* Socials */}
        <div
          className="absolute z-0 text-5xl text-white transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 text-opacity-10"
          style={{ top: "calc(50% - 5vh)" }}>
          Lightning-GPT
        </div>

        {/* Socials */}

        <div className="absolute h-screen text-white bg-gray-900">
          {/* Icons Section */}
          <div className="absolute space-x-4 top-4 left-4">
            <a
              href="https://github.com/CoachChuckFF/Solana-GPT"
              target="_blank"
              rel="noopener noreferrer">
              <FaGithub className="text-2xl text-white cursor-pointer hover:text-blue-500" />
            </a>
            <a
              href="https://twitter.com/CoachChuckFF"
              target="_blank"
              rel="noopener noreferrer">
              <FaTwitter className="text-2xl text-white cursor-pointer hover:text-blue-500" />
            </a>
          </div>
        </div>

        {/* Loader Overlay
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <p className="text-5xl animate-pulse">Loading...</p>
          </div>
        )} */}

        {/* Loader Overlay */}
        {lightningInvoice && (
          <Modal isOpen={true}>
            <div className="flex flex-col items-center justify-center gap-4">
              <p className="flex-wrap mx-auto font-semibold text-center w-72">
                Scan the Qrcode and complete the payment to access your answer.
              </p>
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
              {process.env.NEXT_PUBLIC_SESSION_COST} satoshis ( Waiting for
              Payment ){/* <p></p> */}
              {/* <button className="px-6 py-2 text-white bg-blue-500 rounded-lg" onClick={checkPayment}>Check Payment</button> */}
            </div>
          </Modal>
        )}

        {/* Chat Section */}

        <div className="flex-grow overflow-auto space-y-4 flex items-center justify-center h-[80vh] z-1">
          <div className="w-full h-full px-32 pr-64 overflow-y-auto">
            {messages.map((message: any, index: number) => (
              <div
                key={index}
                className={`my-5 mx-4 p-3 rounded-lg w-fit max-w-md ${
                  message.role === "user"
                    ? "ml-auto text-right bg-blue-500 text-white"
                    : "mr-auto bg-gray-700 text-white"
                }`}>
                <p className="text-base whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Input Section */}
        <div className="flex flex-col items-center px-4 pb-2 bg-gray-800 border-t-2 border-gray-700 z-2">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center justify-between w-full mt-5">
            <textarea
              maxLength={4000}
              style={{ height: "18vh" }}
              className={`border-2 border-gray-600 rounded-lg flex-grow mr-4 py-2 px-4 bg-gray-700 text-white placeholder-gray-400 ${
                shakeFeedbackOn ? "animate-shake" : ""
              }`}
              value={input}
              onChange={handleInputChange}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(e)
                }
              }}
              placeholder="Ask a question..."
              ref={questionInputRef}
            />
            <div className="flex flex-col gap-2">
              <SessionTimer
                timestamp={timestamp}
                buyMoreTime={buyMoreTime}
                durationMS={Number(process.env.NEXT_PUBLIC_SESSION_TIME)}
              />
            </div>
          </form>
          <p className="mt-3 text-sm text-gray-400">
            Each{" "}
            {(Number(process.env.NEXT_PUBLIC_SESSION_TIME) / 1000 / 60).toFixed(
              0
            )}{" "}
            min will cost {process.env.NEXT_PUBLIC_SESSION_COST} sats
          </p>
        </div>
      </div>
    </>
  )
}

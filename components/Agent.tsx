"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
    INACTIVE = "INACTIVE",
    CONNECTING = "CONNECTING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED",
  }
  interface SavedMessage {
    role: "user" | "system" | "assistant";
    content: string;
  }

const Agent = ({userName,userId,type,interviewId,questions}:AgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE); //At starting point call status is false
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  // const [lastMessage, setLastMessage] = useState<string>("");
  

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED); 
    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {    //A transcript is typically a record of spoken words converted into text.
      const newMessage = { role: message.role, content: message.transcript };
      setMessages((prev) => [...prev, newMessage]);
      } 
    };
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => {
      console.log("Error:", error);
    };

    // Vapi Event Listner
    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  
  },[]);


  useEffect(()=>{
    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        handleGenerateFeedback(messages);
      }
    }
  },[messages, callStatus,interviewId, router, type, userId])


  const handleGenerateFeedback = async(messages:SavedMessage[]) => {
    console.log('Generate Feedback here')

    //TODO: Generates a feedback
    const { success, feedbackId: id } = await createFeedback({
      interviewId: interviewId!,
      userId: userId!,
      transcript: messages,
    });
    if (success && id) {
      router.push(`/interview/${interviewId}/feedback`);
    } else {
      console.log("Error saving feedback");
      router.push("/");
    }
    
  }
   const handleCall = async()=>{
    try{
    setCallStatus(CallStatus.CONNECTING);
    if(type === 'generate'){
    const workflowId = process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID;
    if (!workflowId) {
      console.error("VAPI Workflow ID is not working Properly.");
      return;
    }
    await vapi.start(workflowId, {
      variableValues: {
        username: userName,
        userid: userId,
      },
    });
  }else{
    let formattedQuestions = "";
      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
    }
    await vapi.start(interviewer,{
      variableValues:{
        questions:formattedQuestions,
      },
    })
  }
  }catch(error){
    console.error("Failed to start the call:", error);
    setCallStatus(CallStatus.INACTIVE);
  }
  }

  const handleDisconnect = async()=>{
    try {
      setCallStatus(CallStatus.FINISHED);
      await vapi.stop();
    } catch (error) {
      console.error("Failed to disconnect the call:", error);
    }
  }

  const lastMessage = messages[messages.length - 1]?.content;
  const isCallInactiveOrFinished = callStatus===CallStatus.INACTIVE || callStatus===CallStatus.FINISHED;


  return (
    <> 
  
    <div className="call-view">
      {/* AI Interviewer Card */}
      <div className="card-interviewer">
        <div className="avatar">
          <Image
            src="/ai-avatar.png"
            alt="profile-image"
            width={65}
            height={54}
            className="object-cover"
          />
          {isSpeaking && <span className="animate-speak" />}
        </div>
        <h3>AI Interviewer</h3>
      </div>

      {/* User Profile Card */}
      <div className="card-border">
        <div className="card-content">
          <Image
            src="/user-avatar.png"
            alt="profile-image"
            width={539}
            height={539}
            className="rounded-full object-cover w-30 h-30"
          />
          <h3>{userName}</h3>
        </div>
      </div>
    </div>
      

    {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

    <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
            <button className="relative btn-call" onClick={handleCall}>
                <span className={cn("absolute animate-ping rounded-full opacity-75",callStatus !== "CONNECTING" && "hidden" )}/>
                
                <span className="realtive">
                     {/* {callStatus === "INACTIVE" || callStatus === "FINISHED" ? "Call" : " . . ."} */}
                     {isCallInactiveOrFinished ? 'Call' : '. . .'}
                </span>
            </button>
        ):(
            <button className="btn-disconnect" onClick={handleDisconnect}>
                End
            </button>
        )}

    </div>

    </>
   
  );
};

export default Agent;

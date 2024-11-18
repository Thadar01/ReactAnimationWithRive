import { useRive,useStateMachineInput } from "@rive-app/react-canvas";
import {  useState,useEffect, useRef } from "react";
import { museum } from "./museum";
import { Howl } from "howler";

const LargeClassroom = () => {
  const {rive, RiveComponent} = useRive({
    src: "/wideclassroom.riv",
    artboard: "Artboard",
    stateMachines: "State Machine 1",
    autoplay: true,
   
  });

  const [id,setId]=useState(0)
  const audioRef=useRef(null)
  const currentId=useRef(0)
  const [start,setStart]=useState(false)
  const teacherTalk = useStateMachineInput(rive, "State Machine 1", "isTeacherTalk");
  const studentTalk = useStateMachineInput(rive, "State Machine 1", "isStudentTalk");
  const teacherBox = useStateMachineInput(rive, "State Machine 1", "isTeacherBox");

  useEffect(()=>{
    if(rive){
        const currentConversation=museum[id]
        const teacherWord=currentConversation.teacher


        const teacherAudio = () => {
            currentId.current= id;
            const conversation = museum[ currentId.current];
            
            if (conversation.teacherVoice) {
              if (audioRef.current) {
                audioRef.current.stop();
              }
              console.log(conversation.teacherVoice)
              audioRef.current = new Howl({
                src: [conversation.teacherVoice],
                volume: 0.8,
                onload: () => {
                  audioRef.current.play();
                  
                },
              
               onplay:()=>{
               teacherBox.value=true
               teacherTalk.value=true
  
              },
              onend:()=>{
               
                teacherTalk.value=false
                teacherBox.value=false
              },
                onloaderror: (_, error) => {
                  console.error("Error loading audio:", error);
                },
              });
            }
          };
        const studentAudio = () => {
            currentId.current= id;
            const conversation = museum[ currentId.current];
            
            if (conversation.studentVoice) {
              if (audioRef.current) {
                audioRef.current.stop();
              }
              
              audioRef.current = new Howl({
                src: [conversation.studentVoice],
                volume: 0.8,
                onload: () => {
                  audioRef.current.play();
                  
                },
              
               onplay:()=>{
              studentTalk.value=true
  
              },
              onend:()=>{
               
  
               studentTalk.value=false
              },
                onloaderror: (_, error) => {
                  console.error("Error loading audio:", error);
                },
              });
            }
          };
          
          setTimeout(teacherAudio(),1000)
        rive.setTextRunValue("TeacherRun", teacherWord);

    }
  },[rive,teacherTalk,studentTalk,teacherBox,id])



  
  return (
<div style={{ width: '1000px', height: '700px' }}>
    {start &&     <RiveComponent style={{ width: '100%', height: '100%' }}  />
}
{start===false && <button onClick={()=>setStart(true)}>Start</button>}
  </div>  );
};

export default LargeClassroom
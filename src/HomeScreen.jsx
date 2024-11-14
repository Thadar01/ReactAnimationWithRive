import React, { useEffect, useState, useRef } from "react";
import { Howl } from "howler";
import { conversation } from "./data";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";

const HomeScreen = () => {
  const { rive, RiveComponent } = useRive({
    src: "/conversation.riv",
    artboard: "ConversationArtBoard",
    stateMachines: "StateMachine1",
    autoplay: true,
    onStateChange:(event)=>{
      console.log(event.data)
    }
  });

  const [currentId, setCurrentId] = useState(0);
  const [isAudioAllowed, setIsAudioAllowed] = useState(false);
  const audioRef = useRef(null);
  const id=useRef(null)
  const handleAnswer = (option) => {
    setCurrentId(option.next);
  };

  const boxDisappear = useStateMachineInput(rive, "StateMachine1", "CloseChosen");
  const boyBox = useStateMachineInput(rive, "StateMachine1", "BoyBox");

  const handleUserInteraction = () => {
    setIsAudioAllowed(!isAudioAllowed);
  };
  console.log(audioRef.current?._src)

  useEffect(() => {

    if (rive) {
      const currentConversation = conversation[currentId];
      const playAudio = () => {
        id.current=currentId;
        console.log("refid",id.current)
        const con=conversation[id.current];
        if (con.audio && isAudioAllowed) {
          if (audioRef.current) {
            audioRef.current.stop();
          }

          audioRef.current = new Howl({
            src: [con.audio],
            volume: 0.8,
            onload: () => {
              console.log("Audio loaded successfully");
              audioRef.current.play();
            },
            onloaderror: (_, error) => {
              console.error("Error loading audio:", error);
            },
          });
        }
        console.log(currentConversation.id)
      };
    

      if (currentConversation.id === 6 || currentConversation.id === 5) {
        rive.setTextRunValue("BoyRun", currentConversation.bot);
        if (boxDisappear) boxDisappear.value = true;
        playAudio(); 
        console.log(`Current ID: ${currentId}`); // Add this line to debug

      } else {
        rive.setTextRunValue("BoyRun", currentConversation.bot);
        const chosenA = currentConversation.option[0].ans;
        const chosenB = currentConversation.option[1].ans;
        rive.setTextRunValue("ChosenARun", chosenA);
        rive.setTextRunValue("ChosenBRun", chosenB);

        rive.on("statechange", (event) => {
          if (event.data[0] === "ChooseA") {
            handleAnswer(currentConversation.option[0]);
          } else if (event.data[0] === "ChooseB") {
            handleAnswer(currentConversation.option[1]);
          }else if (event.data[0]==="Timeline 1"){
            playAudio()
          }

        });
      }
      playAudio()

    }
  }, [rive, currentId, boyBox?.value, isAudioAllowed, boxDisappear]);

  return (
    <div
      style={{ width: "1000px", height: "700px", display: 'flex', flexDirection: 'row' }}
      onClick={handleUserInteraction}
    >
      <RiveComponent style={{ width: "100%", height: "100%" }} />
      <button onClick={handleUserInteraction} style={{ height: "100px" }}>
        Allow Audio
      </button>
    </div>
  );
};

export default HomeScreen;

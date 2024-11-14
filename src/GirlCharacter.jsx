import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { useEffect, useState } from "react";

const GirlCharacter = () => {
  const { rive, RiveComponent } = useRive({
    src: "/newcharacter.riv",
    artboard: "Artboard",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  const [activeEmotion, setActiveEmotion] = useState("");
  const [isMove,setIsMove]=useState(false)


  const happy = useStateMachineInput(rive, "State Machine 1", "isHappy");
  const sad = useStateMachineInput(rive, "State Machine 1", "isSad");
  const disgust = useStateMachineInput(rive, "State Machine 1", "isDisgust");
  const happyTalk = useStateMachineInput(rive, "State Machine 1", "isHappyTalk");
  const sadTalk = useStateMachineInput(rive, "State Machine 1", "isSadTalk");
  const disgustTalk = useStateMachineInput(rive, "State Machine 1", "isDisgustTalk");
  const headMove=useStateMachineInput(rive, "State Machine 1", "isHeadMove");

  const handleEmotionClick = (emotion) => {
    setActiveEmotion(emotion);
  };
  useEffect(() => {
    if (headMove) {
      headMove.value = isMove;
    }
  }, [isMove, headMove]);
  useEffect(() => {
    if (rive) {

      if (happy) happy.value = activeEmotion === "isHappy";
      if (sad) sad.value = activeEmotion === "isSad";
      if (disgust) disgust.value = activeEmotion === "isDisgust";
      if (happyTalk) happyTalk.value = activeEmotion === "isHappyTalk";
      if (sadTalk) sadTalk.value = activeEmotion === "isSadTalk";
      if (disgustTalk) disgustTalk.value = activeEmotion === "isDisgustTalk";
     

    }
  }, [activeEmotion, rive, happy, sad, disgust, happyTalk, sadTalk, disgustTalk]);

  return (
    <div style={{ width: '1000px', height: '700px', display: "flex" }}>
      <RiveComponent style={{ width: '100%', height: '100%' }} />
      <div style={{ display: "flex", gap: 20, flexDirection: 'column' }}>
        <button onClick={() => handleEmotionClick("isHappy")}>Happy</button>
        <button onClick={() => handleEmotionClick("isSad")}>Sad</button>
        <button onClick={() => handleEmotionClick("isDisgust")}>Disgust</button>
        <button onClick={() => handleEmotionClick("isHappyTalk")}>Happy Talk</button>
        <button onClick={() => handleEmotionClick("isSadTalk")}>Sad Talk</button>
        <button onClick={() => handleEmotionClick("isDisgustTalk")}>Disgust Talk</button>
        <button onClick={() => setIsMove(!isMove)}>Move Head</button>

      </div>
    </div>
  );
};

export default GirlCharacter;

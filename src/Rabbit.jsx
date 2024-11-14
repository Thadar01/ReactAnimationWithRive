import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { useEffect, useState } from "react";

const Rabbit
 = () => {
  const { rive, RiveComponent } = useRive({
    src: "/newcharacter.riv",
    artboard: "RabbitArtBoard",
    stateMachines: "State Machine 1",
    autoplay: true,
  });

  const [activeEmotion, setActiveEmotion] = useState("");


  const happy = useStateMachineInput(rive, "State Machine 1", "IsHappy");
  const sad = useStateMachineInput(rive, "State Machine 1", "IsSad");
  const angry = useStateMachineInput(rive, "State Machine 1", "IsAngry");
  const happyTalk = useStateMachineInput(rive, "State Machine 1", "HappyTalk");
  const sadTalk = useStateMachineInput(rive, "State Machine 1", "SadTalk");
  const angryTalk = useStateMachineInput(rive, "State Machine 1", "AngryTalk");
  const moveBody=useStateMachineInput(rive, "State Machine 1", "isBodyMove");

  const handleEmotionClick = (emotion) => {
    setActiveEmotion(emotion);
  };

  useEffect(() => {
    if (rive) {

      if (happy) happy.value = activeEmotion === "IsHappy";
      if (sad) sad.value = activeEmotion === "IsSad";
      if (angry) angry.value = activeEmotion === "IsAngry";
      if (happyTalk) happyTalk.value = activeEmotion === "HappyTalk";
      if (sadTalk) sadTalk.value = activeEmotion === "SadTalk";
      if (angryTalk) angryTalk.value = activeEmotion === "AngryTalk";
      if(moveBody)moveBody.value=true;
     

    }
  }, [activeEmotion, rive, happy, sad, angry, happyTalk, sadTalk, angryTalk,moveBody]);

  return (
    <div style={{ width: '1000px', height: '700px', display: "flex" }}>
      <RiveComponent style={{ width: '100%', height: '100%' }} />
      <div style={{ display: "flex", gap: 20, flexDirection: 'column' }}>
        <button onClick={() => handleEmotionClick("IsHappy")}>Happy</button>
        <button onClick={() => handleEmotionClick("IsSad")}>Sad</button>
        <button onClick={() => handleEmotionClick("IsAngry")}>Angry</button>
        <button onClick={() => handleEmotionClick("HappyTalk")}>Happy Talk</button>
        <button onClick={() => handleEmotionClick("SadTalk")}>Sad Talk</button>
        <button onClick={() => handleEmotionClick("AngryTalk")}>Angry Talk</button>

      </div>
    </div>
  );
};

export default Rabbit
;

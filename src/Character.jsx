import { useRive } from "@rive-app/react-canvas";

const Character = () => {
  const {rive, RiveComponent} = useRive({
    src: "/charactercreation.riv",
    artboard: "CharacterArtBoard",
    stateMachines: "State Machine 1",
    autoplay: true,
   
  });



  
  return (
<div style={{ width: '1000px', height: '700px' }}>
    <RiveComponent style={{ width: '100%', height: '100%' }}  />
  </div>  );
};

export default Character
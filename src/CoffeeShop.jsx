import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { useEffect,useState,useRef } from "react";
import { coffeeShopConversation } from "./conData";
import { Howl } from "howler";
import "./Cafe.css"; 

const CoffeeShop
 = () => {
  const { rive, RiveComponent } = useRive({
    src: "/cafefullanimation.riv",
    artboard: "CafeArtBoard",
    stateMachines: "State Machine 1",
    autoplay: true,
    onStateChange:(event)=>{
      console.log(event.data)
    },  });

  const [currentId, setCurrentId] = useState(0);
  const [start,setIsStart]=useState(false)
  const audioRef = useRef(null); 
  const id = useRef(0);

  const isWalkStop= useStateMachineInput(rive,"State Machine 1", "isStop");
  const isCafeTalk= useStateMachineInput(rive,"State Machine 1", "CGirlTalk");
  const isCafeBox= useStateMachineInput(rive,"State Machine 1", "isCafeBox");
  const isCustomerBox= useStateMachineInput(rive,"State Machine 1", "isCustomerBox");
  const isCustomerBox2= useStateMachineInput(rive,"State Machine 1", "isCustomerBox2");
  const isChosenBox=useStateMachineInput(rive,"State Machine 1","isChosen")
  const isCustomerMove=useStateMachineInput(rive,"State Machine 1","isCutstomerMove")
  const choosea=useStateMachineInput(rive,"State Machine 1","ChooseA")
  const chooseb=useStateMachineInput(rive,"State Machine 1","ChooseB")



  useEffect(()=>{
   console.log(currentId)
    if(rive){
      const currentConversation = coffeeShopConversation[currentId];
      const cafe = currentConversation.staff;
      const customer = currentConversation.customer;
      const customerchoice1=currentConversation.customerChoice1;
      const customerchoice2=currentConversation.customerChoice2;

      // const playAudio = () => {
      //   id.current = currentId;
      //   const conversation = coffeeShopConversation[id.current];
        
      //   if (conversation.staffVoice) {
      //     if (audioRef.current) {
      //       audioRef.current.stop();
      //     }
          
      //     audioRef.current = new Howl({
      //       src: [conversation.staffVoice],
      //       volume: 0.8,
      //       onload: () => {
      //         audioRef.current.play();
              
      //       },
          
      //      onplay:()=>{
      //       isCafeTalk.value=true
      //       isChosenBox.value=false
      //       choosea.value=false
      //       choosea.value=false
      //       isCustomerBox.value=false
      //     },
      //     onend:()=>{
      //       isCafeTalk.value=false
      //       customerAudio()
      //       if(currentId!==7){isChosenBox.value=true}
      //     },
      //       onloaderror: (_, error) => {
      //         console.error("Error loading audio:", error);
      //       },
      //     });
      //   }
      // };
    
      // const customerAudio = () => {
      //   id.current = currentId;
      //   const conversation = coffeeShopConversation[id.current];
      //   if (conversation.customerVoice) {
      //     if (audioRef.current) {
      //       audioRef.current.stop();
      //     }
      //     audioRef.current = new Howl({
      //       src: [conversation.customerVoice],
      //       volume: 0.8,
      //       onload: () => {
      //         console.log("Audio loaded successfully");
      //         audioRef.current.play();
      //       },
           
      //       onloaderror: (_, error) => {
      //         console.error("Error loading audio:", error);
      //       },
      //     });
      //   }
      // };

      // if(currentId===0){
      //   setTimeout(()=>playAudio(),2000)
      // }else{
      //   playAudio()
      // }
  
       if(isWalkStop && isCafeTalk && isCustomerBox && isCustomerBox2){
        if(currentConversation.id === 7){
          isCustomerBox.value=false
          isChosenBox.value=true

          setTimeout(()=>isCafeBox.value=false,5000)
        }else if(currentConversation.id !== 7){
          console.log("not7")
          setTimeout(()=>{
            isWalkStop.value=true
            isCafeBox.value=true
            isCustomerMove.value=true
          },2000)
      
      
        }
       

      
        }
       

        rive.setTextRunValue("CafeGirlRun", cafe);
        rive.setTextRunValue("CustomerRun", customer);
        rive.setTextRunValue("ChosenARun", customerchoice1);

        // rive.on("statechange", (event) => {
        //   if (event.data[0] === "ChooseA") {
        //     const userChosenA=rive.getTextRunValue('ChosenARun')
        //     console.log("chooseARun",userChosenA);
        //     if(userChosenA===customer && currentId!==7){
        //       setCurrentId(currentId+1)
              
        //     }
           
        //   }
        //   if (event.data[0] === "ChooseB") {
        //     const userChosenB=rive.getTextRunValue('ChosenBRun')

        //     console.log("chooseBRun",userChosenB)
        //     if(userChosenB===customer && currentId!==7){
        //       setCurrentId(currentId+1)
             

        //     }
        //   }

         
        // });

        
  }
  },[rive,isWalkStop,isCafeTalk,isCafeBox,isCustomerBox,currentId,isChosenBox,isCustomerBox2])


 



  
  return (
    <div className="container">
      {!start &&             <button onClick={()=>setIsStart(true)} style={{width:100,height:30}}>Start</button>
    }
      {start &&    <> <RiveComponent style={{ width: '100%', height: '90%' }} />
     </>  
    }

    
    
    </div>
  );
};

export default CoffeeShop
;

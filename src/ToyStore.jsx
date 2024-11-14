import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { useEffect, useRef, useState } from "react";
import { toyShopConversation,customerConversation } from "./toyData";
import { Howl } from "howler";

const ToyStore = () => {
  const { rive, RiveComponent } = useRive({
    src: "./toystoreanimation.riv",
    artboard: "ToyStoreArtBoard",
    stateMachines: "State Machine 1",
    autoplay: true,
    onStateChange: (event) => {
      console.log(event.data);
    },
  });

const [cutsomerId,setCustomerId]=useState(0)
const [rabbitId,setRabbitId]=useState(0)
const [customerStatus,setCustomerStatus]=useState(false)
const [rabbitStatus,setRabbitStatus]=useState(false)
const audioRef = useRef(null); 
const currentRabbitId=useRef(0)
const currentCustomerId=useRef(0)



  const GirlBox = useStateMachineInput(rive, "State Machine 1", "isGirlBox");
  const RabbitBox = useStateMachineInput(rive, "State Machine 1", "isRabbitBox");
  const CustomerBox = useStateMachineInput(rive, "State Machine 1", "isCustomerBox");
  const RabbitTalk = useStateMachineInput(rive, "State Machine 1", "RabbitTalk");
  const CustomerTalk = useStateMachineInput(rive, "State Machine 1", "customerTalk");


  useEffect(() => {
    if (rive && RabbitBox && GirlBox && CustomerBox) {

        const currentRabbitCon=toyShopConversation[rabbitId];
        const currentCustomerCon=customerConversation[cutsomerId];

        const rabbit=currentRabbitCon.staff;
        const customer=currentCustomerCon.customer1;
        const girl1=currentRabbitCon.customer;
        const girl2=currentCustomerCon.customer2;
       
        const rabbitAudio = () => {
          currentRabbitId.current= rabbitId;
          const conversation = toyShopConversation[ currentRabbitId.current];
          
          if (conversation.staffVoice) {
            if (audioRef.current) {
              audioRef.current.stop();
            }
            
            audioRef.current = new Howl({
              src: [conversation.staffVoice],
              volume: 0.8,
              onload: () => {
                audioRef.current.play();
                
              },
            
             onplay:()=>{
              RabbitBox.value=true
              GirlBox.value=false;
              RabbitTalk.value=true

            },
            onend:()=>{
              setTimeout(()=>girlAudio(),1000)

              RabbitBox.value=false
              RabbitTalk.value=false
            },
              onloaderror: (_, error) => {
                console.error("Error loading audio:", error);
              },
            });
          }
        };
        const girlAudio = () => {
          currentRabbitId.current= rabbitId;
          currentCustomerId.current=cutsomerId
          const rabbitCon = toyShopConversation[ currentRabbitId.current];
          const customerCon=customerConversation[currentCustomerId.current];
    
          if(customerStatus){
            if (customerCon.customer2Voice) {
              if (audioRef.current || rabbitStatus) {
                audioRef.current.stop();
              }
              
              audioRef.current = new Howl({
                src: [customerCon.customer2Voice],
                volume: 0.8,
                onload: () => {
                  audioRef.current.play();
                  
                },
              
               onplay:()=>{
                GirlBox.value=true
            
              },
              onend:()=>{
                if(cutsomerId===4){
                  setCustomerId(cutsomerId+1)
                }              },
                onloaderror: (_, error) => {
                  console.error("Error loading audio:", error);
                },
              });
            }
          }else if(rabbitStatus){
            if (rabbitCon.customerVoice) {
              if (audioRef.current || customerStatus) {
                audioRef.current.stop();
              }
              
              audioRef.current = new Howl({
                src: [rabbitCon.customerVoice],
                volume: 0.8,
                onload: () => {
                  audioRef.current.play();
                  
                },
              
               onplay:()=>{
                  GirlBox.value=true
              },
              onend:()=>{
                if(rabbitId===7){
                setRabbitId(rabbitId+1)
                }               },
                onloaderror: (_, error) => {
                  console.error("Error loading audio:", error);
                },
              });
            }
          }
          
         
        };
        const customerAudio = () => {
          currentCustomerId.current= cutsomerId;
          const conversation = customerConversation[ currentCustomerId.current];
          
          if (conversation.customer1Voice) {
            if (audioRef.current) {
              audioRef.current.stop();
            }
            
            audioRef.current = new Howl({
              src: [conversation.customer1Voice],
              volume: 0.8,
              onload: () => {
                audioRef.current.play();
                
              },
            
             onplay:()=>{
                CustomerBox.value=true;
                GirlBox.value=false;
                CustomerTalk.value=true;
                
            },
            onend:()=>{
              setTimeout(()=>girlAudio(),1000)
              CustomerBox.value=false
              CustomerTalk.value=false
             
            },
              onloaderror: (_, error) => {
                console.error("Error loading audio:", error);
              },
            });
          }
        };

        rive.setTextRunValue("RabbitRun", rabbit);
        rive.setTextRunValue("CustomerRun", customer);
       if( rabbitStatus && rabbitId !== 8 ){

        rive.setTextRunValue("GirlRun", girl1);
        setTimeout(()=>rabbitAudio(),1000)
        // rabbitAudio()

       }else if(  customerStatus && cutsomerId!==5){
        rive.setTextRunValue("GirlRun", girl2);
        setTimeout(()=>customerAudio(),1000)

        // customerAudio()

       }

 

      const handleStateChange = (event) => {
        if (event.data && (event.data.find (item=>item==="0toRabbit") || event.data.find (item=>item==="cutsomertoRabbit"))) {
          console.log("i am here")
            setRabbitStatus(true)
            setCustomerStatus(false)
            CustomerBox.value=false
            CustomerTalk.value=false
            if(rabbitId===8){
              RabbitBox.value=false;
              GirlBox.value=false;

            }
         
        }
        if (event.data && (event.data[0] === "0toCustomer" || event.data[0] === "RabbitToCustomer")) {
            RabbitBox.value = false;  

            setCustomerStatus(true)
            setRabbitStatus(false)  
            RabbitBox.value=false
            RabbitTalk.value=false
            if(cutsomerId===5){
              CustomerBox.value=false; 
              GirlBox.value=false;

            }

          // setTimeout(() => {
          //   CustomerBox.value = true;
          // }, 500);
        }

        if(event.data && event.data[0]==="next"){
          GirlBox.value=false

          if(customerStatus && cutsomerId!==5){
            setCustomerId(cutsomerId+1)


          }else if(rabbitStatus && rabbitId!==8){
            setRabbitId(rabbitId+1)
          

          }
        }

      };

      rive.on("statechange", handleStateChange);

      return () => {
        rive.off("statechange", handleStateChange);
      };
    }
  }, [rive, GirlBox, RabbitBox, CustomerBox,rabbitId,cutsomerId,customerStatus,rabbitStatus,CustomerTalk,RabbitTalk]);

  return (
    <div style={{ width: "1000px", height: "700px" }}>
      <RiveComponent style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default ToyStore;

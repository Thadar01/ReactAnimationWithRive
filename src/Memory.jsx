import { useRive, useStateMachineInput } from "@rive-app/react-canvas";
import { useEffect, useRef } from "react";

const Memory = () => {
  const { rive, RiveComponent } = useRive({
    src: "/memorytesting.riv",
    artboard: "MemoryArtboard",
    stateMachines: "State Machine 2",
    autoplay: true,
  });

  const inputs = [
    useStateMachineInput(rive, "State Machine 2", "card1close"),
    useStateMachineInput(rive, "State Machine 2", "card2close"),
    useStateMachineInput(rive, "State Machine 2", "card3close"),
    useStateMachineInput(rive, "State Machine 2", "card4close"),
    useStateMachineInput(rive, "State Machine 2", "card5close"),
    useStateMachineInput(rive, "State Machine 2", "card6close"),
  ];
  const disappears = [
    useStateMachineInput(rive, "State Machine 2", "disappear1"),
    useStateMachineInput(rive, "State Machine 2", "disappear2"),
    useStateMachineInput(rive, "State Machine 2", "disappear3"),
    useStateMachineInput(rive, "State Machine 2", "disappear4"),
    useStateMachineInput(rive, "State Machine 2", "disappear5"),
    useStateMachineInput(rive, "State Machine 2", "disappear6"),
  ];


  const data = [
    { id: 1, text: "apple" },
    { id: 2, text: "orange" },
    { id: 3, text: "apple" },
    { id: 4, text: "grape" },
    { id: 5, text: "orange" },
    { id: 6, text: "grape" },
  ];

  const run = [
    "card1Run",
    "card2Run",
    "card3Run",
    "card4Run",
    "card5Run",
    "card6Run",
  ];

  const openedCards = useRef([]); 

  useEffect(() => {
    if (rive && inputs.every((input) => input)) {
     
      setTimeout(() => {
        inputs.forEach((input) => (input.value = true));
      }, 5000);

      data.forEach((item, i) => {
        if (rive && run[i]) {
          rive.setTextRunValue(run[i], item.text);
        }
      });

      // Listen for state changes
      rive.on("statechange", (event) => {
        const cardMapping = {
          openCard1: { data: data[0], input: inputs[0],disappear:disappears[0] },
          openCard2: { data: data[1], input: inputs[1],disappear:disappears[1] },
          openCard3: { data: data[2], input: inputs[2] ,disappear:disappears[2]},
          openCard4: { data: data[3], input: inputs[3],disappear:disappears[3] },
          openCard5: { data: data[4], input: inputs[4],disappear:disappears[4] },
          openCard6: { data: data[5], input: inputs[5],disappear:disappears[5] },
        };

        const openedCard = cardMapping[event.data[0]];
        if (openedCard) {
          if (
            !openedCards.current.some(
              (card) => card.data.id === openedCard.data.id
            )
          ) {
            openedCards.current.push(openedCard);
            if (openedCards.current.length > 2) {
              openedCards.current.shift();
            }

            console.log("Opened cards:", openedCards.current);
            if (openedCards.current.length === 2) {
              const [firstCard, secondCard] = openedCards.current;

              if (firstCard.data.text === secondCard.data.text) {
                console.log("Match found:", firstCard.data, secondCard.data);
                setTimeout(() => {
                    firstCard.disappear.value = true;
                    secondCard.disappear.value = true; 
                    openedCards.current = []; 
                  }, 1000);
              } else {
                console.log("No match:", firstCard.data, secondCard.data);

                setTimeout(() => {
                  firstCard.input.value = true;
                  secondCard.input.value = true; 
                  openedCards.current = []; 
                }, 1000);
              }
            }
          }
        }
      });
    }
  }, [rive, inputs]);

  return (
    <div style={{ width: "1000px", height: "700px" }}>
      <RiveComponent style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default Memory;

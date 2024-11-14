export const conversation=[

    {
        id:0,
        bot:"What is 1 +1? ",
        option:[{ans:"2",next:1},{ans:"3",next:2}],
        audio:"/1+1.mp3"
        
    },
    {
        id:1,
        bot:"Great! Now,what is 2 +3? ",
        option:[{ans:"6",next:4},{ans:"5",next:3}],
        audio:"/Greate.mp3"

        
    }, {
        id:2,
        bot:"Wrong! It is 2. Now,what is 2 +3? ",
        option:[{ans:"6",next:4},{ans:"5",next:3}],
        audio:"/Wrong.mp3"

        
    }, {
        id:3,
        bot:"Corret! Now,what is 3 x 4? ",
        option:[{ans:"12",next:5},{ans:"20",next:6}],
        audio:"/correct.mp3"

        
    }, {
        id:4,
        bot:"Incorrect! Restart? ",
        option:[{ans:"Yes",next:0},{ans:"No",next:6}],
        audio:"/incorrect.mp3"

        
    },
    {
        id:5,
        bot:"Congratulation! ",

        audio:"/congrat.mp3"

        
    },
    {
        id:6,
        bot:"Try Again Later ",

        audio:"/try.mp3"

        
    },
]
import si from "systeminformation";
import dotenv from "dotenv";

dotenv.config();
const ACCESS_TOKEN=process.env.ACCESS_TOKEN;
const wingmates=[
    process.env.me,
    process.env.roommate
];
//function to send email using pushbullet
async function sendAlert(email){
    try{
        //api call
        const response=await fetch('https://api.pushbullet.com/v2/pushes',{
            method:'POST',
            headers:{
                'Access-Token':ACCESS_TOKEN,
                "Content-Type": 'application/json'
            },
            body:JSON.stringify({
                type:'note',
                email:email,
                title:'Battery full!!',
                body:"Sindhu's laptop is fully charged , please unplug  if you are around"
            })
        });
        if(response.ok){
            console.log(`Alert sent to ${email}`);
        }
    }
    catch(err){
        console.error(`Failed to send ${email}`);
    }
}
//check battery status and call sendAlert function 
//with delays of 1 minuite and 1 hour for regular and after sending the mail

async function monitor() {
   
    while (true) {
         let delay=60000;
        try{
            const battery = await si.battery();
            console.log(`Current charge: ${battery.percent}% | Plugged in: ${battery.isCharging}`);
            //smart polling logic

            if (battery.isCharging) {
                if (battery.percent >= 90) {
                  
                    delay = 10000; 
                } else {
                   
                    delay = 60000;
                }
            } else {
                if (battery.percent > 50) {
                  
                    delay = 300000; 
                } else if (battery.percent <= 20) {
                    
                    delay = 60000;
                }
            }
        if (battery.hasBattery && battery.percent >= 95 && battery.isCharging) {
            console.log("Battery above 95%! Notifying everyone...");
        for (const email of wingmates) {
            await sendAlert(email);
        }
        delay=3600000;
        }
 
        //wait for a minuite and then check for the battery status again
        await new Promise(r => setTimeout(r, delay));

        }
        catch(err){
            console.error(`error is ${err}`);
        }
       
  }
}
monitor();
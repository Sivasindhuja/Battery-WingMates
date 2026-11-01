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
            return true;
        }
        return false;
    }
    catch(err){
        console.error(`Failed to send ${email}`);
        return false;
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
                if (battery.percent < 95) {
                    delay = 60000; // 1 min while charging below threshold
                }
            } else {
                if (battery.percent <= 20) {
                    delay = 600000; // 10 mins (Reminder zone)
                } else if (battery.percent > 60 && battery.percent <= 90) {
                    delay = 2700000; // 45 mins (User's safe range)
                } else {
                    delay = 1800000; // 30 mins default unplugged
                }
            }
            if (battery.hasBattery && battery.percent >= 95 && battery.isCharging) {
                console.log("Battery above 95%! Notifying everyone...");
            let alerted = false;
            for (const email of wingmates) {
                if (await sendAlert(email)) {
                    alerted = true;
                }
            }
            if (alerted) {
                delay=3600000; // 1 hr cooldown after a successful alert
            }
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

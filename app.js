import si from "systeminformation";
import dotenv from "dotenv";

dotenv.config();
const ACCESS_TOKEN=process.env.ACCESS_TOKEN;
const wingmates=[
    process.env.me,
    process.env.roommate
];

async function sendAlert(email){
    try{
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

async function monitor() {
    console.log("Monitoring battery for the wing...");
    while (true) {
        try{
             const battery = await si.battery();
        console.log(`Current charge: ${battery.percent}% | Plugged in: ${battery.isCharging}`);
        if (battery.hasBattery && battery.percent >= 95 && battery.isCharging) {
            console.log("Battery 100%! Notifying everyone...");
        for (const email of wingmates) {
            await sendAlert(email);
        }
     
        await new Promise(r => setTimeout(r, 3600000));
        }
 
        
        await new Promise(r => setTimeout(r, 60000));

        }
        catch(err){
            console.error(`error is ${err}`);
        }
       
  }
}
monitor();
const { chromium } = require(process.env.PW);
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:960,height:288}});await p.goto('file://'+__dirname+'/frame.html');await p.waitForTimeout(400);await p.screenshot({path:__dirname+'/cover-'+process.argv[2]+'.png'});await b.close()})()

import { Webhook, MessageBuilder} from 'discord-webhook-node'
import fs from 'fs'
const hook = new Webhook("https://discord.com/api/webhooks/1373898806059470949/TpLuaBC5nf7wvytMBSZ_SKtKgjywDEUXg4yubDrlNEjY-6Tq03Od1CoP_c0p_wMIeBo8");
//hook.send('Hello! This message is sent from the framework! 🥳')


const reportFilePath = process.argv[2]

fs.readFile(reportFilePath, 'utf8', (err, data) => {
    if(err){
        console.log('An error occured during report file reading', err)
    } else {
        const report = JSON.parse(data)
        const durationInSecondes = (report.stats.duration / 1000).toFixed(2)

        let color = '#ff0000' //red
        if (report.stats.failures === 0){
            color = '#a6c900' //green
        }

        const message = new MessageBuilder()
        .setTitle('Test execution result:')
        .addField('Total executed tests 🧪 ', report.stats.tests)
        .addField('Total passed tests ✅ ', report.stats.passes)
        .addField('Total failed tests ❌ ', report.stats.failures)
        .addField('Pass percents 🥳', `${report.stats.passPercent}%`)
        .addField('Duration of the execution ⏱️', durationInSecondes)
        .setColor(color)


        hook.send(message)
    }
})

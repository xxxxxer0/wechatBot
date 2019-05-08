const Wechat = require('wechat4u')
const qrcode = require('qrcode-terminal');
const displayMsg = require('./modules/displayMsg')
let bot = new Wechat()
let contacts
 
bot.start()


if (bot.PROP.uin) {
    bot.restart();
} else {
    bot.start();
}

// 生成二维码
bot.on('uuid', uuid => {
    qrcode.generate('https://login.weixin.qq.com/l/' + uuid, {
        small: true
    });
    console.log('二维码链接：', 'https://login.weixin.qq.com/qrcode/' + uuid);
});


bot.on('login' , () => {
    console.log('登录成功')
    contacts = bot.contacts
})

bot.on('message', msg => {
    if( !msg.Content ) {
        return 
    }
    displayMsg(msg,contacts,bot)
})



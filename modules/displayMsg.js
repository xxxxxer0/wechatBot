const fs = require('fs')

function dispalyMsg(msg,contacts,bot) {
    let handelMessage = {}
    let fromUser = contacts[msg.FromUserName].NickName ,
        toUserName = contacts[msg.ToUserName].NickName ;
    //入口函数执行
    function main () {
        if(handelMessage[msg.MsgType]) {
            console.log(`${fromUser} to ${toUserName} : `)
            handelMessage[msg.MsgType]()
        }else {
            console.log(`**!!不支持的消息类型: ${msg.MsgType}!!**`)
        }
        
    }


    //文本类型消息
    handelMessage[bot.CONF.MSGTYPE_TEXT] = function () {
        if(msg.FromUserName.startsWith('@@')) {   //来自群聊
            parseGrounMember(msg,bot)
        } else {
            console.log(msg.Content)
            if(/test/.test(msg.Content) ) {
                bot.sendEmoticon('2a62ace39ee61fa3c70c34c03100ec5f',msg.FromUserName)
            }
        }
        
    }

    //图片消息
    handelMessage[bot.CONF.MSGTYPE_IMAGE] = function () {
        console.log(`[图片]`)
        bot.getMsgImg(msg.MsgId).then(res => {
            writeFile(res,'jpg')
        }).catch(err => {
            console.log(err)
        })
          
    }

    //语音消息
    handelMessage[bot.CONF.MSGTYPE_VOICE] = function () {
        console.log(`[语音]`)
    }

    //视频消息
    handelMessage[bot.CONF.MSGTYPE_MICROVIDEO] = function () {
        console.log(`[视频]`)
        bot.getVideo(msg.MsgId).then(res => {
            writeFile(res,'mp4')
        }).catch(err => {
            console.log(err)
        })
    }

    //视频消息
    handelMessage[bot.CONF.MSGTYPE_VIDEO] = handelMessage[bot.CONF.MSGTYPE_MICROVIDEO]


    //表情消息
    handelMessage[bot.CONF.MSGTYPE_EMOTICON] = function() {
        console.log(msg.Content)
    }


    //解析群聊消息群成员
    function parseGrounMember () {
        let contentSplit = msg.Content.split('\n')
        let memberUserName = contentSplit[0].replace(":","")
        let memberNick = bot.Contact.getUserByUserName(memberUserName).NickName
        contentSplit.shift()
        console.log(`${memberNick}:\n${contentSplit.join("")}`)
    }


    //写文件
    function writeFile (res, type) {
        if(!fs.existsSync(`./chatRes/${fromUser}`)) {
            fs.mkdirSync(`./chatRes/${fromUser}`)
        }
        fs.writeFileSync(`./chatRes/${fromUser}/${msg.MsgId}.${type}`, res.data)
    }

    main()
}


module.exports = dispalyMsg
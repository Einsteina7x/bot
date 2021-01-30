/*
 *
 * Creator: Radya, Farid, M. Hadi Firmansya, & Nazwa
 *
 */

const {
 WAConnection,
 MessageType,
 Presence,
 Mimetype,
 GroupSettingChange,
 MessageOptions,
 WALocationMessage,
 WA_MESSAGE_STUB_TYPES,
 ReconnectMode,
 ProxyAgent,
 waChatKey,
 mentionedJid,
 processTime
} = require('@adiwajshing/baileys')

/******BEGIN OF FILE INPUT******/
const { color, bgcolor } = require('./lib/color')
const { wait, getBuffer, h2k, generateMessageID, getGroupAdmins, getRandom, banner, start, info, success, close } = require('./lib/functions')
const { fetchJson } = require('./lib/fetcher')
const { recognize } = require('./lib/ocr')
/******END OF FILE INPUT******/

/******BEGIN OF NPM PACKAGE INPUT******/
const fs = require('fs')
const moment = require('moment-timezone')
const { exec } = require('child_process')
const kagApi = require('@kagchi/kag-api')
const fetch = require('node-fetch')
const ffmpeg = require('fluent-ffmpeg')
const { removeBackgroundFromImageFile } = require('remove.bg')
const imgbb = require('imgbb-uploader')
const speed = require('performance-now')
/******END OF NPM PACKAGE INPUT******/

/******BEGIN OF JSON INPUT******/
const banned = JSON.parse(fs.readFileSync('./database/json/banned.json'))
const grup = JSON.parse(fs.readFileSync('./database/json/grup.json'))
const daftarga = JSON.parse(fs.readFileSync('./database/json/ga.json'))
/******END OF JSON INPUT******/

/******LOAD OF VCARD INPUT******/
const botName = 'Yueena'
const vcard = 'BEGIN:VCARD\n' // metadata of the contact card
            + 'VERSION:3.0\n' 
            + 'FN:ɴᴀsɢᴏʀᴇsᴛ\n' // full name
            + 'ORG:Owner BOT ' + botName + ';\n' // the organization of the contact
            + 'TEL;type=CELL;type=VOICE;waid=6285790784469:+62 857-9078-4469\n' // WhatsApp ID + phone number
            + 'END:VCARD'
/******END OF VCARD INPUT******/

prefix = '.'
blocked = []

/******BEGIN OF FUNCTIONS INPUT******/
async function starts() {
 const client = new WAConnection()
 client.logger.level = 'warn'
 console.log(banner.string)
 client.on('qr', () => {
  console.log(color('[','white'), color('!','red'), color(']','white'), color(' Scan the qr code above'))
 })

 fs.existsSync('./Nazwa.json') && client.loadAuthInfo('./Nazwa.json')
 client.on('connecting', () => {
  start('2', 'Connecting...')
 })
 client.on('open', () => {
  success('2', 'Connected')
 })
 await client.connect({timeoutMs: 30*1000})
 fs.writeFileSync('./Nazwa.json', JSON.stringify(client.base64EncodedAuthInfo(), null, '\t'))

 client.on('group-participants-update', async (anu) => {
  try {
   const mdata = await client.groupMetadata(anu.jid)
   //console.log(anu)
   if(anu.action == 'add'){
    num = anu.participants[0]
    if(mdata.id != '6285790784469-1611314147@g.us'){
     /*
     try {
      ppimg = await client.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
     }catch{
      ppimg = 'https://assets.nasgorest.my.id/img/logo-potumnesia-v2.2.png'
     }
     */
     teks = `Halo @${num.split('@')[0]}\nSelamat datang di group *${mdata.subject}*, jangan lupa intro\nIGN: \nNama: \nGender: `
     /*
     let buff = await getBuffer(ppimg)
     client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
     */
     client.sendMessage(mdata.id, teks.trim(), MessageType.text, {contextInfo: {"mentionedJid": [num]}})
    }else{
     if(banned.includes(num)){
      client.groupRemove(mdata.id, [num])
     }else{
      /*
      try {
       ppimg = await client.getProfilePicture(`${anu.participants[0].split('@')[0]}@c.us`)
      }catch{
       ppimg = 'https://assets.nasgorest.my.id/img/logo-potumnesia-v2.2.png'
      }
      */
      teks = `Halo @${num.split('@')[0]}\nSelamat datang di group *${mdata.subject}*, jangan lupa intro\nIGN: \nNama: \nGender: `
      /*
      let buff = await getBuffer(ppimg)
      client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
      */
      client.sendMessage(mdata.id, teks.trim(), MessageType.text, {contextInfo: {"mentionedJid": [num]}})
     }
    }
   }else if(anu.action == 'remove'){
    num = anu.participants[0]
    if(mdata.id != '6285790784469-1611314147@g.us'){
     /*
     try {
      ppimg = await client.getProfilePicture(`${num.split('@')[0]}@c.us`)
     }catch{
      ppimg = 'https://assets.nasgorest.my.id/img/logo-potumnesia-v2.2.png'
     }
     */
     teks = `Sayonara @${num.split('@')[0]} 👋`
     /*
     let buff = await getBuffer(ppimg)
     client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
     */
     client.sendMessage(mdata.id, teks.trim(), MessageType.text, {contextInfo: {"mentionedJid": [num]}})
    }else{
     if(!banned.includes(num)){
      /*
      try {
       ppimg = await client.getProfilePicture(`${num.split('@')[0]}@c.us`)
      }catch{
       ppimg = 'https://assets.nasgorest.my.id/img/logo-potumnesia-v2.2.png'
      }
      */
      teks = `Sayonara @${num.split('@')[0]} 👋`
      /*
      let buff = await getBuffer(ppimg)
      client.sendMessage(mdata.id, buff, MessageType.image, {caption: teks, contextInfo: {"mentionedJid": [num]}})
      */
      client.sendMessage(mdata.id, teks.trim(), MessageType.text, {contextInfo: {"mentionedJid": [num]}})
     }
    }
   }
  }catch (e){
   console.log('Error : %s', color(e, 'red'))
  }
 })

 client.on('CB:Blocklist', json => {
  if(blocked.length > 2) return
  for(let i of json[1].blocklist){
   blocked.push(i.replace('c.us','s.whatsapp.net'))
  }
 })

 client.on('chat-update', async (mek) => {
  try {
   if(!mek.hasNewMessage) return
   mek = JSON.parse(JSON.stringify(mek)).messages[0]
   if(!mek.message) return
   if(mek.key && mek.key.remoteJid == 'status@broadcast') return
   if(mek.key.fromMe) return
   global.prefix
   global.blocked
   const content = JSON.stringify(mek.message)
   const from = mek.key.remoteJid
   const type = Object.keys(mek.message)[0]
   const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
   const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
   const date = moment.tz('Asia/Jakarta').format('DD,MM,YY')
   body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
   budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
   const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
   const args = body.trim().split(/ +/).slice(1)
   const isCmd = body.startsWith(prefix)

   mess = {
    wait: '⌛ Sedang di Prosess ⌛',
    success: '✔️ Berhasil ✔️',
    error: {
     stick: '[❗] Gagal, terjadi kesalahan saat mengkonversi gambar ke sticker ❌',
     Iv: '[❗] Link tidak valid ❌'
    },
    only: {
     group: '[❗] Perintah ini hanya bisa di gunakan dalam group! ❌',
     ownerG: '[❗] Perintah ini hanya bisa di gunakan oleh owner group! ❌',
     ownerB: '[❗] Perintah ini hanya bisa di gunakan oleh owner bot! ❌',
     admin: '[❗] Perintah ini hanya bisa di gunakan oleh admin group! ❌',
     Badmin: '[❗] Perintah ini hanya bisa di gunakan ketika bot menjadi admin! ❌',
    }
   }
   const botNumber = client.user.jid
   const ownerNumber = ["6285790784469@s.whatsapp.net"] // replace this with your number
   const nomorOwner = [ownerNumber]
   const isGroup = from.endsWith('@g.us')
   const totalchat = await client.chats.all()
   const sender = isGroup ? mek.participant : mek.key.remoteJid
   const groupMetadata = isGroup ? await client.groupMetadata(from) : ''
   const groupName = isGroup ? groupMetadata.subject : ''
   const groupId = isGroup ? groupMetadata.id : ''
   const groupMembers = isGroup ? groupMetadata.participants : ''
   const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
   const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
   const isGroupAdmins = groupAdmins.includes(sender) || false
   const isOwner = ownerNumber.includes(sender)

   getPremium = await fetchJson('https://nasbot.nasgorest.my.id/bot.php?mode=getallidgroup')
   isPremium = false
   if(getPremium.reply.includes(from.split('@')[0])){ isPremium = "yes" }

   const isUrl = (url) => {
    return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))
   }
   const reply = (teks) => {
    client.sendMessage(from, teks, text, {quoted:mek})
   }
   const sendMess = (hehe, teks) => {
    client.sendMessage(hehe, teks, text)
   }
   const mentions = (teks, memberr, id) => {
    (id == null || id == undefined || id == false) ? client.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : client.sendMessage(from, teks.trim(), extendedText, {quoted: mek, contextInfo: {"mentionedJid": memberr}})
   }

   colors = ['red','white','black','blue','yellow','green']
   const isMedia = (type === 'imageMessage' || type === 'videoMessage')
   const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
   const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
   const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')
   const isQuotedMessage = type === 'extendedTextMessage' && content.includes ('conversation')
   //if(!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
   //if(!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
   //if(isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
   //if(!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
 
/******END OF FUNCTIONS INPUT******/

   switch(command) {

    case 'bot':
     botTeks = body.slice(5)
     if(isGroup){
      console.log("Grup: "+groupName+"\nSender: "+sender.split("@")[0]+"\nChat: "+prefix+"bot "+botTeks+"\n")
      botData = await fetchJson('https://nasbot.nasgorest.my.id/bot.php?message=' + botTeks + '&id=' + groupId.split('@')[0])
     }else{
      console.log("Sender: "+sender.split("@")[0]+"\nChat: "+prefix+"bot "+botTeks+"\n")
      botData = await fetchJson('https://nasbot.nasgorest.my.id/bot.php?message=' + botTeks + '&id=' + sender)
     }
     if(botData.reply){ reply(botData.reply) }
     break

    case 'cekresi':
     cekresiTeks = body.slice(9)
     if(isGroup){
      console.log("Grup: "+groupName+"\nSender: "+sender.split("@")[0]+"\nChat: "+prefix+"cekresi "+cekresiTeks.split(' ')[0]+" "+cekresiTeks.split(' ')[1]+"\n")
     }else{
      console.log("Sender: "+sender.split("@")[0]+"\nChat: "+prefix+"cekresi "+cekresiTeks.split(' ')[0]+" "+cekresiTeks.split(' ')[1]+"\n")
     }
     cekresiData = await fetchJson('https://nasbot.nasgorest.my.id/bot.php?mode=cekresi&courier=' + cekresiTeks.split(' ')[0]+ '&noresi=' + cekresiTeks.split(' ')[1])
     if(cekresiData.reply){ reply(cekresiData.reply) }
     break

    case 'kodekurir':
     if(isGroup){
      console.log("Grup: "+groupName+"\nSender: "+sender.split("@")[0]+"\nChat: "+prefix+"kodekurir\n")
     }else{
      console.log("Sender: "+sender.split("@")[0]+"\nChat: "+prefix+"kodekurir")
     }
     kodekurirData = await fetchJson('https://nasbot.nasgorest.my.id/bot.php?mode=kodekurir')
     if(kodekurirData.reply){ reply(kodekurirData.reply) }
     break

    case 'banned':
     if(isGroup){
      console.log("Grup: "+groupName+"\nSender: "+sender.split("@")[0]+"\nChat: "+prefix+"banned "+body.slice(8)+"\n")
     }else{
      console.log("Sender: "+sender.split("@")[0]+"\nChat: "+prefix+"banned "+body.slice(8)+"\n")
     }
     if(groupId != '6285790784469-1611314147@g.us') return reply('[❗] Fitur ini masih dalam tahap pengembangan! ❌')
     if(!isGroup) return reply(mess.only.group)
     if(!isOwner) return reply(mess.only.ownerB)
     if(mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag target yang ingin di banned!')
     mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
     if(mentioned.length > 1){
      teks = 'Perintah diterima, membanned :/n'
      for(let _ of mentioned){
       teks += `@${_.split('@')[0]}\n`
       banned.push(_)
       fs.writeFileSync('./database/json/banned.json', JSON.stringify(banned))
      }
      teks += `dari grup *${groupName}*`
      mentions(teks, mentioned, true)
      client.groupRemove(from, mentioned)
     }else{
      mentions(`Perintah diterima, membanned: @${mentioned[0].split('@')[0]} dari grup *${groupName}*`, mentioned, true)
      banned.push(mentioned[0])
      fs.writeFileSync('./database/json/banned.json', JSON.stringify(banned))
      client.groupRemove(from, mentioned)
     }
     break

    case 'unbanned':
     if(isGroup){
      console.log("Grup: "+groupName+"\nSender: "+sender.split("@")[0]+"\nChat: "+prefix+"unbanned "+body.slice(10)+"\n")
     }else{
      console.log("Sender: "+sender.split("@")[0]+"\nChat: "+prefix+"unbanned "+body.slice(10)+"\n")
     }
     if(groupId != '6285790784469-1611314147@g.us') return reply('[❗] Fitur ini masih dalam tahap pengembangan! ❌')
     if(!isGroup) return reply(mess.only.group)
     if(!isOwner) return reply(mess.only.ownerB)
     if(args.length < 1) return reply('Nomernya berapa kak?')
     if(args[0].startsWith('08')) return reply('Gunakan kode negara kak.')
     num = `${args[0].replace('+', '')}@s.whatsapp.net`
     for(i = 0; i < banned.length; i++){
      if(banned[i] == num){
       bannedget = i
      }
     }
     if(bannedget){
      banned.splice(bannedget, 1)
      fs.writeFileSync('./database/json/banned.json', JSON.stringify(banned))
      reply(`Perintah diterima, +${num.split('@')[0]} berhasil di unbanned dari grup *${groupName}*.`)
     }else{
      reply(`[❗] ${num.split('@')[0]} belum di banned dari grup *${groupName}* sebelumnya. ❌`)
     }
     break

    case 'demote':
     if(isGroup){
      console.log("Grup: "+groupName+"\nSender: "+sender.split("@")[0]+"\nChat: "+prefix+"demote "+body.slice(8)+"\n")
     }else{
      console.log("Sender: "+sender.split("@")[0]+"\nChat: "+prefix+"demote "+body.slice(8)+"\n")
     }
     if(!isGroup) return reply(mess.only.group)
     if(!isGroupAdmins) return reply(mess.only.admin)
     if(!isBotGroupAdmins) return reply(mess.only.Badmin)
     if(mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('𝐓𝐚𝐠 𝐭𝐚𝐫𝐠𝐞𝐭 𝐲𝐚𝐧𝐠 𝐦𝐚𝐮 𝐝𝐢 𝐭𝐮𝐫𝐮𝐧𝐤𝐚𝐧 𝐚𝐝𝐦𝐢𝐧')
     mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
     if(mentioned.length > 1){
      teks = ''
      for(let _ of mentioned){
       teks += `𝐏𝐞𝐫𝐢𝐧𝐭𝐚𝐡 𝐝𝐢𝐭𝐞𝐫𝐢𝐦𝐚, 𝐦𝐞𝐧𝐮𝐫𝐮𝐧𝐤𝐚𝐧 𝐝𝐚𝐫𝐢 𝐚𝐝𝐦𝐢𝐧 𝐠𝐫𝐨𝐮𝐩 :\n`
       teks += `@_.split('@')[0]`
      }
      mentions(teks, mentioned, true)
      client.groupDemoteAdmin(from, mentioned)
     }else{
      mentions(`𝐏𝐞𝐫𝐢𝐧𝐭𝐚𝐡 𝐝𝐢𝐭𝐞𝐫𝐢𝐦𝐚, 𝐦𝐞𝐧𝐮𝐫𝐮𝐧𝐤𝐚𝐧 @${mentioned[0].split('@')[0]}\n 𝐝𝐚𝐫𝐢 𝐚𝐝𝐦𝐢𝐧 𝐠𝐫𝐨𝐮𝐩 _*${groupMetadata.subject}*_`, mentioned, true)
      client.groupDemoteAdmin(from, mentioned)
     }
     break

    case 'promote':
     if(isGroup){
      console.log("Grup: "+groupName+"\nSender: "+sender.split("@")[0]+"\nChat: "+prefix+"promote "+body.slice(9)+"\n")
     }else{
      console.log("Sender: "+sender.split("@")[0]+"\nChat: "+prefix+"promote "+body.slice(9)+"\n")
     }
     if(!isGroup) return reply(mess.only.group)
     if(!isGroupAdmins) return reply(mess.only.admin)
     if(!isBotGroupAdmins) return reply(mess.only.Badmin)
     if(mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag target yang ingin di promote!')
     mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
     if(mentioned.length > 1){
      teks = 'Perintah di terima, menambah jabatan sebagai admin :\n'
      for(let _ of mentioned){
       teks += `@${_.split('@')[0]}\n`
      }
      mentions(teks, mentioned, true)
      client.groupMakeAdmin(from, mentioned)
     }else{
      mentions(`Perintah di terima, menambah jabatan sebagai admin : @${mentioned[0].split('@')[0]}`, mentioned, true)
      client.groupMakeAdmin(from, mentioned)
     }
     break

    case 'wa.me':
    case 'wame':
     if(isGroup){
      console.log("Grup: "+groupName+"\nSender: "+sender.split("@")[0]+"\nChat: "+prefix+"wa.me\n")
     }else{
      console.log("Sender: "+sender.split("@")[0]+"\nChat: "+prefix+"wa.me\n")
     }
     options = {
      text: `「 *SELF WHATSAPP* 」\n\n_Request by_ : *@${sender.split("@s.whatsapp.net")[0]}\n\nYour link WhatsApp : *https://wa.me/${sender.split("@s.whatsapp.net")[0]}*\n*Or*\n*Or ( / )*\n*https://api.whatsapp.com/send?phone=${sender.split("@")[0]}*`,
      contextInfo: { mentionedJid: [sender] }
     }
     client.sendMessage(from, options, text, { quoted: mek } )
     break
     if (data.error) return reply(data.error)
     reply(data.result)
     break

    case 'owner':
    case 'creator':
     if(isGroup){
      console.log("Grup: "+groupName+"\nSender: "+sender.split("@")[0]+"\nChat: "+prefix+"owner\n")
     }else{
      console.log("Sender: "+sender.split("@")[0]+"\nChat: "+prefix+"owner\n")
     }
     client.sendMessage(from, {displayname: "Jeff", vcard: vcard}, MessageType.contact, { quoted: mek})
     break

    case 'notif':
     notifTeks = body.slice(7)
     if(isGroup){
      console.log("Grup: "+groupName+"\nSender: "+sender.split("@")[0]+"\nChat: "+prefix+"notif "+notifTeks+"\n")
     }else{
      console.log("Sender: "+sender.split("@")[0]+"\nChat: "+prefix+"notif "+notifTeks+"\n")
     }
     if(!isGroup) return reply(mess.only.group)
     if(!isGroupAdmins) return reply(mess.only.admin)
     if(!isPremium) return reply ('[❗] Fitur ini khusus Premium. ❌') 
     notifGroup = await client.groupMetadata(from);
     notifMember = notifGroup['participants']
     notifJids = [];
     notifMember.map( async adm => {
      notifJids.push(adm.id.replace('c.us', 's.whatsapp.net'));
     })
     notifOptions = {
      text: notifTeks,
      contextInfo: {mentionedJid: notifJids},
      quoted: mek
     }
     await client.sendMessage(from, notifOptions, text)
     break

    case 'infonomor':
     if(isGroup){
      console.log("Grup: "+groupName+"\nSender: "+sender.split("@")[0]+"\nChat: "+prefix+"infonomor "+body.slice(11)+"\n")
     }else{
      console.log("Sender: "+sender.split("@")[0]+"\nChat: "+prefix+"infonomor "+body.slice(11)+"\n")
     }
     if(args.length < 1) return reply(`Masukan Nomor\nContoh : ${prefix}infonomor 0812345678`)
     infonomorData = await fetchJson(`https://docs-jojo.herokuapp.com/api/infonomor?no=${body.slice(11)}`)
     if(infonomorData.error) return reply(infonomorData.error)
     if(infonomorData.result) return reply(infonomorData.result)
     infonomorHasil = `Nomor : ${infonomorData.nomor}\nOperator : ${infonomorData.op}`
     reply(infonomorHasil)
     break

    case 'map':
     if(isGroup){
      console.log("Grup: "+groupName+"\nSender: "+sender.split("@")[0]+"\nChat: "+prefix+"map "+body.slice(5)+"\n")
     }else{
      console.log("Sender: "+sender.split("@")[0]+"\nChat: "+prefix+"map "+body.slice(5)+"\n")
     }
     mapData = await fetchJson(`https://mnazria.herokuapp.com/api/maps?search=${body.slice(5)}`)
     mapHasil = await getBuffer(mapData.gambar)
     client.sendMessage(from, mapHasil, image, {quoted: mek, caption: `Hasil Dari *${body.slice(5)}*`})
     break

    case 'getidgrup':
     if(isGroup){
      console.log("Grup: "+groupName+"\nSender: "+sender.split("@")[0]+"\nChat: "+prefix+"getidgrup\n")
     }else{
      console.log("Sender: "+sender.split("@")[0]+"\nChat: "+prefix+"getidgrup\n")
     }
     teks = "GrupID: " + groupId + "\n"
              + "Nama: " + groupName + "\n"
              + "Pengirim: +" + sender.split("@")[0]
     client.sendMessage(ownerNumber[0], teks, MessageType.text, {quoted:mek})
     break

    case 'getallidgrup':
     if(isGroup){
      console.log("Grup: "+groupName+"\nSender: "+sender.split("@")[0]+"\nChat: "+prefix+"getallidgrup\n")
     }else{
      console.log("Sender: "+sender.split("@")[0]+"\nChat: "+prefix+"getallidgrup\n")
     }
     if(!isOwner) return reply(mess.only.ownerB)
     teks = "*Total Grup*: "+grup.length+"\n\n"
     for(i = 0; i < grup.length; i++){
      teks += grup[i].groupId+" - "+grup[i].groupName+"\n"
     }
     client.sendMessage(ownerNumber[0], teks, MessageType.text, {quoted:mek})
     break

    case 'bc2':
     if(!isOwner) return reply(mess.only.ownerB)
     data = await fetchJson("https://nasbot.nasgorest.my.id/bot.php?mode=bc")
     if(!data.reply) return reply("Gagal mengirim broadcast.")
     urutan = 0 
     setint = setInterval(sendbc2, 5000)
     async function sendbc2(){
      console.log("BC ke "+(urutan+1)+"/"+grup.length)
      bcGroup = await client.groupMetadata(grup[20].groupId);
      bcMember = bcGroup['participants']
      bcJids = [];
      bcMember.map( async adm => {
       bcJids.push(adm.id.replace('c.us', 's.whatsapp.net'));
      })
      bcOptions = {
        text: data.reply,
        contextInfo: {mentionedJid: bcJids}, 
        quoted: mek
      }
      await client.sendMessage(grup[20].groupId, bcOptions, text);
      //await client.sendMessage(grup[20].groupId, bcJids[urutan], MessageType.text)
      reply("Broadcast ke "+(urutan+1)+"/"+grup.length+" - Berhasil broadcast ke grup "+grup[20].groupName+".")
      urutan += 1
      if(urutan > 1){ clearint = clearInterval(setint) }
     }
     break

    case 'bc':
     if(!isOwner) return reply(mess.only.ownerB)
     data = await fetchJson("https://nasbot.nasgorest.my.id/bot.php?mode=bc")
     if(!data.reply) return reply("Gagal mengirim broadcast.")
     urutan = 0 
     setint = setInterval(sendbc, 5000)
     async function sendbc(){
      console.log("BC ke "+(urutan+1)+"/"+grup.length)
      bcGroup = await client.groupMetadata(grup[urutan].groupId);
      bcMember = bcGroup['participants']
      bcJids = [];
      bcMember.map( async adm => {
       bcJids.push(adm.id.replace('c.us', 's.whatsapp.net'));
      })
      bcOptions = {
        text: data.reply,
        contextInfo: {mentionedJid: bcJids}
      }
      await client.sendMessage(grup[urutan].groupId, bcOptions, text);
      reply("Broadcast ke "+(urutan+1)+"/"+grup.length+" - Berhasil broadcast ke grup "+grup[urutan].groupName+".")
      urutan += 1
      if(urutan > grup.length - 1){ clearint = clearInterval(setint) }
     }
     break

    case 'setprefix':
     if(args.length < 1) return
     if(!isOwner) return reply(mess.only.ownerB)
     prefix = args[0]
     reply(`Prefix berhasil di ubah menjadi : ${prefix}`)
     break

    case 'tagall4215':
     if(!isGroup) return reply(mess.only.group)
     if(!isGroupAdmins) return reply(mess.only.admin)
     //if(!isPremium) return reply ('[❗] Fitur ini khusus Premium. ❌') 
     members_id = []
     teks = (args.length > 1) ? body.slice(8).trim() : ''
     for(let mem of groupMembers){
      members_id.push(mem.jid)
     }
     daftar = '╭════•›「 Daftar Member Grup '+groupName+' 」\n'
            + '╿\n'
            + '╿➥ Total: ' + groupMembers. length + '\n'
            + '╿\n'
            + '╰═══════════════════════════'
     mentions(daftar, members_id, true)
     break

    case 'tagall':
     if(!isGroup) return reply(mess.only.group)
     if(!isGroupAdmins) return reply(mess.only.admin)
     if(!isPremium) return reply ('[❗] Fitur ini khusus Premium. ❌') 
     members_id = []
     teks = (args.length > 1) ? body.slice(8).trim() : ''
     for(let mem of groupMembers){
      teks += `╿➥ @${mem.jid.split('@')[0]}\n`
      members_id.push(mem.jid)
     }
     daftar = '╭════•›「 Daftar Member Grup '+groupName+' 」\n'
            + '╿\n'
            + '╿➥ Total: ' + groupMembers. length + '\n'
            + '╿\n'
            + teks
            + '╿\n'
            + '╰═══════════════════════════'
     mentions(daftar, members_id, true)
     break

    case 'leave':
     if (!isGroup) return reply(mess.only.group)
     if (!isGroupAdmins) return reply(mess.only.admin)
     setTimeout( () => {
      client.groupLeave (from) 
     }, 2000)
     setTimeout( () => {
      client.updatePresence(from, Presence.composing) 
      client.sendMessage(from, 'Sayonara👋', text) // ur cods
     }, 0)
     break

    case 'ownergrup':
    case 'ownergroup':
     options = {
      text: `Owner Group ini adalah : @${from.split("-")[0]}`,
      contextInfo: { mentionedJid: [from] }
     }
     client.sendMessage(from, options, text, { quoted: mek } )
     break

    case 'add':
     if(!isGroup) return reply(mess.only.group)
     if(!isGroupAdmins) return reply(mess.only.admin)
     if(!isBotGroupAdmins) return reply(mess.only.Badmin)
     if(args.length < 1) return reply('Yang mau di add jin ya?')
     if(args[0].startsWith('08')) return reply('Gunakan kode negara kak.')
     try {
      num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
      client.groupAdd(from, [num])
     }catch (e){
      //console.log('Error :', e)
      reply('Gagal menambahkan target, mungkin karena di private')
     }
     break

    case 'kick':
     if(!isGroup) return reply(mess.only.group)
     if(!isGroupAdmins) return reply(mess.only.admin)
     if(!isBotGroupAdmins) return reply(mess.only.Badmin)
     if(mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag target yang ingin di tendang!')
     mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
     if(mentioned.length > 1){
      teks = 'Perintah di terima, mengeluarkan :\n'
      for(let _ of mentioned){
       teks += `@${_.split('@')[0]}\n`
      }
      mentions(teks, mentioned, true)
      client.groupRemove(from, mentioned)
     }else{
      mentions(`Perintah di terima, mengeluarkan : @${mentioned[0].split('@')[0]}`, mentioned, true)
      client.groupRemove(from, mentioned)
      client.sendMessage(mentioned, 'yahaha Lu kekick😂', text)
     }
     break

    case 'qrcode':
     buff = await getBuffer(`https://api.qrserver.com/v1/create-qr-code/?data=${body.slice(8)}&size=1080%C3%971080`)
     client.sendMessage(from, buff, image, {quoted: mek})
     break

     case 'ocr':
     if((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0){
      const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
      const media = await client.downloadAndSaveMediaMessage(encmedia)
      reply(mess.wait)
      await recognize(media, {lang: 'eng+ind', oem: 1, psm: 3})
      .then(teks => {
       reply(teks.trim())
       fs.unlinkSync(media)
      })
      .catch(err => {
       reply(err.message)
       fs.unlinkSync(media)
      })
     }else{
      reply('Foto aja mas')
     }
     break

    case 'closegc':
     if(!isGroup) return reply(mess.only.group)
     if(!isGroupAdmins) return reply(mess.only.admin)
     if(!isBotGroupAdmins) return reply(mess.only.Badmin)
     var nomor = mek.participant
     const close = {
      text: `Grup ditutup oleh admin @${nomor.split("@s.whatsapp.net")[0]}\nsekarang *hanya admin* yang dapat mengirim pesan`,
      contextInfo: { mentionedJid: [nomor] }
     }
     client.groupSettingChange (from, GroupSettingChange.messageSend, true);
     reply(close)
     break

    case 'opengc':
    case 'bukagc':
     if(!isGroup) return reply(mess.only.group)
     if(!isGroupAdmins) return reply(mess.only.admin)
     if(!isBotGroupAdmins) return reply(mess.only.Badmin)
     open = {
      text: `Grup dibuka oleh admin @${sender.split("@")[0]}\nsekarang *semua peserta* dapat mengirim pesan`,
      contextInfo: { mentionedJid: [sender] }
     }
     client.groupSettingChange (from, GroupSettingChange.messageSend, false)
     client.sendMessage(from, open, text, {quoted: mek})
     break

    case 'stiker':
    case 'sticker':
    case 'stickergif':
    case 'stikergif':
     if((isMedia && !mek.message.videoMessage || isQuotedImage) && args.length == 0){
      const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
      const media = await client.downloadAndSaveMediaMessage(encmedia)
      ran = getRandom('.webp')
      await ffmpeg(`./${media}`)
      .input(media)
      .on('start', function (cmd){
       //console.log(`Started : ${cmd}`)
      })
      .on('error', function (err){
       //console.log(`Error : ${err}`)
       //fs.unlinkSync(media)
       reply(mess.error.stick)
      })
      .on('end', function (){
       //console.log('Finish')
       client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
       //fs.unlinkSync(media)
       //fs.unlinkSync(ran)
      })
      .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
      .toFormat('webp')
      .save(ran)
     }else if((isMedia && mek.message.videoMessage.seconds < 11 || isQuotedVideo && mek.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.seconds < 11) && args.length == 0){
      const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
      const media = await client.downloadAndSaveMediaMessage(encmedia)
      ran = getRandom('.webp')
      reply(mess.wait)
      await ffmpeg(`./${media}`)
      .inputFormat(media.split('.')[1])
      .on('start', function (cmd){
       //console.log(`Started : ${cmd}`)
      })
      .on('error', function (err){
       //console.log(`Error : ${err}`)
       //fs.unlinkSync(media)
       tipe = media.endsWith('.mp4') ? 'video' : 'gif'
       reply(`❌ Gagal, pada saat mengkonversi ${tipe} ke stiker`)
      })
      .on('end', function (){
       //console.log('Finish')
       buff = fs.readFileSync(ran)
       client.sendMessage(from, buff, sticker)
       //fs.unlinkSync(media)
       //fs.unlinkSync(ran)
      })
      .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
      .toFormat('webp')
      .save(ran)
     }
     break

    case 'toimg':
     if(!isQuotedSticker) return reply('❌ reply stickernya um ❌')
     reply(mess.wait)
     encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
     media = await client.downloadAndSaveMediaMessage(encmedia)
     ran = getRandom('.png')
     exec(`ffmpeg -i ${media} ${ran}`, (err) => {
      fs.unlinkSync(media)
      if(err) return reply('❌ Gagal, pada saat mengkonversi sticker ke gambar ❌')
      buffer = fs.readFileSync(ran)
      client.sendMessage(from, buffer, image, {quoted: mek, caption: '>//<'})
      fs.unlinkSync(ran)
     })
     break

    case 'tomp3':
     if(!isQuotedVideo) return reply('❌ reply videonya um ❌')
     reply(mess.wait)
     encmedia = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
     media = await client.downloadAndSaveMediaMessage(encmedia)
     ran = getRandom('.mp4')
     exec(`ffmpeg -i ${media} ${ran}`, (err) => {
      fs.unlinkSync(media)
      if(err) return reply('❌ Gagal, pada saat mengkonversi video ke mp3 ❌')
      buffer = fs.readFileSync(ran)
      client.sendMessage(from, buffer, audio, {mimetype: 'audio/mp4', quoted: mek})
      fs.unlinkSync(ran)
     })
     break

    case 'delete':
    case 'del':
     if(!isGroup)return reply(mess.only.group)
     if(!isGroupAdmins)return reply(mess.only.admin)
     client.deleteMessage(from, { id: mek.message.extendedTextMessage.contextInfo.stanzaId, remoteJid: from, fromMe: true })
     break

    case 'ping':
     const timestamp = speed()
     const latensi = speed() - timestamp
     uptime = process.uptime()
     teks = "*PONG!!*"
     if(isOwner){
      teks += "\nDi respon dalam: "+latensi.toFixed(4)+" detik"
     }
     client.sendMessage(from, teks, text, {quoted:mek})
     break

    case 'listga':
     if(groupId != "628974260260-1518367053@g.us") return reply("Giveaway ini khusus grup DARKMOON!")
     teks = "*「  AMI's GiveAway 」*\n"
          + "Pilih angka 1-67 lalu chat:\n"
          + ".daftarga angka\n"
          + "*Contoh*: .daftarga 50\n"
          + "\n"
          + "GiveAway ditutup 28 Januari 2021 jam 19:00 WIB dan diumumkan jam 20:00 WIB\n"
          + "\n"
          + "*「  Hadiah 」*\n"
          + "- Spina 1M\n"
          + "- Spina 750K\n"
          + "- Spina 500K\n"
          + "- Spina 250K\n"
          + "\n"
          + "*「  Daftar Peserta  」*\n"
          + "Total: "+daftarga.length+"\n"
          + "\n"
     for(i = 0; i < daftarga.length; i++){
      teks += "+"+daftarga[i].id.split("@")[0]+" - "+daftarga[i].no+"\n"
     }
     reply(teks)
     break

/*
    case 'daftarga':
     if(groupId != "628974260260-1518367053@g.us") return reply("Giveaway ini khusus grup DARKMOON!")
     if(args.length < 1) return reply("No. undiannya brapa bor?")
     if(args[0] < 1 || args[0] > 67) return reply("Pilih No. 1-67 bor.")
     if(!Number(args[0])) return reply("Yang bener dong anj")
     isNo = "no"
     isDaftar = "no"
     for(i = 0; i < daftarga.length; i++){
      if(daftarga[i].no == args[0]){
       isNo = "yes"
      }
      if(daftarga[i].id == sender){
       isDaftar = "yes"
      }
     }
     if(isNo == "no" && isDaftar == "no"){
      daftarga.push({"id":sender,"no":args[0]})
      fs.writeFileSync('./database/json/ga.json', JSON.stringify(daftarga))
      teks = "*「  AMI's GiveAway 」*\n"
           + "Pilih angka 1-67 lalu chat:\n"
           + ".daftarga angka\n"
           + "*Contoh*: .daftarga 50\n"
           + "\n"
           + "GiveAway ditutup 28 Januari 2021 jam 19:00 WIB dan diumumkan jam 20:00 WIB\n"
           + "\n"
           + "*「  Hadiah 」*\n"
           + "- Spina 1M\n"
           + "- Spina 750K\n"
           + "- Spina 500K\n"
           + "- Spina 250K\n"
           + "\n"
           + "*「  Daftar Peserta  」*\n"
           + "Total: "+daftarga.length+"\n"
           + "\n"
      for(i = 0; i < daftarga.length; i++){
       teks += "+"+daftarga[i].id.split("@")[0]+" - "+daftarga[i].no+"\n"
      }
      reply(teks)
     }else{
      if(isNo == "yes") return reply("No. nya sudah diambil, pilih No. lain.")
      if(isDaftar == "yes") return reply("Kakak udah daftar anj")
     }
     break
*/

    default:
     if(isGroup){
      grupList = "no"
      for(i = 0; i < grup.length; i++){
       if(grup[i].groupId == groupId){
        grupNumber = i
        grupList = "yes"
       }
      }
      if(grupList == "yes"){
       if(grup[grupNumber].groupName != groupName){
        grup.splice(grupNumber, 1, {"groupId":groupId,"groupName":groupName})
        fs.writeFileSync('./database/json/grup.json', JSON.stringify(grup))
        console.log("Berhasil mengubah nama grup dengan ID "+groupId+" menjadi "+groupName+"\n\n")
       }
      }else{
       grup.push({"groupId":groupId,"groupName":groupName})
       fs.writeFileSync('./database/json/grup.json', JSON.stringify(grup))
       console.log("Berhasil mendaftarkan grup "+groupName+" dengan ID "+groupId+"\n\n")
      }
     }
   }
  }catch (e){
   console.log('Error : %s', color(e, 'red'))
  }
 })
}
starts()

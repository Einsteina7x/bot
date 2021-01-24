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
 GroupSettingChange
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
const welkom = JSON.parse(fs.readFileSync('./database/json/welkom.json'))
const infobanned = JSON.parse(fs.readFileSync('./database/json/infobanned.json'))
const bcgrup = JSON.parse(fs.readFileSync('./database/json/bcgrup.json'))
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
function kyun(seconds){
 function pad(s){
  return (s < 10 ? '0' : '') + s;
 }
 var hours = Math.floor(seconds / (60*60));
 var minutes = Math.floor(seconds % (60*60) / 60);
 var seconds = Math.floor(seconds % 60);

 //return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
 return `${pad(hours)} Jam ${pad(minutes)} Menit ${pad(seconds)} Detik`
}

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
  if(!welkom.includes(anu.jid)) return
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
     if(infobanned.includes(num)){
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
     if(!infobanned.includes(num)){
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
   const isWelkom = isGroup ? welkom.includes(from) : false
   const isOwner = ownerNumber.includes(sender)

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
   //if(!isGroup && isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
   //if(!isGroup && !isCmd) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'args :', color(args.length))
   //if(isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;32mEXEC\x1b[1;37m]', time, color(command), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
   //if(!isCmd && isGroup) console.log('\x1b[1;31m~\x1b[1;37m>', '[\x1b[1;31mRECV\x1b[1;37m]', time, color('Message'), 'from', color(sender.split('@')[0]), 'in', color(groupName), 'args :', color(args.length))
 
/******END OF FUNCTIONS INPUT******/

   switch(command) {
    case 'bot':
     teks = body.slice(5)
     if(isGroup){
      data = await fetchJson('https://nasbot.nasgorest.my.id/bot.php?message=' + teks + '&id=' + groupId.split('@')[0] + '&name=' + groupName)
     }else{
      data = await fetchJson('https://nasbot.nasgorest.my.id/bot.php?message=' + teks + '&id=' + sender)
     }
     if(data.reply){ reply(data.reply) }
     break

    case 'banned':
     if(groupId != '6285790784469-1611314147@g.us')
     if(!isGroup) return reply(mess.only.group)
     if(!isOwner) return reply(mess.only.ownerB)
     if(mek.message.extendedTextMessage === undefined || mek.message.extendedTextMessage === null) return reply('Tag target yang ingin di banned!')
     mentioned = mek.message.extendedTextMessage.contextInfo.mentionedJid
     if(mentioned.length > 1){
      teks = 'Perintah diterima, membanned :/n'
      for(let _ of mentioned){
       teks += `@${_.split('@')[0]}\n`
       infobanned.push(_)
       fs.writeFileSync('./database/json/infobanned.json', JSON.stringify(infobanned))
      }
      teks += `dari grup *${groupName}*`
      mentions(teks, mentioned, true)
      client.groupRemove(from, mentioned)
     }else{
      mentions(`Perintah diterima, membanned: @${mentioned[0].split('@')[0]} dari grup *${groupName}*`, mentioned, true)
      infobanned.push(mentioned[0])
      fs.writeFileSync('./database/json/infobanned.json', JSON.stringify(infobanned))
      client.groupRemove(from, mentioned)
     }
     break

    case 'unbanned':
     if(groupId != '6285790784469-1611314147@g.us')
     if(!isGroup) return reply(mess.only.group)
     if(!isOwner) return reply(mess.only.ownerB)
     if(args.length < 1) return reply('Nomernya berapa kak?')
     if(args[0].startsWith('08')) return reply('Gunakan kode negara kak.')
     num = `${args[0].replace('+', '')}@s.whatsapp.net`
     for(i = 0; i < infobanned.length; i++){
      if(infobanned[i] == num){
       infobannedget = i
      }
     }
     infobanned.splice(infobannedget, 1)
     fs.writeFileSync('./database/json/infobanned.json', JSON.stringify(infobanned))
     reply(`Perintah diterima, +${num.split('@')[0]} berhasil di unbanned dari grup *${groupName}.`)
     break
/*
    case 'timer':
     if(args[1]=="detik"){ var timer = args[0]+"000"
     }else if(args[1]=="menit"){ var timer = args[0]+"0000"
     }else if(args[1]=="jam"){ var timer = args[0]+"00000"
     }else{ return reply("*pilih:*\ndetik\nmenit\njam")}
     setTimeout( () => {
      reply("Waktu habis")
     }, timer)
     break
*/

    case 'demote':
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
     client.sendMessage(from, {displayname: "Jeff", vcard: vcard}, MessageType.contact, { quoted: mek})
     break

    case 'notif':
     if(!isGroup) return reply(mess.only.group)
     if(!isGroupAdmins) return reply(mess.only.admin)
     teks = body.slice(7)
     group = await client.groupMetadata(from);
     member = group['participants']
     jids = [];
     member.map( async adm => {
      jids.push(adm.id.replace('c.us', 's.whatsapp.net'));
     })
     options = {
      text: teks,
      contextInfo: {mentionedJid: jids},
      quoted: mek
     }
     await client.sendMessage(from, options, text)
     break

/* Setelah digunakan, WA langsung error
    case 'bcgrup':
     if(!isOwner) return reply(mess.only.ownerB)
     teks = body.slice(8)
     for(i = 0; i < bcgrup.length; i++){
      client.sendMessage(bcgrup[i], teks, text)
     }
     break
*/

    case 'infonomor':
     if (args.length < 1) return reply(`Masukan Nomor\nContoh : ${prefix}infonomor 0812345678`)
     data = await fetchJson(`https://docs-jojo.herokuapp.com/api/infonomor?no=${body.slice(11)}`)
     if (data.error) return reply(data.error)
     if (data.result) return reply(data.result)
     hasil = `╠➥ nomor : ${data.nomor}\n╠➥ operator : ${data.op}`
     reply(hasil)
     break

    case 'map':
     data = await fetchJson(`https://mnazria.herokuapp.com/api/maps?search=${body.slice(5)}`)
     hasil = await getBuffer(data.gambar)
     client.sendMessage(from, hasil, image, {quoted: mek, caption: `Hasil Dari *${body.slice(5)}*`})
     break

    case 'ytmp4':
     if(args.length < 1) return reply('Urlnya mana um?')
     if(!isUrl(args[0]) && !args[0].includes('youtu')) return reply(mess.error.Iv)
     anu = await fetchJson(`https://st4rz.herokuapp.com/api/ytv2?url=${args[0]}`, {method: 'get'})
     if (anu.error) return reply(anu.error)
     teks = `*❏ Title* : ${anu.title}\n\n*VIDEO SEDANG DIKIRIMKAN, JANGAN SPAM YA SAYANG*`
     thumb = await getBuffer(anu.thumb)
     client.sendMessage(from, thumb, image, {quoted: mek, caption: teks})
     buffer = await getBuffer(anu.result)
     client.sendMessage(from, buffer, video, {mimetype: 'video/mp4', filename: `${anu.title}.mp4`, quoted: mek})
     break

/*
    case 'testime':
     setTimeout( () => {
      client.sendMessage(from, 'Waktu habis:v', text) // ur cods
     }, 10000) // 1000 = 1s,
     setTimeout( () => {
      client.sendMessage(from, '5 Detik lagi', text) // ur cods
     }, 5000) // 1000 = 1s,
     setTimeout( () => {
      client.sendMessage(from, '10 Detik lagi', text) // ur cods
     }, 0) // 1000 = 1s,
     break
*/

    case 'getidgroup':
     reply(groupId)
     break

    case 'setprefix':
     if(args.length < 1) return
     if(!isOwner) return reply(mess.only.ownerB)
     prefix = args[0]
     reply(`Prefix berhasil di ubah menjadi : ${prefix}`)
     break

    case 'tagall':
     if(!isGroup) return reply(mess.only.group)
     if(!isGroupAdmins) return reply(mess.only.admin)
     if(groupId != '6285790784469-1588930032@g.us') return reply('[❗] Fitur ini khusus Premium. ❌') 
     members_id = []
     teks = (args.length > 1) ? body.slice(8).trim() : ''
     for(let mem of groupMembers){
      teks += `╿➥ @${mem.jid.split('@')[0]}\n`
      members_id.push(mem.jid)
     }
     daftar = '╭════•›「 Daftar Member Grup 」\n'
            + '╿\n'
            + '╿➥ Total: ' + groupMembers. length + '\n'
            + '╿\n'
            + teks
            + '╿\n'
            + '╰═══════════════════════════'
     mentions(daftar, members_id, true)
     break

/*
    case 'bcgrup':
     if(!isOwner) return reply(mess.only.ownerB)
     if(isMedia && !mek.message.videoMessage || isQuotedImage){
      const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
      buff = await client.downloadMediaMessage(encmedia)
      for(let _ of bcgrup){
       client.sendMessage(_.jid, buff, image, {caption: `${body.slice(6)}`})
      }
      reply('Sukses broadcast group 1')
     }else{
      for(let _ of bcgrup){
       sendMess(_.jid, `${body.slice(6)}`)
      }
      reply('Suksess broadcast group 2')
     }
     break

    case 'bcgc':
     client.updatePresence(from, Presence.composing) 
     if(!isOwner) return reply(mess.only.ownerB)
     if(args.length < 1) return reply('.......')
     if(isMedia && !mek.message.videoMessage || isQuotedImage){
      const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
      buff = await client.downloadMediaMessage(encmedia)
      for(let _ of groupMembers){
       client.sendMessage(_.jid, buff, image, {caption: `*「 BC GROUP 」*\n*Group* : ${groupName}\n\n${body.slice(6)}`})
      }
      reply('Sukses broadcast group')
     }else{
      for(let _ of groupMembers){
       sendMess(_.jid, `*「 BC GROUP 」*\n*Group* : ${groupName}\n\n${body.slice(6)}`)
      }
      reply('Sukses broadcast group')
     }
     break
*/

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

/*
    case 'igstalk':
     hmm = await fetchJson(`https://freerestapi.herokuapp.com/api/v1/igs?u=${body.slice(9)}`)
     buffer = await getBuffer(hmm.data.profilehd)
     hasil = `Fullname : ${hmm.data.fullname}\npengikut : ${hmm.data.follower}\nMengikuti : ${hmm.data.following}\nPrivate : ${hmm.data.private}\nVerified : ${hmm.data.verified}\nbio : ${hmm.data.bio}`
     client.sendMessage(from, buffer, image, {quoted: mek, caption: hasil})
     break
 */

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
       fs.unlinkSync(media)
       reply(mess.error.stick)
      })
      .on('end', function (){
       //console.log('Finish')
       client.sendMessage(from, fs.readFileSync(ran), sticker, {quoted: mek})
       fs.unlinkSync(media)
       fs.unlinkSync(ran)
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
       fs.unlinkSync(media)
       tipe = media.endsWith('.mp4') ? 'video' : 'gif'
       reply(`❌ Gagal, pada saat mengkonversi ${tipe} ke stiker`)
      })
      .on('end', function (){
       //console.log('Finish')
       buff = fs.readFileSync(ran)
       client.sendMessage(from, buff, sticker)
       fs.unlinkSync(media)
       fs.unlinkSync(ran)
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

    case 'welcome':
     if(!isGroup) return reply(mess.only.group)
     if(!isGroupAdmins) return reply(mess.only.Badmin)
     if(args.length < 1) return reply('ketik 1 untuk mengaktifkan')
     if(Number(args[0]) === 1){
      if(isWelkom) return reply('fitur sudah aktif')
      welkom.push(from)
      fs.writeFileSync('./database/json/welkom.json', JSON.stringify(welkom))
      reply('❬ SUCCESS ❭ mengaktifkan fitur welcome di group ini')
     }else if (Number(args[0]) === 0){
      welkom.splice(from, disable)
      fs.writeFileSync('./database/json/welkom.json', JSON.stringify(welkom))
      reply('❬ SUCCESS ❭ menonaktifkan fitur welcome di group ini')
     }else{
      reply('ketik 1 untuk mengaktifkan, 0 untuk menonaktifkan fitur')
     }
     break

    case 'delete':
    case 'del':
     if(!isGroup)return reply(mess.only.group)
     if(!isGroupAdmins)return reply(mess.only.admin)
     client.deleteMessage(from, { id: mek.message.extendedTextMessage.contextInfo.stanzaId, remoteJid: from, fromMe: true })
     break

    //case 'ping':
     //await client.sendMessage(from, `Pong!!!\nSpeed: ${processTime(time, moment())} _Second_`)
     //break

    default:
     if(isGroup){
      if(budy)
      console.log('ID Grup: '+groupId+'\nNama Grup: '+groupName+'\nFrom: '+sender+'\nChat: '+budy+'\n\n')
      if(!bcgrup.includes(groupId))
      bcgrup.push(groupId)
      fs.writeFileSync('./database/json/bcgrup.json', JSON.stringify(bcgrup))
      //console.log(budy)
      //muehe = await simih(budy)
      //console.log(muehe)
      //reply(muehe)
     }else{
      //console.log(color('[WARN]','red'), 'Unregistered Command from', color(sender.split('@')[0]))
     }
   }
  }catch (e){
   console.log('Error : %s', color(e, 'red'))
  }
 })
}
starts()

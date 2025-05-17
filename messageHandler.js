const fs = require('fs');

const yasakliKelimeler = fs.readFileSync('yasakli-kelimeler.txt', 'utf8').split('\n').map(k => k.trim());

function handleMessage(client, message, ayarlar) {
  const metin = message.body.toLowerCase();

  if (message.from === 'status@broadcast') return;

  for (const kelime of yasakliKelimeler) {
    if (metin.includes(kelime)) {
      if (kelime.startsWith('tr')) {
        client.sendText(message.from, 'WhatsApp üzerinden IBAN bilgisi paylaşımı kabul edilmiyor.');
      } else {
        client.sendText(message.from, 'Lütfen uygun bir dil kullanınız.');
      }
      return;
    }
  }

  const sikayetKelimeleri = [
    'şikayet edicem', 'savcılığa gidicem', 'karakola gidiyorum', 'iade istiyorum',
    'paramı geri verin', 'paramı istiyorum', 'tüketici mahkemesine gidicem', 'dolandırdınız'
  ];

  if (sikayetKelimeleri.some(k => metin.includes(k))) {
    client.sendText(message.from, 'Tüketici mahkemesine başvurarak daha hızlı sonuç alabilirsiniz. Şikayetinizi bu formdan bize iletebilirsiniz: https://docs.google.com/forms/d/e/1FAIpQLSfhpcjI_XjuUB10hPjaamWTsvFTD3BfxvaOStqVDHTqgxEsow/viewform');
    return;
  }

  if (metin.includes('modemim gelmedi') || metin.includes('kaç gün oldu') || metin.includes('hala gelmedi')) {
    client.sendText(message.from, 'Kargonuz maksimum 48 saat içinde teslim edilir. Bazen sistemsel gecikmeler yaşanabilir. Durumu kurulum hattımızdan sorgulatabilirsiniz: 5506987031');
    return;
  }

  if (metin.includes('kurulum')) {
    client.sendText(message.from, 'Kurulum için 5506987031 numarasına WhatsApp üzerinden ulaşmanız gerekmektedir. Ekipler en kısa sürede sizinle iletişime geçecektir.');
    return;
  }

  client.sendText(message.from, ayarlar.merhabaMesaji);
}

module.exports = { handleMessage };

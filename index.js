const express = require('express');
const axios = require('axios');
const app = express();

const ACCESS_TOKEN = 'EAAFzdePrfwsBO9GIrjsKOtQDlpflULwCNzZANT2EOYP1mpoZBE33ZCIv2Q2y39j4O2DxOTcOcoo6aJZCr41gZCLTSvWGFuZBrF7kbcZBKwcRZC7WtsZBLyIFmZAASsVOSXPuuBNJZC0u2vTgVlgB2qwdMvo2T3ZCIdXjgo9Lu9zWcVJXWg2Cy01EsqejZCoXx9qeGfMquyCHZAmilyEAexQszTSScfiZAPAQQxy';
const PHONE_ID = '438514116006700';

app.use(express.json());

// Webhook para receber mensagens
app.get('/webhook', (req, res) => {
    const verifyToken = 'EAAFzdePrfwsBO9GIrjsKOtQDlpflULwCNzZANT2EOYP1mpoZBE33ZCIv2Q2y39j4O2DxOTcOcoo6aJZCr41gZCLTSvWGFuZBrF7kbcZBKwcRZC7WtsZBLyIFmZAASsVOSXPuuBNJZC0u2vTgVlgB2qwdMvo2T3ZCIdXjgo9Lu9zWcVJXWg2Cy01EsqejZCoXx9qeGfMquyCHZAmilyEAexQszTSScfiZAPAQQxy';

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === verifyToken) {
            console.log('WEBHOOK_VERIFICADO');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    }
});


// Enviar mensagem para o WhatsApp
const sendMessage = async (phoneNumber, text) => {
    const url = `https://graph.facebook.com/v13.0/${PHONE_ID}/messages`;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
    };
    const data = {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: { body: text },
    };

    try {
        const response = await axios.post(url, data, { headers });
        console.log('Mensagem enviada:', response.data);
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error.response.data);
    }
};

// Testar envio de mensagem
app.get('/send', (req, res) => {
    const testPhoneNumber = '5594991989803'; // Substitua pelo número de telefone para teste
    sendMessage(testPhoneNumber, 'Olá! Este é um teste de bot.');
    res.send('Mensagem de teste enviada!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});


# AlertifyBot - Twitch Bot para Notificações ao Vivo

O AlertifyBot é um bot para Twitch desenvolvido para enviar notificações automáticas em servidores do Discord sempre que um streamer estiver ao vivo. Ele verifica periodicamente o status de streams configurados e envia mensagens de alerta com detalhes sobre o stream diretamente para canais no Discord.

<img src="./public/img/AlertifyBot.png" alt="App Screenshot" width="400" />

##  **🚀 Funcionalidades**

- **Notificação de Stream Ao Vivo**  
  O bot monitora streams configuradas e envia notificações automáticas para canais do Discord quando um streamer estiver ao vivo.

- **Mensagens Personalizadas**  
  Inclui detalhes como:
  - **Título da live**
  - **Jogo em transmissão**
  - **Link direto para assistir ao vivo**


- **Fixação de Mensagens**  
  Mensagens de notificação são fixadas automaticamente no canal para garantir maior visibilidade.

- **Atualizações Automáticas**  
  Quando a transmissão termina, o bot notifica o canal e atualiza o status do streamer.

- **Verificação de Status**  
  Respostas automáticas caso o streamer esteja offline ou se o canal não estiver configurado corretamente.

## **🛠️ Tecnologias Utilizadas**

- **NodeJs**
- **NestJs**
- **Supabase**
- **Prisma**
- **Discord.Js**
- **Twitch API**
- **Cron Jobs**
  
## **📋 Como Funciona**

- O **AlertifyBot** verifica o status de streams configuradas a cada intervalo de 30 segundos.
-  Quando detecta um streamer online:
   - Envia uma mensagem personalizada no canal.
   - A mensagem inclui:
     - Título da live  
     - Jogo transmitido  
     - Link para a transmissão ao vivo  

- Caso o streamer encerre a transmissão:
   - O bot envia uma mensagem notificando que a live terminou.
   - Atualiza automaticamente o status no servidor.

## **Exemplo de notificação enviada pelo bot:**

![Demonstração do Card](./public/img/CardAlertifyBot.png)


## **📦 Configuração**
 1 - Clone o repositório: 
```
https://github.com/lazaroalvesr/AlertifyBot
```
2 - Instale as dependências:
```
npm install
```
3 - Configure o arquivo .env com base no exemplo fornecido:
``` 
DATABASE_URL="Sua URL de conexão com banco de dados"
DIRECT_URL="Sua URL de conexão com banco de dados"

DISCORD_TOKEN="TOKEN do Discord"
DISCORD_CLIENT_ID="Seu Client ID do Discord"

TWITCH_CLIENT_ID="Seu Client ID da Twitch"
TWITCH_CLIENT_SECRET="Seu Client Secret da Twitch"
TWITCH_OAUTH_TOKEN="Seu OAuth Token"
TWITCH_API_URL="https://api.twitch.tv/helix/streams"
```
4 - Inicie o bot:
```
npm run start:dev
```

## **📚 Exemplo de Uso**
- Configure os canais de Discord e streamers que deseja monitorar.
- O bot enviará notificações automáticas conforme o status dos streamers muda.



## *✍️ *Autor**
- [@lazaroalvesr](https://github.com/lazaroalvesr)


## 🔗 Links
- [Rifaflow](https://raffle-master-front.vercel.app/)

[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://www.lazaroalvesr.com/)

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/l%C3%A1zaro-alves-r/)



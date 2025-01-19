
# AlertifyBot - Twitch Bot para Notificações ao Vivo  

O AlertifyBot é um bot para Twitch desenvolvido para enviar notificações automáticas em servidores do Discord sempre que um streamer estiver ao vivo. Ele verifica periodicamente o status de streams de usuários configurados e envia mensagens de alerta com detalhes sobre o stream para canais de Discord.

![App Screenshot](./public/img/AlertifyBot.png)

## Funcionalidades

- **Notificação de Stream Ao Vivo**: O bot verifica periodicamente o status de streams de usuários configurados e envia mensagens para canais no Discord quando um streamer estiver ao vivo.
- **Mensagens Personalizadas**: Envia informações detalhadas sobre o stream, como o título da live, o jogo em transmissão e um link direto para assistir ao vivo.
- **Mensagens Fixadas**: Após a notificação, a mensagem é automaticamente fixada no canal do Discord para garantir visibilidade.
- **Verificação de Status**: A cada verificação, o bot também gerencia o status de lives, notificando quando o streamer sai do ar.
- **Respostas Automatizadas**:Respostas automáticas quando o status do stream muda ou se o canal não está configurado corretamente.


## Tecnologias Utilizadas:

- NodeJs
- NestJs
- Supabase
- Prisma
- Discord.Js
- Twitch API
- Cron Jobs
  
## Como Funciona:

- O **AlertifyBot** verifica o status de streams configurados a cada intervalo de 30 segundos.
- Se um streamer estiver ao vivo, ele envia uma mensagem personalizada no canal do Discord configurado.
- A mensagem inclui detalhes como o título da live, o jogo transmitido e um link para a transmissão ao vivo.
- Se o streamer não estiver mais ao vivo, o bot atualiza o status e envia uma notificação indicando que a transmissão foi encerrada.


## Authors

- [@lazaroalvesr](https://github.com/lazaroalvesr)


## 🔗 Links
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://www.lazaroalvesr.com/)

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/l%C3%A1zaro-alves-r/)



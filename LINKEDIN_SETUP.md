# LinkedIn OAuth Setup Guide

Este guia explica como configurar a integração com LinkedIn OAuth para habilitar a conexão automática no aplicativo.

## Pré-requisitos

1. Conta no LinkedIn
2. Acesso ao LinkedIn Developers Portal

## Passos para Configuração

### 1. Criar um App no LinkedIn

1. Acesse [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Clique em "Create app"
3. Preencha as informações:
   - **App name**: Job Search Manager (ou nome de sua escolha)
   - **LinkedIn Page**: Selecione uma página da sua empresa (ou crie uma)
   - **App logo**: Upload de uma imagem (512x512 px)
   - **Legal agreement**: Aceite os termos

### 2. Configurar OAuth 2.0

1. No dashboard do app, vá para a aba **Auth**
2. Em **OAuth 2.0 settings**, adicione as seguintes URLs de redirecionamento:
   ```
   http://localhost:5173/linkedin/callback
   ```

   Para produção, adicione também:
   ```
   https://seu-dominio.com/linkedin/callback
   ```

3. Anote as credenciais:
   - **Client ID**
   - **Client Secret**

### 3. Solicitar Permissões

1. Na aba **Products**, solicite acesso aos seguintes produtos:
   - **Sign In with LinkedIn using OpenID Connect** (aprovação instantânea)
   - **Share on LinkedIn** (aprovação instantânea)
   - **Marketing Developer Platform** (requer aprovação - para SSI Score)

2. Aguarde a aprovação (geralmente instantânea para Sign In e Share)

### 4. Configurar Variáveis de Ambiente

1. No backend, copie o arquivo `.env.example` para `.env`:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. Edite o arquivo `backend/.env` e adicione suas credenciais do LinkedIn:
   ```env
   LINKEDIN_CLIENT_ID=seu-client-id-aqui
   LINKEDIN_CLIENT_SECRET=seu-client-secret-aqui
   LINKEDIN_REDIRECT_URI=http://localhost:5173/linkedin/callback
   ```

### 5. Reiniciar o Servidor

Reinicie o servidor backend para aplicar as novas configurações:
```bash
cd backend
npm run dev
```

## Como Usar

1. Faça login no aplicativo
2. Vá para **Settings** (Configurações)
3. Na seção **LinkedIn Integration**, clique em "Connect LinkedIn"
4. Uma janela popup abrirá solicitando autorização do LinkedIn
5. Autorize o aplicativo
6. Após a autorização, a janela fechará automaticamente e você verá o status "Connected ✓"

## Funcionalidades Disponíveis

Após conectar o LinkedIn:

- ✅ **Publicação Automática**: Posts podem ser publicados diretamente no LinkedIn
- ✅ **SSI Score**: Pontuação de Social Selling Index (simulado no MVP, real com Marketing Developer Platform)
- ✅ **Status de Conexão**: Visualização do status da conexão

## Troubleshooting

### Erro: "Invalid redirect URI"
- Verifique se a URL de callback está exatamente igual no LinkedIn App e no `.env`
- Certifique-se de que não há espaços extras ou caracteres especiais

### Erro: "Invalid client credentials"
- Verifique se o Client ID e Client Secret estão corretos no `.env`
- Certifique-se de que não há espaços antes ou depois das credenciais

### Popup bloqueado
- Certifique-se de que seu navegador permite popups para localhost
- Tente novamente após permitir popups

### Token expirado
- Tokens de acesso expiram após 60 dias
- O sistema tentará renovar automaticamente usando o refresh token
- Se falhar, será necessário reconectar manualmente

## Limitações do MVP

No MVP atual:

- **SSI Score**: É simulado (valor aleatório entre 70-100). Para obter o score real, é necessário:
  - Aprovação do LinkedIn Marketing Developer Platform
  - Implementação de web scraping (com cuidado para não violar ToS)
  - Ou uso de métricas alternativas baseadas em engajamento

- **Publicação de Posts**: A API de compartilhamento do LinkedIn está disponível, mas requer:
  - Aprovação do "Share on LinkedIn" product
  - Implementação da lógica de publicação (já estruturada no código)

## Referências

- [LinkedIn OAuth 2.0 Documentation](https://docs.microsoft.com/en-us/linkedin/shared/authentication/authentication)
- [LinkedIn API Reference](https://docs.microsoft.com/en-us/linkedin/marketing/)
- [Share on LinkedIn](https://docs.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin)

## Segurança

⚠️ **IMPORTANTE**:
- Nunca commite o arquivo `.env` com credenciais reais
- Use variáveis de ambiente em produção
- Tokens são criptografados antes de serem armazenados no banco de dados
- O refresh token é usado para renovar automaticamente tokens expirados

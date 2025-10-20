# Guia de Deploy - apragmatica.com.br

## Visão Geral

Este guia detalha como publicar a aplicação Job Search Management System no domínio **apragmatica.com.br**.

### Arquitetura do Projeto
- **Backend**: Node.js + Express + TypeScript (porta 3000)
- **Frontend**: React + Vite + TypeScript (SPA)
- **Banco de Dados**: MongoDB
- **Domínio**: apragmatica.com.br

---

## Opção 1: VPS Tradicional (Mais Controle)

### Provedores Recomendados
| Provedor | Custo/mês | Recursos | Melhor Para |
|----------|-----------|----------|-------------|
| **DigitalOcean** | $6 USD | 1GB RAM, 25GB SSD | Pequeno/Médio |
| **Vultr** | $6 USD | 1GB RAM, 25GB SSD | Pequeno/Médio |
| **Hostinger VPS** | R$ 29,99 | 1GB RAM, 20GB SSD | Começar (aceita Real) |
| **Contabo** | €4.50 | 4GB RAM, 50GB SSD | Melhor custo-benefício |

### Passo a Passo VPS

#### 1. Contratar VPS
- Escolha um provedor (recomendo DigitalOcean ou Contabo)
- Selecione Ubuntu 22.04 LTS
- Escolha região mais próxima (São Paulo ou EUA)
- Configure chave SSH

#### 2. Configurar Domínio
No painel do **Registro.br** (onde seu domínio está registrado):
```
Tipo  | Nome | Valor
A     | @    | [IP-DO-SEU-VPS]
A     | www  | [IP-DO-SEU-VPS]
```

#### 3. Preparar Servidor
```bash
# Conectar via SSH
ssh root@seu-ip-vps

# Atualizar sistema
apt update && apt upgrade -y

# Instalar Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

# Instalar MongoDB
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt update
apt install -y mongodb-org
systemctl start mongod
systemctl enable mongod

# Instalar Nginx
apt install -y nginx

# Instalar PM2 (gerenciador de processos)
npm install -g pm2

# Instalar Certbot (SSL grátis)
apt install -y certbot python3-certbot-nginx
```

#### 4. Configurar SSL (HTTPS)
```bash
certbot --nginx -d apragmatica.com.br -d www.apragmatica.com.br
```

#### 5. Deploy da Aplicação
```bash
# Criar diretório
mkdir -p /var/www/apragmatica
cd /var/www/apragmatica

# Clonar repositório (ou fazer upload via SFTP)
git clone <seu-repositorio-git> .

# Configurar Backend
cd backend
cp .env.example .env
nano .env  # Editar com valores de produção
npm install
npm run build

# Iniciar backend com PM2
pm2 start dist/index.js --name "jobsearch-api"
pm2 save
pm2 startup

# Configurar Frontend
cd ../frontend
cp .env.example .env
nano .env  # Configurar VITE_API_URL=https://apragmatica.com.br/api/v1
npm install
npm run build
```

#### 6. Configurar Nginx
Criar arquivo `/etc/nginx/sites-available/apragmatica`:

```nginx
server {
    listen 80;
    server_name apragmatica.com.br www.apragmatica.com.br;

    # Frontend (React SPA)
    location / {
        root /var/www/apragmatica/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/v1 {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ativar configuração:
```bash
ln -s /etc/nginx/sites-available/apragmatica /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## Opção 2: Plataforma PaaS (Mais Fácil)

### Provedores Recomendados
| Provedor | Backend | Frontend | Banco de Dados | Custo Total |
|----------|---------|----------|----------------|-------------|
| **Railway** | $5/mês | Incluído | MongoDB Atlas Free | $5/mês |
| **Render** | Free/$7 | Free | MongoDB Atlas Free | $0-7/mês |
| **Fly.io** | ~$5/mês | Incluído | MongoDB Atlas Free | $5/mês |

### Passo a Passo Railway (RECOMENDADO)

#### 1. Preparar Código
Já incluirei os arquivos necessários no próximo passo.

#### 2. Banco de Dados MongoDB Atlas
1. Acesse [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Crie conta gratuita
3. Crie cluster FREE (M0)
4. Configure Network Access: `0.0.0.0/0` (permitir todos)
5. Crie usuário do banco
6. Copie string de conexão: `mongodb+srv://user:pass@cluster.mongodb.net/jobsearch`

#### 3. Deploy Backend no Railway
1. Acesse [railway.app](https://railway.app)
2. Conecte GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Selecione o repositório
5. Configure Root Directory: `/backend`
6. Adicione variáveis de ambiente:
```
NODE_ENV=production
PORT=3000
MONGODB_URI=<string-do-atlas>
JWT_SECRET=<gerar-senha-forte>
JWT_REFRESH_SECRET=<gerar-senha-forte>
ANTHROPIC_API_KEY=<sua-chave>
CORS_ORIGIN=https://apragmatica.com.br
```
7. Railway gerará URL: `nome-projeto.up.railway.app`

#### 4. Deploy Frontend no Railway
1. No mesmo projeto Railway, clique "New Service"
2. Selecione mesmo repositório
3. Configure Root Directory: `/frontend`
4. Adicione variável de ambiente:
```
VITE_API_URL=https://nome-backend.up.railway.app/api/v1
```

#### 5. Configurar Domínio Customizado

**No Railway:**
1. Vá em Settings do serviço Frontend
2. Em "Domains", clique "Custom Domain"
3. Adicione: `apragmatica.com.br`
4. Railway mostrará registros DNS necessários

**No Registro.br:**
```
Tipo   | Nome | Valor
CNAME  | @    | <valor-fornecido-railway>
CNAME  | www  | <valor-fornecido-railway>
```

**Configurar Backend API:**
1. No serviço Backend, adicione custom domain: `api.apragmatica.com.br`
2. Adicione no Registro.br:
```
CNAME  | api  | <valor-fornecido-railway>
```
3. Atualize variável de ambiente no Frontend:
```
VITE_API_URL=https://api.apragmatica.com.br/api/v1
```

---

## Opção 3: Vercel + Render (Camada Gratuita)

### Frontend na Vercel (Grátis)
1. Acesse [vercel.com](https://vercel.com)
2. Importe repositório do GitHub
3. Configure:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Adicione domínio customizado: `apragmatica.com.br`
5. Configure DNS no Registro.br conforme instruções da Vercel

### Backend no Render (Grátis com limitações)
1. Acesse [render.com](https://render.com)
2. "New Web Service" → conectar GitHub
3. Configure:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
4. Adicione variáveis de ambiente
5. Serviço vai dormir após inatividade (plano free)

---

## Resumo de Recomendações

### Para Começar Rápido (Recomendado)
**Railway + MongoDB Atlas**
- ✅ Fácil de configurar
- ✅ SSL automático
- ✅ CI/CD automático
- ✅ Custo inicial baixo (~$5/mês)
- ✅ Escalável

### Para Controle Total
**VPS (DigitalOcean/Contabo)**
- ✅ Controle completo
- ✅ Performance previsível
- ✅ Melhor custo-benefício longo prazo
- ❌ Requer conhecimento de DevOps
- ❌ Você gerencia segurança/backups

### Para Testar Grátis
**Vercel (Frontend) + Render Free (Backend) + MongoDB Atlas**
- ✅ Totalmente grátis
- ❌ Backend dorme após inatividade
- ❌ Limitações de recursos

---

## Próximos Passos

Qual opção você prefere? Posso:
1. Criar os arquivos de configuração necessários
2. Preparar scripts de deploy
3. Configurar CI/CD com GitHub Actions
4. Ajudar com qualquer uma das opções acima

**Minha recomendação:** Comece com Railway ($5/mês) - é o melhor equilíbrio entre facilidade e funcionalidade.

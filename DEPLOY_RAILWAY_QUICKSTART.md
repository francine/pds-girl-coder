# Deploy Rápido no Railway - apragmatica.com.br

Guia simplificado para publicar seu projeto no Railway (~$5/mês).

## Pré-requisitos
- [ ] Conta no GitHub (com repositório do projeto)
- [ ] Domínio apragmatica.com.br registrado
- [ ] Cartão de crédito para Railway (após período free)

---

## Passo 1: Preparar MongoDB (5 minutos)

### 1.1 Criar conta no MongoDB Atlas
1. Acesse: https://www.mongodb.com/cloud/atlas/register
2. Faça cadastro gratuito (pode usar Google/GitHub)
3. Escolha plano **FREE (M0 Sandbox)**

### 1.2 Configurar Cluster
1. Escolha provedor: **AWS**
2. Região: **São Paulo (sa-east-1)** ou **N. Virginia (us-east-1)**
3. Clique em **Create Deployment**

### 1.3 Criar Usuário do Banco
1. Em "Security" → "Database Access", clique **Add New Database User**
2. Username: `jobsearch`
3. Password: **[gere uma senha forte e SALVE]**
4. Database User Privileges: **Read and write to any database**
5. Clique em **Add User**

### 1.4 Liberar Acesso de Rede
1. Em "Security" → "Network Access", clique **Add IP Address**
2. Clique em **Allow Access From Anywhere** (0.0.0.0/0)
3. Clique em **Confirm**

### 1.5 Obter String de Conexão
1. Clique em **Connect** no seu cluster
2. Escolha **Drivers**
3. Copie a connection string:
```
mongodb+srv://jobsearch:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```
4. **IMPORTANTE**: Substitua `<password>` pela senha que você criou
5. Adicione o nome do banco no final: `/jobsearch`
```
mongodb+srv://jobsearch:SuaSenha123@cluster0.xxxxx.mongodb.net/jobsearch?retryWrites=true&w=majority
```

✅ **SALVE** essa string - você vai precisar dela!

---

## Passo 2: Gerar Secrets de Segurança (2 minutos)

No terminal do seu projeto, execute:

```bash
cd /Users/francine/My\ Repositories/pds-girl-coder
./scripts/generate-secrets.sh
```

Você verá algo assim:
```
JWT_SECRET:
Ab12Cd34Ef56...

JWT_REFRESH_SECRET:
Gh78Ij90Kl12...

ENCRYPTION_KEY:
Mn34Op56Qr78...
```

✅ **COPIE** esses valores - você vai precisar deles!

---

## Passo 3: Deploy no Railway (10 minutos)

### 3.1 Criar Conta e Projeto
1. Acesse: https://railway.app
2. Faça login com GitHub
3. Clique em **New Project**
4. Escolha **Deploy from GitHub repo**
5. Selecione o repositório `pds-girl-coder`

### 3.2 Configurar Backend

Railway detectará automaticamente a pasta `/backend`.

#### Adicionar Variáveis de Ambiente:
1. Clique no serviço **backend**
2. Vá em **Variables**
3. Clique em **New Variable** e adicione:

```bash
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://apragmatica.com.br

# Cole a string do MongoDB Atlas aqui
MONGODB_URI=mongodb+srv://jobsearch:SuaSenha@cluster0.xxxxx.mongodb.net/jobsearch?retryWrites=true&w=majority

# Cole os secrets gerados anteriormente
JWT_SECRET=Ab12Cd34Ef56...
JWT_REFRESH_SECRET=Gh78Ij90Kl12...
ENCRYPTION_KEY=Mn34Op56Qr78...

JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Sua chave do Claude (se você tiver)
ANTHROPIC_API_KEY=sk-ant-api...
```

4. Clique em **Deploy** (ou aguarde deploy automático)

#### Obter URL do Backend:
1. Após deploy, clique em **Settings**
2. Em **Domains**, você verá algo como: `backend-production-xxxx.up.railway.app`
3. ✅ **COPIE** essa URL

### 3.3 Configurar Frontend

1. No projeto Railway, clique em **New Service**
2. Selecione **GitHub Repo** → mesmo repositório
3. Railway criará outro serviço

#### Configurar Root Directory:
1. Clique no serviço **frontend**
2. Vá em **Settings**
3. Em **Root Directory**, coloque: `/frontend`
4. Clique em **Deploy**

#### Adicionar Variável de Ambiente:
1. Vá em **Variables**
2. Adicione:
```bash
VITE_API_URL=https://backend-production-xxxx.up.railway.app/api/v1
```
(Use a URL que você copiou do backend)

3. **Redeploy** (pode ser necessário clicar em "Restart")

---

## Passo 4: Configurar Domínio Customizado (15 minutos)

### 4.1 Configurar no Railway

#### Frontend (Site Principal):
1. No serviço **frontend**, vá em **Settings**
2. Em **Networking** → **Public Networking**, clique **Generate Domain**
3. Clique em **Custom Domain**
4. Digite: `apragmatica.com.br`
5. Railway mostrará instruções de DNS

#### Backend (API):
1. No serviço **backend**, vá em **Settings**
2. Clique em **Custom Domain**
3. Digite: `api.apragmatica.com.br`
4. Railway mostrará instruções de DNS

### 4.2 Configurar DNS no Registro.br

1. Acesse: https://registro.br
2. Faça login
3. Vá em **Meus Domínios** → `apragmatica.com.br`
4. Clique em **Editar Zona**
5. Adicione os registros:

**Para o site principal:**
```
Tipo: CNAME
Nome: @
Valor: [valor fornecido pelo Railway para frontend]
TTL: 3600
```

**Para a API:**
```
Tipo: CNAME
Nome: api
Valor: [valor fornecido pelo Railway para backend]
TTL: 3600
```

**Para www (opcional):**
```
Tipo: CNAME
Nome: www
Valor: apragmatica.com.br
TTL: 3600
```

6. Clique em **Salvar**

⏰ **AGUARDE**: Propagação de DNS pode levar de 5 minutos a 48 horas (geralmente 15-30 min)

### 4.3 Atualizar Variáveis de Ambiente

Após DNS configurado, atualize no Railway:

**Backend:**
```bash
CORS_ORIGIN=https://apragmatica.com.br
```

**Frontend:**
```bash
VITE_API_URL=https://api.apragmatica.com.br/api/v1
```

Clique em **Restart** em ambos os serviços.

---

## Passo 5: Verificar Deploy (5 minutos)

### 5.1 Testar Backend
Abra no navegador: https://api.apragmatica.com.br/api/v1/health

Deve retornar algo como:
```json
{
  "status": "ok",
  "timestamp": "2025-10-20T..."
}
```

### 5.2 Testar Frontend
Abra no navegador: https://apragmatica.com.br

Você deve ver a aplicação carregando!

### 5.3 Verificar Logs
No Railway:
1. Clique no serviço (backend ou frontend)
2. Vá em **Deployments**
3. Clique no deployment mais recente
4. Veja logs para identificar erros

---

## Troubleshooting

### Backend não inicia
1. Verifique logs no Railway
2. Confirme que todas as variáveis de ambiente estão corretas
3. Teste string do MongoDB localmente primeiro

### Frontend não carrega
1. Verifique se `VITE_API_URL` está correta
2. Confirme que backend está rodando
3. Veja console do navegador (F12) para erros

### Domínio não funciona
1. Verifique DNS com: `nslookup apragmatica.com.br`
2. Aguarde mais tempo (até 48h)
3. Confirme que CNAME está correto no Registro.br

### CORS errors
1. Verifique `CORS_ORIGIN` no backend
2. Deve ser exatamente o domínio do frontend
3. Sem barra no final: ✅ `https://apragmatica.com.br` ❌ `https://apragmatica.com.br/`

---

## Custos Estimados

| Serviço | Custo/mês |
|---------|-----------|
| MongoDB Atlas (M0) | **Grátis** |
| Railway (2 services) | **$5 USD** (após trial de $5) |
| Domínio apragmatica.com.br | **R$ 40/ano** (já tem) |
| **TOTAL** | **~$5 USD/mês** |

---

## Manutenção

### Deploy de Atualizações
O Railway tem **CI/CD automático**:
1. Faça commit no GitHub
2. Push para branch principal
3. Railway faz deploy automaticamente!

### Backup do Banco
MongoDB Atlas faz backup automático no plano FREE.

### Monitoramento
- Railway mostra métricas de CPU/RAM/Rede
- Configure alerts em Settings → Notifications

---

## Próximos Passos Opcionais

- [ ] Configurar email (SendGrid ou AWS SES)
- [ ] Adicionar Google Analytics
- [ ] Configurar monitoramento (Sentry)
- [ ] Adicionar CI/CD tests
- [ ] Configurar backups adicionais

---

## Precisa de Ajuda?

Se encontrar problemas:
1. Verifique logs no Railway
2. Teste localmente primeiro
3. Consulte docs: https://docs.railway.app
4. Me pergunte! 🚀

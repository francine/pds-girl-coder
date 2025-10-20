# Checklist Pré-Deploy

Use esta lista antes de fazer deploy para produção.

## Segurança

- [ ] Arquivo `.env` está no `.gitignore` (não commitado)
- [ ] Secrets gerados com `./scripts/generate-secrets.sh`
- [ ] `JWT_SECRET` e `JWT_REFRESH_SECRET` são diferentes
- [ ] `ENCRYPTION_KEY` tem pelo menos 32 caracteres
- [ ] MongoDB: usuário e senha fortes configurados
- [ ] MongoDB: Network Access configurado (0.0.0.0/0 ou IPs específicos)
- [ ] Chave API do Claude configurada (se necessário)

## Configuração Backend

- [ ] `NODE_ENV=production` configurado
- [ ] `MONGODB_URI` aponta para MongoDB Atlas (não localhost)
- [ ] `CORS_ORIGIN` configurado com domínio correto
- [ ] `PORT` configurado (Railway usa variável automática)
- [ ] Todas variáveis de `.env.production.example` preenchidas

## Configuração Frontend

- [ ] `VITE_API_URL` aponta para URL de produção do backend
- [ ] Build de produção testado localmente: `npm run build`
- [ ] Preview testado: `npm run preview`

## Testes Locais

- [ ] Backend compila sem erros: `npm run build` (em `/backend`)
- [ ] Frontend compila sem erros: `npm run build` (em `/frontend`)
- [ ] Conexão com MongoDB funciona
- [ ] API responde corretamente
- [ ] TypeScript sem erros: `npm run type-check`
- [ ] Linter sem erros: `npm run lint`

## Git e GitHub

- [ ] Repositório está no GitHub
- [ ] Branch principal está atualizada
- [ ] `.gitignore` configurado corretamente
- [ ] Sem arquivos sensíveis commitados (.env, keys, etc)
- [ ] README.md atualizado com informações do projeto

## Domínio

- [ ] Domínio apragmatica.com.br está registrado
- [ ] Acesso ao painel do Registro.br disponível
- [ ] Sabe como editar zona DNS

## Contas e Serviços

- [ ] Conta GitHub criada
- [ ] Conta MongoDB Atlas criada (free tier)
- [ ] Conta Railway criada
- [ ] Cartão de crédito disponível para Railway (após trial)
- [ ] Conta Anthropic Claude (se usar AI)

## Documentação

- [ ] Leu `DEPLOY_GUIDE.md` - visão geral de opções
- [ ] Leu `DEPLOY_RAILWAY_QUICKSTART.md` - guia passo a passo
- [ ] Entende arquitetura do projeto
- [ ] Sabe onde ver logs de erro

## Após Deploy

- [ ] Backend responde: `https://api.apragmatica.com.br/api/v1/health`
- [ ] Frontend carrega: `https://apragmatica.com.br`
- [ ] Registro de usuário funciona
- [ ] Login funciona
- [ ] Funcionalidades principais testadas
- [ ] Logs verificados no Railway (sem erros críticos)
- [ ] Certificado SSL ativo (HTTPS funcionando)

## Opcionais (mas recomendados)

- [ ] Monitoramento configurado (Sentry, LogRocket)
- [ ] Analytics configurado (Google Analytics, Plausible)
- [ ] Email transacional configurado (SendGrid, AWS SES)
- [ ] Backup manual do banco de dados feito
- [ ] Documentação de API atualizada
- [ ] Testes automatizados rodando

## Comandos Úteis

### Gerar secrets
```bash
./scripts/generate-secrets.sh
```

### Testar build local
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

### Verificar variáveis
```bash
# Backend
cd backend
cat .env

# Frontend
cd frontend
cat .env.production
```

## Em Caso de Erro

1. **Verifique logs** no Railway
2. **Teste localmente** primeiro
3. **Verifique variáveis** de ambiente
4. **Consulte** guias de deploy
5. **Valide DNS** com `nslookup apragmatica.com.br`

---

✅ Quando todos os itens estiverem marcados, você está pronto para deploy!

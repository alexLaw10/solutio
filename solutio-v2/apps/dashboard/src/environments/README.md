# Configuração de Variáveis de Ambiente

Este projeto utiliza arquivos de environment para configurar URLs de APIs e outras configurações específicas do ambiente.

## Estrutura

- `environment.ts` - Configurações para desenvolvimento
- `environment.prod.ts` - Configurações para produção (usado automaticamente no build de produção)

## Variáveis Disponíveis

### API Configuration
- `api.openMeteo.baseUrl` - URL base da API Open Meteo (padrão: `https://api.open-meteo.com`)

### Default Location
- `defaultLocation.lat` - Latitude padrão (padrão: `-7.1153` - João Pessoa, PB)
- `defaultLocation.lng` - Longitude padrão (padrão: `-34.8641` - João Pessoa, PB)

## Como Usar

### Desenvolvimento Local

1. Edite o arquivo `environment.ts` diretamente:
   ```typescript
   export const environment = {
     production: false,
     api: {
       openMeteo: {
         baseUrl: 'https://api.open-meteo.com', // Altere aqui
       },
     },
     defaultLocation: {
       lat: -7.1153, // Altere aqui
       lng: -34.8641, // Altere aqui
     },
   };
   ```

### Produção

1. Edite o arquivo `environment.prod.ts`:
   ```typescript
   export const environment = {
     production: true,
     api: {
       openMeteo: {
         baseUrl: 'https://api.open-meteo.com', // Altere aqui
       },
     },
     defaultLocation: {
       lat: -7.1153, // Altere aqui
       lng: -34.8641, // Altere aqui
     },
   };
   ```

2. O arquivo `environment.prod.ts` é usado automaticamente durante o build de produção via `fileReplacements` configurado no `project.json`.

### Usando Variáveis de Ambiente (Avançado)

Se você precisar usar variáveis de ambiente do sistema durante o build, você pode:

1. Usar um script de build que substitua valores antes de compilar
2. Usar uma ferramenta como `dotenv` com um script customizado
3. Configurar no seu CI/CD para gerar os arquivos de environment dinamicamente

Exemplo de script (pode ser adicionado ao `package.json`):
```json
{
  "scripts": {
    "build:env": "node scripts/generate-env.js && npm run build"
  }
}
```

## Arquivo .env.example

O arquivo `.env.example` na raiz do projeto serve como documentação das variáveis que podem ser usadas. Se você implementar um sistema de geração automática de arquivos de environment, você pode usar essas variáveis como referência.

## Importante

⚠️ **Nota**: Os arquivos de environment são estáticos e são incluídos no bundle durante o build. Para valores sensíveis, considere usar variáveis de ambiente no servidor ou implementar uma API proxy.

Certifique-se de:
- Nunca commitar informações sensíveis nos arquivos de environment
- Sempre manter os arquivos de environment sincronizados entre desenvolvimento e produção
- Documentar novas configurações neste README

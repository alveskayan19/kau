# Cartinha de Namoro 💌

Site interativo com animações de uma cartinha de namoro. Inclui efeitos visuais como corações caindo e envelope com animação 3D.

## 📋 Requisitos

- Node.js (versão 12 ou superior)
- npm (gerenciador de pacotes)

## 🚀 Como Rodar

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o servidor:**
   ```bash
   npm start
   ```

3. **Abrir no navegador:**
   - Acesse `http://localhost:3000` no seu navegador.

## 📁 Arquivos do Projeto

- `package.json` - Configuração do projeto e dependências
- `server.js` - Servidor Express que serve os arquivos
- `index_Version4.html` - Arquivo HTML principal (interface)
- `styles_Version4.css` - Estilos e animações CSS
- `script_Version4.js` - Lógica JavaScript (interatividade)
- `.gitignore` - Arquivo para ignorar arquivos no Git

## 🎨 Funcionalidades

- ✉️ Envelope interativo que abre/fecha com animação 3D
- 💕 Corações caindo quando o envelope abre (efeito DOM)
- 🎯 Canvas com corações adicionais (efeito visual avançado)
- ⌨️ Efeito "typewriter" ao digitar o texto da cartinha
- 📱 Design responsivo (funciona em celulares e desktops)

## 📝 Personalizando a Cartinha

Abra `script_Version4.js` e procure pela função `setLetterText()`. Você pode trocar o texto da cartinha editando o valor em `defaultText`.

Exemplo:
```javascript
setLetterText(`Meu amor,
Esse é o texto da minha cartinha personalizada.
Te amo!`);
setAuthor('Seu Nome');
```

## 🛠️ Tecnologias

- Express.js - servidor web
- HTML5 - estrutura
- CSS3 - estilos e animações
- JavaScript (Vanilla) - interatividade

## 📄 Licença

MIT

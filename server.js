// Comentário: servidor Express simples que serve a cartinha de namoro.
// Roda na porta 3000 e serve arquivos estáticos (HTML, CSS, JS).

const express = require('express');
const path = require('path');

// Comentário: criar aplicação Express
const app = express();

// Comentário: definir porta (pode ser alterada via variável de ambiente)
const PORT = process.env.PORT || 3000;

// Comentário: servir arquivos estáticos da pasta atual (public ou raiz)
// Isso permite acessar index_Version4.html, styles_Version4.css, script_Version4.js
app.use(express.static(path.join(__dirname)));

// Comentário: rota raiz que serve o arquivo HTML principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index_Version4.html'));
});

// Comentário: iniciar servidor e exibir mensagem de sucesso
app.listen(PORT, () => {
  console.log(`\n✅ Servidor rodando em: http://localhost:${PORT}`);
  console.log(`📝 Abra o navegador e visite: http://localhost:${PORT}\n`);
});

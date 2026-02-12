import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração para __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// O Render disponibiliza a porta na variável de ambiente PORT
const PORT = process.env.PORT || 3000;

// Serve os arquivos estáticos gerados pelo Vite na pasta 'dist'
app.use(express.static(path.join(__dirname, 'dist')));

// Lida com qualquer requisição que não seja um arquivo estático,
// retornando o index.html (fallback para SPA / React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
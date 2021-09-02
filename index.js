const express = require('express');
const bodyParser = require('body-parser');
const {
  getTalkers,
  validateEmail, 
  validatePassword,
  token,
  valideTalker,
  valideTalkerName,
  valideTalkerAge,
  valideTalkerWatchedAt,
  valideTalkerRate,
  valideTalkerToken,
  createTalker,
  updateTalker,
  deleteTalkers,
   } = require('./request');

const app = express();
app.use(bodyParser.json());

const NOT_FOUND = 404;
const ERRO_400 = 400;
const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker/search', valideTalkerToken, async (req, res) => {
  const { q } = req.query;
  const talkers = await getTalkers();
  const talkersIncludes = talkers.filter(({ name }) => name.includes(q));
  return res.status(200).json(talkersIncludes);
});

app.get('/talker', async (_req, res) => {
  const talker = await getTalkers();
  if (talker) {
    return res.status(HTTP_OK_STATUS).json(talker);
  } 
   return res.status(HTTP_OK_STATUS).json([]);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talker = await getTalkers();
  const talkerID = talker.find(({ id: idTalker }) => Number(idTalker) === Number(id));
  if (talkerID) {
    return res.status(HTTP_OK_STATUS).json(talkerID);
  } 
    return res.status(NOT_FOUND).json({ message: 'Pessoa palestrante não encontrada' });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const resultEmail = validateEmail(email);
  const resultPass = validatePassword(password);

  if (!resultEmail && !resultPass) {
    const TOKEN = token(email);
    req.headers.authorization = TOKEN;
  return res.status(HTTP_OK_STATUS).json({ token: TOKEN });
  } if (!validateEmail(email)) {
     return res.status(ERRO_400).json(resultPass);
    } 
      res.status(ERRO_400).json(resultEmail);
});

app.post('/talker',
valideTalkerToken,
valideTalkerName,
valideTalkerAge,
valideTalker,
valideTalkerWatchedAt,
valideTalkerRate,
createTalker,
async (req, res) => {
  const { name, age, talk } = req.body;
  return res.status(201).json({ id: 5, name, age, talk });
});

app.put('/talker/:id',
valideTalkerToken,
valideTalkerName,
valideTalkerAge,
valideTalker,
valideTalkerRate,
valideTalkerWatchedAt,
updateTalker,
 (req, res) => {
  const { id } = req.params;
  const { age, name, talk } = req.body;
  return res.status(HTTP_OK_STATUS).json({ id: +id, age, name, talk });
});

app.delete('/talker/:id', 
valideTalkerToken,
deleteTalkers,
(_req, res) => res.status(HTTP_OK_STATUS)
  .json({ message: 'Pessoa palestrante deletada com sucesso' }));

app.listen(PORT, () => {
  console.log('Online');
});

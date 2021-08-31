const express = require('express');
const bodyParser = require('body-parser');
const { getData, validateEmail, validatePassword, token } = require('./request');

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

app.get('/talker', async (_req, res) => {
  const talker = await getData();
  if (talker) {
    res.status(HTTP_OK_STATUS).json(talker);
  } else {
    res.status(HTTP_OK_STATUS).json([]);
  }
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talker = await getData();
  const talkerID = talker.find(({ id: idTalker }) => Number(idTalker) === Number(id));
  if (talkerID) {
    res.status(HTTP_OK_STATUS).json(talkerID);
  } else {
    res.status(NOT_FOUND).json({ message: 'Pessoa palestrante não encontrada' });
  }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const resultEmail = validateEmail(email);
  const resultPass = validatePassword(password);

  const TOKEN = token(email);
  if (!resultEmail && !resultPass) {
    res.status(HTTP_OK_STATUS).json({ token: TOKEN });
  } else if (!validateEmail(email)) {
      res.status(ERRO_400).json(resultPass);
    } else {
      res.status(ERRO_400).json(resultEmail);
    }
});

app.listen(PORT, () => {
  console.log('Online');
});

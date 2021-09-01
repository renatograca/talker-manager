const fs = require('fs').promises;

const getTalkers = async () => {
  const result = await fs.readFile('./talker.json', 'utf-8').then((res) => JSON.parse(res));
  return result;
};

const updateTalker = async (req, _res, next) => {
  const { id } = req.params;
  const { age, name, talk } = req.body;
  const talkers = await getTalkers();
  const getTalker = talkers.find((talke) => talke.id === +id);
  const talkerUpgrade = {
    id: getTalker.id,
    age,
    name,
    talk,
  };
  const allTalkers = talkers.filter((talke) => talke.is !== +id);
  allTalkers.push(talkerUpgrade);
  await fs.writeFile('./talker.json', JSON.stringify(allTalkers));
  next();
};

const createTalker = async (req, _res, next) => {
  const { name, age, talk } = req.body;
  const talkers = await getTalkers();
  const talker = {
    age,
    id: talkers.length + 1,
    name,
    talk,
  };
  talkers.push(talker);
  await fs.writeFile('./talker.json', JSON.stringify(talkers));
  next();
};

const token = (email) => {
  let toke = '';
  for (let i = 0; i <= 15; i += 1) {
    const indexRandom = Math.round(Math.random() * 6);
      toke += email[indexRandom];
  }
  return toke;
};

const validatePassword = (password = '') => {
  const result = (password.length) > 5;
  const passWith6 = { message: 'O "password" deve ter pelo menos 6 caracteres' };
  const passRequired = { message: 'O campo "password" é obrigatório' };
  
  if (password) {
    if (result) {
      return false;
    } 
      return passWith6;
  } 
    return passRequired;
};

const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  const result = re.test(email);
  const formatEmail = { message: 'O "email" deve ter o formato "email@email.com"' };
  const emailRequired = { message: 'O campo "email" é obrigatório' };
  if (email) {
    if (result) {
      return false;
    } 
    return formatEmail; 
  } 
  return emailRequired;
};

const valideTalkerToken = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  if (authorization.length < 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  next();
};

const valideTalkerName = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  } if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
next();
};

const valideTalkerAge = (req, res, next) => {
  const { age } = req.body;
  if (!age) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  } if (Number(age) <= 18) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  next();
};

const valideTalker = (req, res, next) => {
  const { talk } = req.body;
  if (!talk || (!('watchedAt' in talk) || !('rate' in talk))) {
    return res.status(400)
    .json({ message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios' });
  }
  next();
};

const valideTalkerWatchedAt = (req, res, next) => {
  const { talk: { watchedAt } } = req.body;
  const regexDate = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/;
  if (!regexDate.test(watchedAt)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

const valideTalkerRate = (req, res, next) => {
  const { talk: { rate } } = req.body;
  if (!rate) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  } 
  if (rate < 1) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  if (rate > 5) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }
  next();
};

module.exports = { 
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
  
};
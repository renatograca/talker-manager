const fs = require('fs').promises;

const getData = async () => {
  const result = await fs.readFile('./talker.json', 'utf-8').then((res) => JSON.parse(res));
  return result;
};

const token = (email) => {
  let toke = '';
  for (let i = 0; i <= 15; i += 1) {
    const indexRandom = Math.round(Math.random() * 6);
      toke += email[indexRandom];
  }
  return toke;
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

const validatePassword = (password) => {
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

module.exports = { getData, validateEmail, validatePassword, token };
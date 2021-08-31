const fs = require('fs').promises;

const getData = async () => {
  const result = await fs.readFile('./talker.json', 'utf-8').then((res) => JSON.parse(res));
  return result;
};

module.exports = getData;
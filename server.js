const express = require('express');
const app = express();
const path = require('path');
const { conn, Image } = require('./db');
const fs = require('fs');

app.use(express.json());
app.use('/dist', express.static('dist'));
app.use('/assets', express.static('assets'));

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/images', async(req, res, next)=> {
  try {
    res.send(await Image.findAll());
  }
  catch(ex){
    next(ex);
  }
});

app.post('/api/images', async(req, res, next)=> {
  try {
    res.send(await Image.create(req.body));
  }
  catch(ex){
    next(ex);
  }
});

const readBase64 = (path)=> {
  return new Promise((resolve, reject)=> {
    fs.readFile(path, 'base64', (err, data)=> {
      if(err){
        reject(err);
      }
      else {
        resolve(data);
      }
    });
  });
};

const setup = async()=> {
  try {
    await conn.sync({ force: true });
    const [excel, git, fullstack] = await Promise.all([
      readBase64('./seed_images/excel.png'),
      readBase64('./seed_images/git.png'),
      readBase64('./seed_images/fullstack.png'),
    ]);

    await Promise.all([
      Image.create({ data: excel, name: 'excel'}),
      Image.create({ data: git, name: 'git'}),
      Image.create({ data: fullstack, name: 'fullstack'}),
    ]);

    const port = process.env.PORT || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  }
  catch(ex){
    console.log(ex);
  }
};

setup();

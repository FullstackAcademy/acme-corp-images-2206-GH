const express = require('express');
const app = express();
const path = require('path');
const { conn, Image } = require('./db');
const fs = require('fs');

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

const setup = async()=> {
  try {
    await conn.sync({ force: true });
    fs.readFile('./seed_images/excel.png', 'base64', (err, data)=> {
      if(err){
        throw err;
      }
      else {
        Image.create({ name: 'exel.png', data });
        fs.readFile('./seed_images/git.png', 'base64', (err, data)=> {
          if(err){
            throw err;
          }
          else {
            Image.create({ name: 'git.png', data });
            fs.readFile('./seed_images/fullstack.png', 'base64', (err, data)=> {
              if(err){
                throw err;
              }
              else {
                Image.create({ name: 'fullstack.png', data });
              }
            });
          }
        });
      }
    });

    const port = process.env.port || 3000;
    app.listen(port, ()=> console.log(`listening on port ${port}`));
  }
  catch(ex){
    console.log(ex);
  }
};

setup();

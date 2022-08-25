const Sequelize = require('sequelize');
const { TEXT, STRING } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_images_db');

const Image = conn.define('image', {
  name: {
    type: STRING
  },
  data: {
    type: TEXT
  }
});

Image.addHook('beforeSave', (image)=> {
  if(!image.data.startsWith('data')){
    image.data = `data:image/png;base64, ${image.data}`;
  }
});

module.exports = {
  conn,
  Image
};

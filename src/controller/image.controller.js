const db = require("../model");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Image = db.image;
const ROLES = db.ROLES;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const base64Image = require('node-base64-image');
var fs = require('fs');
const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const process = require('process');
const uuid = require('uuid');
const crypto = require("crypto");


var dir = './images';
exports.signup = (req, res) => {

 User.create({
 username: req.body.username,
 email: req.body.email,
 password: bcrypt.hashSync(req.body.password, 8)
 })
 .then(user => {
 if (req.body.roles) {
     Role.findAll({
         where: {
             name: {
                 [Op.or]: req.body.roles
             }
         }
     })
         .then(roles => {
             if (roles.length !== 0) {
                 //res.send({ message: req.body.roles });
                 var arr = [];
                 roles.forEach(function (obj) { arr.push(obj.name); });
                 //var arr = [];

                 let difference = req.body.roles.filter(x => !arr.includes(x));
                 res.send({ message: roles });

                 //var difference = req.body.roles.not(roles).get();
                 //console.log("story " + difference + " story");
                 user.setRoles(roles).
                     then(roles => {
                        // let difference = req.body.roles.filter(x => !roles.includes(x));
                         if (difference.length != 0) {
                             for (let i = 0; i < difference.length; i++) {
                                 Role.create({
                                     name: difference[i]

                                 })
                                     .then(roles => {
                                         Role.findAll({
                                             where: {
                                                 name: {
                                                     [Op.or]: req.body.roles
                                                 }
                                             }
                                         }).then (roles => {

                                         user.setRoles(roles).then(() => {
                                             //res.send({ message: "User was registered successfully!" });
                                         })
                                         })
                                     })
                             }
                             res.send({ message: "User was registered successfully!" });
                         }
                         //else {
                          //    user.setRoles(roles).then(() => {
                          //       res.send({ message: "User was registered successfully!" });
                         //    })
                         //}
                     })
             }
             else {
                 for (let i = 0; i < req.body.roles.length; i++) {
                     Role.create({
                         name: req.body.roles[i]

                     })
                 
                         .then(role => {
                             //res.send({ message: role });

                            

                                 user.setRoles(role).then(() => {
                                     //res.send({ message: "User was registered successfully!" });
                                 })
                             })
                         
                 }
                 res.send({ message: "User was registered successfully!" });


             }
                     //res.send({ message: "User was registered successfully!" });
                 })
         
                     
        //});     
       //  }
    // }
// })
    // .then(roles => {
    //               user.setRoles(roles).then(() => {
    //                 res.send({ message: "User was registered successfully!" });
   //                });
   //          }); 
 } else {

 user.setRoles([1]).then(() => {
 res.send({ message: "User was registered successfully!" });
 });
 }
 })
 .catch(err => {
 res.status(500).send({ message: err.message });
 });
};
//const crypto = require("crypto");
//const id = crypto.randomBytes(16).toString("hex") + ".jpg";
//const imagePath = './images/my-image.jpg';
//const imagePath = './images/'+id;
//const directory = path.resolve(__dirname, '..', '..');
const ModelPath = 'file://' + process.cwd().replace(/\\/g, "/") + '/modeljs/model.json';
//const ModelPath = 'file://C:/Users/User/Desktop/Лаб59/Server/modeljs/model.json';
const classPath = './classes/class_names.json';
// Загрузка модели из файла
async function loadModel() {
    const model = await tf.loadLayersModel(ModelPath);
    console.log('Путь', ModelPath);
    return model;
}
// Загрузка изображения из файла
async function loadImage(path) {
    const buffer = require('fs').readFileSync(path);
    const tfimage = tf.node.decodeImage(buffer);
    return tfimage;
}


// Классификация изображения
async function classifyImage(req, res, token,imagePath,id) {

    const model = await loadModel();
    const image = await loadImage(imagePath);
    const resizedImage = tf.image.resizeBilinear(image, [100, 100]).toFloat();
    const batchedImage = resizedImage.expandDims(0);
    tensor = model.predict(batchedImage);
    //const predictions = tensor.print();
    //const crypto = require("crypto");
    //const id = crypto.randomBytes(16).toString("hex")+".jpg";
    //console.log(id);
    const predictedClass = tensor.argMax(1).dataSync()[0];
    //const id = crypto.randomBytes(16).toString("hex") + ".jpg";
    //const imagePath = './images/my-image.jpg';
    //const imagePath = './images/' + id;
    //const fs = require('fs-extra')
   // var json_data = await fs.readJson(classPath);
    // Чтение JSON файла
    fs.readFile(classPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }

        // Парсинг JSON данных
        const jsonData = JSON.parse(data);
        const className = jsonData[predictedClass];
        console.log('Предсказанный класс:', className);
        Image.create({
            name: id,
            class: className
        }).then(image => {
            User.findOne({
                where: {
                    id: token.id
                }
            })
                .then(user => {
                    image.setUsers(user).then(() => {
                        res.send({  image });
                    })
                })

            //console.log(jsonData);
        })
    });

    //var json_data = require(classPath);
    //const className = json_data[predictedClass][1];
    //const classInfo = await fetch(classPath);
    //const classIndex = await classInfo.json();
    //const className = classIndex[predictedClass][1];
    //console.log('Предсказанный класс:', className);
    //const predictions = tensor.print();
    //console.log(predictions);
    data = await tensor.data();
    //const results = Array.from(data)
     //   .map((item, i) => ({ probability: item, label: labels[i] }))
     //   .sort((a1, a2) => a2.probability - a1.probability)
      //  .slice(0, 5);
    console.log("Class:",predictedClass) // plain js array
    //console.log(predictions);
}
exports.sendimage = (req, res) => {
    var token = jwt.decode(req.body.accessToken);
    if (!token) return res.status(404).send({ message: "Token not found." });

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
    //console.log(imagePath);
    //const imageString = 'base64-encoded-string';
    const imageBuffer = Buffer.from(req.body.image, 'base64');
    const id = crypto.randomBytes(16).toString("hex") + ".jpg";
    const imagePath = './images/' + id;
    console.log(imagePath);

    fs.writeFile(imagePath, imageBuffer, (err) => {
        if (err) {
            console.error(err);
        }
    });
    classifyImage(req, res, token,imagePath,id);

    //const file = fs.readFile('./images/my-image.jpg',function (err, data) {
        // Display the file content
        //console.log(data);
      //  const axs = 0;
      //  data=tf.expandDims(data, axs);
      //  f().then(function (res) {
        //  const prediction = res.predict(data);
         //   console.log("ывы",prediction);
        //    return res.status(200).send({ message: prediction });
       // }, function (err) {
            //return res.status(404).send({ message: "Error prediction" });

//        });
    //});
    const axs = 0;

    //file = tf.expandDims(file, axs).squeeze();
    //f().then(async function (res) {
      //  const prediction = await res.predict(file);
      //  console.log("ывы", prediction);
      //  return res.status(200).send({ message: prediction });
    //}, function (err) {
            //return res.status(404).send({ message: "Error prediction" });
    //});
    //const axs = 0;

    // Calling tf.expandDims() method and 
    // Printing output 
    //file =file.expandDims(axs);
    //const model = f();
    //model.then(function (res) {
     //    const prediction = res.predict(file);
     //   console.log(prediction);
     //   return res.status(200).send({ message: prediction });

    //}, function (err) {
    //    return res.status(404).send({ message: "Error prediction" });
    //
    //});
    //const inputData = tf.tensor2d([[1, 2]]);
    //const prediction = model.predict(imageBuffer);
    //prediction.print();
    //return res.status(200).send({ message: prediction });
    //base64Image.base64decode(req.body.image, '/images/my-image.jpg', (err) => {
   //     if (err) {
   //         console.error(err);
    //    }
    //});
   // res.status(200).send(token.id);
 User.findOne({
 where: {
 id: token.id
 }
 })
 .then(user => {
 if (!user) {
 //return res.status(404).send({ message: "User Not found." });
     }
   //  return res.status(200).send(user);

 var passwordIsValid = bcrypt.compareSync(
 req.body.password,
 user.password
 );
 if (!passwordIsValid) {
 return res.status(401).send({
 accessToken: null,
 message: "Invalid Password!"
 });
 }
 var token = jwt.sign({ id: user.id }, config.secret, {
 expiresIn: 86400 // 24 часа
 });
 var authorities = [];
 user.getRoles().then(roles => {
 for (let i = 0; i < roles.length; i++) {
 authorities.push("ROLE_" + roles[i].name.toUpperCase());
 }
 res.status(200).send({
 id: user.id,
 username: user.username,
 email: user.email,
 roles: authorities,
 accessToken: token
 });
 });
 })
 .catch(err => {
 //res.status(500).send({ message: err.message });
 });
 };

exports.findAll = (req, res) => {
User.findAll()
.then(user => {
if (!user) {
return res.status(404).send({ message: "User Not found." });
}
else
{ 
res.status(200).send({
users: user
});
}
})
.catch(err => {
res.status(500).send({ message: err.message });
});
 };
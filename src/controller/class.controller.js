const db = require("../model");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Image = db.image;
const Class = db.class;
const Model = db.model;
const Subbrand = db.subbrand;
const ROLES = db.ROLES;
const Manufacturer = db.manufacturer;
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
const { subbrand } = require("../model/index");


var dir = './images';
exports.createclassdata = (req, res) => {
    //const { count, rows } = await
    //res.send({ message: "User was registered successfully!" });

    Class.findAll().then(( count )=> {
        //if (count.length === 0) {
           // res.send({ message: "User was registered successfully!" });

        // do you thing
        const fs = require('fs');
        //const User = require('./models').User;
        // Чтение файла tasks.json
        fs.readFile('./classes/class_names.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Ошибка чтения файла:', err);
                return;
            }

            try {
                const classList = JSON.parse(data);
                const Manufacturer = [ "variant 1", "variant 2", "variant 3" ];
                const Subbrand = [ "variant 1", "variant 2", "variant 3" ];
                const Model = [
                    { name: "variant 1", count: 4, price: 133.1 },
                    { name: "variant 2", count: 2, price: 300 },
                    { name: "variant 3", count: 44, price: 33.1 }
                ];

                var isEmpty = classList.length === 0;
                if (!isEmpty) {
                    // Добавление классов из JSON файла
                    classList.forEach(classData => {
                        Class.create({ name: classData })
                            .then(clas => {
                                Manufacturer.forEach(ManufacturerData => {
                                    clas.createManufacturer({name: ManufacturerData })
                                        .then(manufacturer => {
                                            Subbrand.forEach(SubbrandData => {
                                                manufacturer.createSubbrand({ name: SubbrandData })
                                                    .then(subbrand => {
                                                        Model.forEach(ModelData => {
                                                            subbrand.createModel({ name: ModelData.name, count: ModelData.count, price: ModelData.price});
                                                        })
                                                    })
                                            })
                                        })
                                })
                                // catch(error => {
                                //            console.error('Произошла ошибка:', error);
                                //            });
                            })
                    })
                    res.send({ classList });
                    //clas.createManufacturer(classData);
                }
                //res.send({ message: "User was registered successfully!" });
            }
            catch (error) {
                console.error('Ошибка при обработке содержимого JSON файла:', error);
            }
        });
});
};
exports.findOne = (req, res) => {
    if (req.body.accessToken && req.body.classname) {
        var token = jwt.decode(req.body.accessToken);
        User.findOne({
            where: {
                id: token.id
            }
        })
            .then(user => {
                if (!user) {
                    return res.status(404).send({ message: "User Not found." });
                }
                Class.findOne({
                    where: {
                        name: req.body.classname
                    }
                })
                    .then(classa => {
                        Manufacturer.findAll({
                            where: {
                                classId: classa.id
                            },
                            order: [
                                ['id', 'ASC']]
                        }).then(manufactor => {
                            res.status(200).send({
                                manufactors: manufactor
                            });

                        })
                    })
            })
            .catch(err => {
                res.status(500).send({ message: err.message });
            });
    }
    else {
        return res.status(404).send({ message: "Неверные параметры запроса" });
    }

};
exports.findOneManufactor = (req, res) => {
if (req.body.accessToken && req.body.manufactorid) {
      var token = jwt.decode(req.body.accessToken);
      User.findOne({
         where: {
            id: token.id
        }
        })
      .then(user => {
        if (!user) {return res.status(404).send({ message: "User Not found." });}
            Manufacturer.findOne({ where: { id: req.body.manufactorid}   })
                .then(manufacturer => {
                       Subbrand.findAll({
                       where: {
                       manufacturerId: manufacturer.id
                       },
                       order: [
                       ['id', 'ASC']]
                       })
                           .then(subbrand => {res.status(200).send({subbrands: subbrand});})
                    })
       })
      .catch(err => {res.status(500).send({ message: err.message });});
    }
    else {
        return res.status(404).send({ message: "Неверные параметры запроса" });
    }

};   
exports.findOneSubbrand = (req, res) => {
    if (req.body.accessToken && req.body.subbrandid) {
        var token = jwt.decode(req.body.accessToken);
        User.findOne({
            where: {
                id: token.id
            }
        })
            .then(user => {
                if (!user) { return res.status(404).send({ message: "User Not found." }); }
                Subbrand.findOne({ where: { id: req.body.subbrandid } })
                    .then(subbrand => {
                        Model.findAll({
                            where: {
                                subbrandId: subbrand.id
                            },
                            order: [
                                ['id', 'ASC']]
                        })
                            .then(model => { res.status(200).send({ models: model }); })
                    })
            })
            .catch(err => { res.status(500).send({ message: err.message }); });
    }
    else {
        return res.status(404).send({ message: "Неверные параметры запроса" });
    }

};   
exports.updateonemodel = (req, res) => {
    if (req.body.accessToken && req.body.modelid && req.body.count) {
        Model.findByPk(req.body.modelid) // id - идентификатор обновляемой сущности
            .then(model => {
                if (model) {
                    // Изменяем необходимые поля сущности
                    model.count += req.body.count;
                    model.save();
                    //model.author = 'Новый автор';
                     // Сохраняем обновленные данные
                    //return model.save();
                } else {
                    return res.status(404).send({ message: "Сущность не найдена" });
                    //console.log('Сущность не найдена');
                }
            })
            .then(() => {
                res.status(200).send({ message: "Сущность обновлена успешно" });
                //console.log('Сущность обновлена успешно');
            })
            .catch(error => {
                res.status(404).send({ message: 'Ошибка обновления сущности:'+ error });
                //console.error('Ошибка обновления сущности:', error);
            });
    }
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
    const MODEL_URL = "http://localhost:8080/model/model.json";
    const model = await tf.loadGraphModel(MODEL_URL);
        //.then((model) => {
        //    console.log("model loaded: ", model);
        //    return model;

        //})
       // .catch((error) => {
       //     console.log("failed to load the model", error);
       //     throw error;
       // });
   // const model = await tf.loadLayersModel(ModelPath);
    //console.log('Путь', ModelPath);
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
    //try {
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
                            res.send({ image });
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
        console.log("Class:", predictedClass) // plain js array
        //console.log(predictions);
    //}
    //catch (mes) {
    //    res.status(404).send({ message: "Error" });
    //}
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
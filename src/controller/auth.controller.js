const db = require("../model");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const ROLES = db.ROLES;
const Op = db.Sequelize.Op;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
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
exports.signin = (req, res) => {
 User.findOne({
 where: {
 username: req.body.username
 }
 })
 .then(user => {
 if (!user) {
 return res.status(404).send({ message: "User Not found." });
 }
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
 res.status(500).send({ message: err.message });
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
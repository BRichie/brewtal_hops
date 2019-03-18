const User = require("./models").User;
const bcrypt = require("bcryptjs");
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);



module.exports = {

  createUser(newUser, callback) {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
        name: newUser.name,
        email: newUser.email,
        password: hashedPassword
      })
      .then((user) => {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);


        const msg = {
          to: newUser.email,
          from: 'brandoncrichie@gmail.com',
          subject: 'User Confirmation',
          text: 'Ready to start brewing with Brewtal Hops!',
          html: '<strong>Thank you for joining!</strong>',
        };
        sgMail.send(msg);
        callback(null, user);
      })

      .catch((err) => {
        callback(err);
      });
  },
  getUser(id, callback){

       let result = {};
       User.findById(id)
       .then((user) => {

         if(!user) {
           callback(404);
         } else {

           result["user"] = user;

           Recipe.scope({method: ["lastFiveFor", id]}).all()
           .then((recipes) => {

             result["recipes"] = recipes;

             Comment.scope({method: ["lastFiveFor", id]}).all()
             .then((comments) => {

               result["comments"] = comments;
               callback(null, result);
             })
             .catch((err) => {
               callback(err);
             })
           })
         }
       })
     }
}


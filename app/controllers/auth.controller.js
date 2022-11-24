const config = require("../config/auth.config");
const db = require("../models");
const fs = require("fs");

const metric_data = require('../public/json/metrics.json');

const User = db.user;
const Role = db.role;
const Metrics = db.metrics;
const Bands = db.bands;


var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

/*
exports.signup = (req, res) => {
  const user = {
    id: bcrypt.hashSync(req.body.username, 8),
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    roles: ["ROLE_USER"]
  };

  fs.readFile('app/public/json/users.json', function (err, result) {

    results = JSON.parse(result);

    results.forEach((item) => {

      if (item.username == user.username) {
        return res.status(400).send(
          { message: "Failed! Username is already in use!" }
        );

      } else if (item.email == user.email) {
        return res.status(400).send(
          { message: "Failed! Email is already in use!" }
        );
      }
    })

    results.push(user);

    fs.writeFile("app/public/json/users.json", JSON.stringify(results), function (err, response) {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send({ data: response, message: "User was registered successfully!" });
    });
  });
};

exports.signin = (req, res) => {

  const user = {
    username: req.body.username,
    password: req.body.password,
  };

  fs.readFile('app/public/json/users.json', function (err, result) {
    if (err) {
      res.status(500).send({ message: err });
      return "error";
    }

    results = JSON.parse(result);

    var userdata = [];
    var error = "";
    results.forEach((item) => {
      if (item.username == user.username) {
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          item.password
        );
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });
        } else {
          return userdata.push({
            id: item.id,
            email: item.email,
            username: item.username,
            roles: item.roles
          })
        }
      } else {
        error = "User Not found.";
      }
    })

    if (userdata.length && userdata != null) {
      const data = {};
      userdata.forEach((item) => {
        data.username = item.username;
        data.id = item.id;
        data.email = item.email;
        data.roles = item.roles;
      })
      var token = jwt.sign({ id: data.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      res.status(200).send({
        username: data.username,
        email: data.email,
        roles: data.roles,
        accessToken: token,
        message: "User was signin successfully!"
      });
    } else {
      return res.status(404).send({ message: error });
    }

  })
};*/

///////// Metrics /////////
exports.getMetrics = async (req, res) => {

  await fs.readFile('app/public/json/metrics.json', function (err, result) {
    if (err) {
      res.status(500).send({ message: err });
      return "error";
    }
    res.status(200).send({
      message: "success",
      data: JSON.parse(result)
    });
  });
};

exports.addMetrics = async (req, res) => {
  fs.readFile('app/public/json/metrics.json', function (err, results) {
    var json = JSON.parse(results);
    var metricsId = 0;
    json.forEach(x => {
      console.log(x.id)
      return metricsId = parseInt(x.id) + 1;
    });
    const metrics = {
      id: metricsId,
      metric: req.body.metric,
      weightage: parseInt(req.body.weightage),
      customerview: req.body.customerview,
    };

    json.push(metrics);

    fs.writeFile("app/public/json/metrics.json", JSON.stringify(json), function (err, response) {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send({ data: response, message: "Metrics was registered successfully!" });
    });
  })


};

exports.updateMetrics = async (req, res) => {

  const uid = req.body.id;

  await fs.readFile('app/public/json/metrics.json', function (err, result) {

    var results = JSON.parse(result);

    results.forEach(element => {
      if (element.id == uid) {
        element.metric = req.body.metric;
        element.weightage = req.body.weightage;
        element.customerview = req.body.customerview;
      }
    });

    fs.writeFile("app/public/json/metrics.json", JSON.stringify(results), function (err, response) {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.status(200).send({
        message: "Metrics was update successfully",
        res: response
      });
    });
  });
};

exports.deleteMetrics = async (req, res) => {
  const uid = req.body.id;

  await fs.readFile('app/public/json/metrics.json', function (err, result) {

    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    var results = JSON.parse(result);

    results.forEach((element, index) => {
      if (element.id == uid) {
        results.splice(index, 1);
      }
    })

    fs.writeFile("app/public/json/metrics.json", JSON.stringify(results), function (err, response) {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      res.status(200).send({
        message: response,
        message: "Metrics was delete successfully"
      });
    });
  });
};

//////// Bands /////////
exports.getBands = (req, res) => {

  fs.readFile('app/public/json/bands.json', function (err, result) {
    if (err) {
      res.status(500).send({ message: err });
      return "error";
    }

    res.status(200).send({
      message: "success",
      data: JSON.parse(result)
    });
  });
}

exports.addBands = async (req, res) => {
  fs.readFile('app/public/json/bands.json', function (err, results) {
    if (err) console.log(err);

    var json = JSON.parse(results);
    var bandId = 0;
    json.forEach(x => {
      return bandId = parseInt(x.id) + 1;
    });

    const bands = {
      id: bandId,
      name: req.body.name,
      minRange: req.body.minRange,
      maxRange: req.body.maxRange,
      status: req.body.status,
    }
    json.push(bands);

    fs.writeFile("app/public/json/bands.json", JSON.stringify(json), function (err, response) {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send({ data: response, message: "Bands was registered successfully!" });
    });
  })
}

exports.updateBands = async (req, res) => {

  const uid = req.body.id;

  await fs.readFile('app/public/json/bands.json', function (err, result) {
    if (err) console.log(err);
    var results = JSON.parse(result);

    results.forEach(element => {
      if (element.id == uid) {
        element.name = req.body.name;
        element.minRange = req.body.minRange;
        element.maxRange = req.body.maxRange;
      }
    });

    fs.writeFile("app/public/json/bands.json", JSON.stringify(results), function (err, response) {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.status(200).send({
        message: "Bands was update successfully",
        res: response
      });
    });
  });
}

exports.updateStatusBands = async (req, res) => {

  const uid = req.body.id;
  console.log(req.body)
  await fs.readFile('app/public/json/bands.json', function (err, result) {
    if (err) console.log(err);
    var results = JSON.parse(result);

    results.forEach(element => {
      if (element.id == uid) {
        element.status = req.body.status;
      }
    });

    fs.writeFile("app/public/json/bands.json", JSON.stringify(results), function (err, response) {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.status(200).send({
        message: "Bands was update successfully",
        res: response
      });
    });
  });
}

exports.deleteBands = async (req, res) => {
  const uid = req.body.id;

  await fs.readFile('app/public/json/bands.json', function (err, result) {

    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    var results = JSON.parse(result);

    results.forEach((element, index) => {
      if (element.id == uid) {
        results.splice(index, 1);
      }
    })

    fs.writeFile("app/public/json/bands.json", JSON.stringify(results), function (err, response) {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      res.status(200).send({
        message: response,
        message: "Bands was delete successfully"
      });
    });
  });
};

//////// Quiz /////////

exports.getQuiz = (req, res) => {

  fs.readFile('app/public/json/quiz.json', function (err, result) {
    if (err) {
      res.status(500).send({ message: err });
      return "error";
    }

    res.status(200).send({
      message: "success",
      data: JSON.parse(result)
    });
  });
}

exports.getQuizById = (req, res) => {
  const id = req.body.id;
  fs.readFile('app/public/json/quiz.json', function (err, result) {
    if (err) {
      res.status(500).send({ message: err });
      return "error";
    }
    const data = []
    var json = JSON.parse(result);
    json.forEach(x => {
      if (x.id == id) {
        return data.push({
          question: x.question,
          startdate: x.startdate,
          enddate: x.enddate,
          score: x.score,
          answer:
          {
            option1: x.answer.option1,
            option2: x.answer.option2,
            option3: x.answer.option3,
            option4: x.answer.option4,
            correctAns: x.answer.correctAns,
          }
        });
      }
    });

    res.status(200).send({
      message: "success",
      data: data
    });
  });
}

exports.addQuiz = async (req, res) => {

  fs.readFile('app/public/json/quiz.json', function (err, results) {
    if (err) console.log(err);

    var json = JSON.parse(results);
    var quizId = 0;
    json.forEach(x => {
      return quizId = parseInt(x.id) + 1;
    });

    const bands = {
      id: quizId,
      question: req.body.question,
      startdate: req.body.startdate,
      enddate: req.body.enddate,
      score: req.body.score,
      answer: {
        option1: req.body.option1,
        option2: req.body.option2,
        option3: req.body.option3,
        option4: req.body.option4,
        correctAns: req.body.correctAns,
      }
    }
    json.push(bands);
    console.log("------------", json)

    fs.writeFile("app/public/json/quiz.json", JSON.stringify(json), function (err, response) {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.send({ data: response, message: "Quiz was registered successfully!" });
    });
  })
}

exports.updateQuiz = async (req, res) => {

  const uid = req.body.id;

  await fs.readFile('app/public/json/quiz.json', function (err, result) {
    if (err) console.log(err);
    var results = JSON.parse(result);

    results.forEach(element => {
      if (element.id == uid) {
        element.question = (req.body.question) ? req.body.question : element.question;
        element.startdate = (req.body.startdate) ? req.body.startdate : element.startdate;
        element.enddate = (req.body.enddate) ? req.body.enddate : element.enddate;
        element.score = (req.body.score) ? req.body.score : element.score;
        element.answer.option1 = (req.body.option1) ? req.body.option1 : element.answer.option1;
        element.answer.option2 = (req.body.option2) ? req.body.option2 : element.answer.option2;
        element.answer.option3 = (req.body.option3) ? req.body.option3 : element.answer.option3;
        element.answer.option4 = (req.body.option4) ? req.body.option4 : element.answer.option4;
        element.answer.correctAns = (req.body.correctAns) ? req.body.correctAns : element.answer.correctAns;
      }
    });
    console.log(results)

    fs.writeFile("app/public/json/quiz.json", JSON.stringify(results), function (err, response) {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.status(200).send({
        message: "Quiz was update successfully",
        res: response
      });
    });
  });
}

exports.deleteQuiz = async (req, res) => {
  const uid = req.body.id;

  await fs.readFile('app/public/json/quiz.json', function (err, result) {

    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    var results = JSON.parse(result);

    results.forEach((element, index) => {
      if (element.id == uid) {
        results.splice(index, 1);
      }
    })

    fs.writeFile("app/public/json/quiz.json", JSON.stringify(results), function (err, response) {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      res.status(200).send({
        message: response,
        message: "Quiz was delete successfully"
      });
    });
  });
};


/////// Get Customer View ////////
exports.getCustomerView = async (req, res) => {

  await fs.readFile('app/public/json/metrics.json', function (err, result) {
    if (err) {
      res.status(500).send({ message: err });
      return "error";
    }
    var data = [];
    var results = JSON.parse(result);
    results.forEach((element) => {
      if (element.customerview == "Yes") {
        data.push({
          id: element.id,
          customerview: element.customerview,
          metric: element.metric,
          weightage: element.weightage,
          data: element.data,
        })
      }
    })

    res.status(200).send({
      message: "success",
      data: (data)
    });
  });
};

/////// Get Agent Metrics ////////
exports.getAgentMatrics = async (req, res) => {

  await fs.readFile('app/public/json/metrics.json', function (err, result) {
    if (err) {
      res.status(500).send({ message: err });
      return "error";
    }
    // var data = [];
    var results = JSON.parse(result);
    // results.forEach((element) => {
    //   if (element.customerview == "Yes") {
    //     data.push({
    //       id: element.id,
    //       customerview: element.customerview,
    //       metric: element.metric,
    //       weightage: element.weightage,
    //       data: element.data,
    //     })
    //   }
    // })
    res.status(200).send({
      message: "success",
      data: (results)
    });
  });
};




exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({"err":"error", message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  console.log("_____", req.body);
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

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
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
        message: "User was signin successfully!"
      });
    });
};

/*exports.getMetrics = (req, res) => {
  Metrics.find({})
    .exec((err, result) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.status(200).send({
        message: "success",
        data: result
      });
    });
};

exports.addMetrics = async (req, res) => {
  const data = await Metrics.find().count();

  const metrics = new Metrics({
    id: data + 1,
    metric: req.body.metric,
    weightage: req.body.weightage,
    customerview: req.body.customerview,
  });

  metrics.save((err, results) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    res.send({ data: results, message: "Metrics was registered successfully!" });
  });
};

exports.updateMetrics = (req, res) => {
  console.log("_____", req.body);
  const id = req.body.id;
  const metrics = new Metrics({
    id: req.body.id,
    metric: req.body.metric,
    weightage: req.body.weightage,
    customerview: req.body.customerview,
  });
  console.log('metrics', metrics)
  Metrics.updateOne({ id: req.body.id }, { $set: { metric: req.body.metric, weightage: req.body.weightage,customerview: req.body.customerview } })
    .exec((err, result) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.status(200).send({
        message: "Metrics was update successfully",
        res: result
      });
    });
};

exports.deleteMetrics = (req, res) => {
  console.log("_____", req.body);
  const id = req.body.id;

  Metrics.deleteOne({ weightage: 5 })
    .exec((err, result) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      res.status(200).send({
        message: metrics,
        message: "Metrics was delete successfully"
      });
    });
};
*/
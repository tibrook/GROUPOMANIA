const Publi = require("../models/Publication");
const fs = require("fs");
const User = require("../models/User");
const Publication = require("../models/Publication");
/* Create publi  */
exports.createpubli = async (req, res, next) => {
  const authorPubli = await getName(req.auth.userId);
  let nameFile;
  let publication;
  if (req.body.publi.content && !fieldChecker(req)) {
    res
      .status(400)
      .json({ error: "Les caractères spéciaux ne sont pas acceptés" });
    return;
  }

  if (!req.body.publi && !req.file) {
    res.status(400).json({ error: "Il faut au moins une image ou un message" });
    return;
  }
  const publiObject = JSON.parse(req.body.publi);
  // Verification des données envoyées

  if (publiObject.content.trim("").length > 0) {

    //console.log(publiObject.content.trim("").length);

    // le type doit être en form-data et non en JSON
    delete publiObject._id;
    //On remplacera le userID en bdd avec le middleware d'authentification
    delete publiObject.userId;
    publication = publiObject.content;
  } else {
    publication = null;
  }

  if (req.file) {
    if (!extChecker(req)) {
      res.status(422).json({ error: "Mauvaise extension" });
      supprImage(req);
      return;
    } else {
      nameFile = `${req.protocol}://${req.get("host")}/images/${req.file.filename
        }`;
    }
  } else {
    nameFile = null;
  }

  /* Création de notre objet publi */
  const publi = new Publi({
    content: publication,
    userId: req.auth.userId,
    imageUrl: nameFile,
    author: authorPubli,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    createdAt: Date.now(),
  });

  publi
    .save()
    .then(() => {
      res.status(201).json({ publi });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

/* Find One publi */
exports.getOnepubli = (req, res, next) => {
  Publi.findOne({
    _id: req.params.id,
  })
    .then((publi) => {
      if (!publi) {
        res.status(404).json({
          error: "id non valide",
        });
      } else {
        res.status(200).json(publi);
      }
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

/* Find One publi */
exports.getPubliByUserId = (req, res, next) => {
  Publi.find({
    userId: req.params.id,
  })
    .then((publi) => {
      if (!publi) {
        res.status(404).json({
          error: "userid non valide",
        });
      } else {
        for (let i = 0; i < publi.length; i++) {
          publi.sort(function (a, b) {
            return b.createdAt - a.createdAt;
          });
        }
        res.status(200).json(publi);
      }
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};
/* Modification publi */
exports.modifypubli = async (req, res, next) => {
  console.log(req.body);
  console.log(req.file);
  console.log(req.body.publication);
  /* On vérifie qu'il y ait bien des données envoyées  */
  if (!req.file && !req.body) {
    res.status(400).json({ error: "Format des données non valide" });
    return;
  }
  if (req.body.deleteImage) {
    console.log("yep");
    supprImage(req.body.publication)
  }
  const publiObject =
    req.file && req.body.publi
      ? /* Si oui, on traite la nouvelle image */
      {
        ...JSON.parse(req.body.publi),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
          }`,
      }
      : req.file
        ? {
          imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
            }`,
        } /* Si non, on traite l'objet entrant */
        : req.body.deleteImage ? { ...req.body, imageUrl: ``, }
          : { ...req.body };
  delete publiObject.userId;
  console.log(publiObject);
  // console.log(`PubliObject :  ${publiObject} `);
  /* On verifie qu'il n'y ait pas de caractères spéciaux  */
  if (publiObject.content) {
    // console.log("content");
    if (!fieldChecker(req)) {
      res.status(400).json({
        error:
          "Format des données non valide. Caractères spéciaux non autorisés",
      });
      supprImage(req);
      return;
    }
  }
  /* Verifiation de l'extension du fichier s'il y en a un  */
  if (req.file && !extChecker(req)) {
    res.status(400).json({ error: "extension non valide" });
    supprImage(req);
    return;
  }
  let resp = await checkAdmin(req);
  /* Modification de la publi */
  Publi.findOne({ _id: req.params.id })
    .then(async (publi) => {
      if (!publi) {
        res.status(400).json({ error: "ID non valide" });
        supprImage(req);
        return;
      }

      //  console.log(admin);
      /* Puis on vérifie que le requérant est bien propriétaire de l'objet */
      if (publi.userId != req.auth.userId && resp == 0) {
        res.status(403).json({ error: "unauthorized request" });
      } else {
        await Publi.updateOne(
          { _id: req.params.id },
          { ...publiObject, _id: req.params.id }
        )
          .then(async () => {
            if (req.file && publi.imageUrl) {
              supprImage(publi);
            }
            Publi.findOne({ _id: req.params.id }).then((publi) => {
              // console.log(publi);
              res.status(200).json({ publi });
            })
            // console.log(Publi);
            /* Si une image est jointe, on supprime l'ancienne image */
            //    fs.unlink(publi.imageUrl, (error) => { console.log(error); })



          })
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

/* Delete publi */
exports.deletepubli = async (req, res, next) => {
  let resp = await checkAdmin(req);
  console.log(req.params.id);
  Publi.findOne({ _id: req.params.id })
    .then((publi) => {
      console.log(
        "publi.userId : " +
        publi.userId +
        "req.auth.userId : " +
        req.auth.userId
      );
      if (publi.userId != req.auth.userId && resp == 0) {
        res.status(401).json({ error: "Not authorized" });
      } else {
        if (publi.imageUrl) {
          const filename = publi.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, (err) => {
            if (err) console.log(err);
          });
        }
        publi
          .deleteOne({ _id: req.params.id })
          .then(() => {
            res.status(204).json();
          })
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error: "id non valide" });
    });
};

/* Get all publis */
exports.getAllpublis = (req, res, next) => {
  Publi.find()
    .then((publis) => {
      for (let i = 0; i < publis.length; i++) {
        publis.sort(function (a, b) {
          return b.createdAt - a.createdAt;
        });
      }

      res.status(200).json(publis);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

/* AddLike /Dislike */
exports.addLike = (req, res, next) => {
  Publi.findOne({ _id: req.params.id })
    .then((publi) => {
      if (!publi) {
        res.status(403).json({
          error: "id non valide",
        });
        return;
      }
      /* On vérifie si l'utilisateur a déjà like/dislike la publi*/
      const userFoundLike = publi.usersLiked.find(
        (user) => user == req.auth.userId
      );
      const userFoundDislike = publi.usersDisliked.find(
        (user) => user == req.auth.userId
      );
      /* S'il like */
      if (req.body.like === 1) {
        if (userFoundLike) {
        } else if (userFoundDislike) {
          supprArrayLike(publi, req.auth.userId, "usersDisliked");
          publi.usersLiked.push(req.auth.userId);
        } else {
          publi.usersLiked.push(req.auth.userId);
        }
        /* S'il unlike */
      } else if (req.body.like === 0) {
        if (userFoundLike) {
          supprArrayLike(publi, req.auth.userId, "usersLiked");
        } else if (userFoundDislike) {
          supprArrayLike(publi, req.auth.userId, "usersDisliked");
        }
        /* S'il dislike */
      } else if (req.body.like === -1) {
        if (userFoundDislike) {
        } else if (userFoundLike) {
          supprArrayLike(publi, req.auth.userId, "usersLiked");
          publi.usersDisliked.push(req.auth.userId);
        } else {
          publi.usersDisliked.push(req.auth.userId);
        }
      } else {
        res.status(400).json({
          error: "Mauvais format",
        });

        return;
      }
      publi.likes = publi.usersLiked.length;
      publi.dislikes = publi.usersDisliked.length;
      Publi.updateOne({ _id: req.params.id }, publi)
        .then(() => {
          res.status(201).json({
            message: "publi updated successfully!",
          });
        })
        .catch((error) => {
          res.status(400).json({
            error: error,
          });
        });
    })
    .catch((error) => res.status(401).json({ error }));
};

/* Suppression d'un userID des tableaux likes/dislikes */
const supprArrayLike = (publi, idUser, tableLikeDislike) => {
  let arrayLength;
  if (tableLikeDislike == "usersLiked") {
    arrayLength = publi.usersLiked.length;
  } else {
    arrayLength = publi.usersDisliked.length;
  }
  /* On peut aussi utiliser findIndex() */
  for (let i = 0; i < arrayLength; i++) {
    if (tableLikeDislike == "usersLiked") {
      if (publi.usersLiked[i] == idUser) {
        publi.usersLiked.splice(i, 1);
      }
    } else {
      if (publi.usersDisliked[i] == idUser) {
        publi.usersDisliked.splice(i, 1);
      }
    }
  }
};

// On vérifie qu'il n'y ait pas de caractères spéciaux
const fieldChecker = (req) => {
  let publiFields;
  const regexExp =
    /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
  if (req.body.publi) {
    publiFields = JSON.parse(req.body.publi) || req.body.publi;
  } else {
    publiFields = req.body;
  }
  console.log(publiFields);
  if (
    publiFields.content.trim() == "" ||
    (!publiFields.content.match(/^[a-zA-Z0-9-éÉ.è',àç_!?:= ]*$/) &&
      regexExp.test(publiFields.content) == false)
  ) {
    return null;
  } else {
    return 1;
  }
};

// Vérification de l'extension du fichier.
const extChecker = (image) => {
  if (image.file.length == 0) {
    return null;
  }
  const ext = image.file.originalname.substring(
    image.file.originalname.lastIndexOf(".") + 1
  );
  if (
    ext != "jpg" &&
    ext != "jpeg" &&
    ext != "png" &&
    ext != "PNG" &&
    ext != "gif"
  ) {
    return null;
  } else {
    return 1;
  }
};
/* Suppression d'une image en cas de modification / erreur  */
const supprImage = (req) => {
  if (req.file) {
    // Dans le cas d'une image déjà déjà transformée par multer, on récupère directement le nom
    const filename =
      req.file.filename.split("/images/")[1] || req.file.filename;
    fs.unlink(`images/${filename}`, (error) => {
      if (error) {
        return null;
      }
    });
    //Dans le cas d'une modification d'image, on supprimer l'ancienne image (publi.imageUrl)
  } else if (req.imageUrl) {
    const filename = req.imageUrl.split("/images/")[1];

    fs.unlink(`images/${filename}`, (error) => {
      if (error) {
        return null;
      }
    });
  } else if (req.body.publication.imageUrl) {
    const filename = req.imageUrl.split("/images/")[1];

    fs.unlink(`images/${filename}`, (error) => {
      if (error) {
        return null;
      }
    })
  } else {
    return null;

  }
};

const checkAdmin = async (req) => {
  let resp;
  await User.findOne({ _id: req.auth.userId })
    .then((user) => {
      if (user.role == "admin") {
        resp = 1;
      } else {
        resp = 0;
      }
    })

    .catch((error) => {
      console.log(error);
    });
  return resp;
};

const getName = async (userId) => {
  let userName = "";
  await User.findOne({ _id: userId })
    .then((user) => {
      console.log("userid : " + userId + " user._id = " + user._id);
      userName =
        user.firstname[0].toUpperCase() +
        user.firstname.slice(1) +
        " " +
        user.lastname[0].toUpperCase() +
        user.lastname.slice(1);
    })
    .catch((error) => {
      console.log(error);
    });
  return userName;
};

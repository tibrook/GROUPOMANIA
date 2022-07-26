const Publi = require("../models/publi");
const fs = require("fs");
const User = require("../models/User");
/* Create publi  */
exports.createpubli = async (req, res, next) => {
    let response = await checkAdmin(req)
    if (response == 1) {
        console.log("admin");
    } else {
        console.log("pas admin");
    }
    // console.log(checkAdmin(req));

    if (!req.body.publi || !req.file) {
        res.status(400).json({ error: "Format des données incorrect" });
        return;
    }
    // Verification des données envoyées
    if (fieldChecker(req)) {
        // le type doit être en form-data et non en JSON
        const publiObject = JSON.parse(req.body.publi);
        delete publiObject._id;
        //On remplacera le userID en bdd avec le middleware d'authentification
        delete publiObject.userId;
        /* Vérification du fichier joint */
        if (!req.file || !extChecker(req)) {
            res.status(422).json({ error: "Mauvaise extension" });
            supprImage(req)
            return;
        }

        /* Création de notre objet publi */
        const publi = new Publi({
            ...publiObject,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
                }`,
            usersLiked: [],
            usersDisliked: [],
        });

        publi
            .save()
            .then(() => {
                res.status(201).json({ message: "Publication enregistrée !" });
            })
            .catch((error) => {
                res.status(500).json({ error });
            });
    } else {
        supprImage(req)
        res.status(422).json({ error: "Les caractères spéciaux ne sont pas acceptés." });
        return
    }
};

/* Find One publi */
exports.getOnepubli = (req, res, next) => {
    publi.findOne({
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
/* Modification publi */
exports.modifypubli = (req, res, next) => {

    /* On vérifie qu'il y ait bien des données envoyées  */
    if (
        (req.file && !req.body.publi) ||
        (!req.file && req.body.publi) ||
        (!req.file && !req.body)
    ) {
        res.status(400).json({ error: "Format des données non valide" });
        return;
    }

    const publiObject = req.file
        ? /* Si oui, on traite la nouvelle image */
        {
            ...JSON.parse(req.body.publi),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename
                }`,
        }
        : /* Si non, on traite l'objet entrant */
        { ...req.body };
    delete publiObject.userId;

    /* On verifie qu'il n'y ait pas de caractères spéciaux  */
    if (!fieldChecker(req)) {
        res.status(400).json({ error: "Format des données non valide. Caractères spéciaux non autorisés" });
        supprImage(req)
        return;
    } else {
        /* Verifiation de l'extension du fichier s'il y en a un  */
        if (req.file && !extChecker(req)) {
            res.status(400).json({ error: "extension non valide" });
            supprImage(req)
            return;
        }
        /* Modification de la publi */
        publi.findOne({ _id: req.params.id })
            .then((publi) => {
                if (!publi) {
                    res.status(400).json({ error: "ID non valide" });
                    supprImage(req)
                    return
                }
                /* Puis on vérifie que le requérant est bien propriétaire de l'objet */
                if (publi.userId != req.auth.userId) {
                    res.status(403).json({ error: "unauthorized request" });
                } else {
                    publi.updateOne(
                        { _id: req.params.id },
                        { ...publiObject, _id: req.params.id }
                    )
                        .then(() => {
                            /* Si une image est jointe, on supprime l'ancienne image */
                            //    fs.unlink(publi.imageUrl, (error) => { console.log(error); })
                            if (req.file) {
                                supprImage(publi)
                            }

                            res.status(200).json({ message: "Objet modifié!" })
                        })
                        .catch((error) => res.status(401).json({ error }));
                }
            })
            .catch((error) => {
                res.status(400).json({ error });
            });
    }
};

/* Delete publi */
exports.deletepubli = (req, res, next) => {
    publi.findOne({ _id: req.params.id })
        .then((publi) => {
            if (publi.userId != req.auth.userId) {
                res.status(401).json({ error: "Not authorized" });
            } else {
                const filename = publi.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    publi.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(204).json();
                        })
                        .catch((error) => res.status(401).json({ error }));
                });
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
    publi.findOne({ _id: req.params.id })
        .then((publi) => {
            if (!publi) {
                res.status(403).json({
                    error: "id non valide",
                });
                return
            }
            if (req.body.userId != req.auth.userId) {
                res.status(401).json({
                    error: "Unauthorize request",
                });
                return
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

            publi.updateOne({ _id: req.params.id }, publi)
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
    if (req.body.publi) {
        publiFields = JSON.parse(req.body.publi);
    } else {
        publiFields = req.body;
    }

    if (
        publiFields.title.trim() == "" ||
        publiFields.content.trim() == "" ||
        !publiFields.title.match(/^[a-zA-Z-éÉèç ]*$/) ||
        !publiFields.content.match(/^[a-zA-Z-éÉèç ]*$/)
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
    if (ext != "jpg" && ext != "jpeg" && ext != "png") {
        return null;
    } else {
        return 1;
    }
};
/* Suppression d'une image en cas de modification / erreur  */
const supprImage = (req) => {
    if (req.file) {
        // Dans le cas d'une image déjà déjà transformée par multer, on récupère directement le nom
        const filename = req.file.filename.split("/images/")[1] || req.file.filename;
        fs.unlink(`images/${filename}`, (error) => {
            if (error) {
                return null;
            }
        })
        //Dans le cas d'une modification d'image, on supprimer l'ancienne image (publi.imageUrl)
    } else if (req.imageUrl) {
        const filename = req.imageUrl.split("/images/")[1];

        fs.unlink(`images/${filename}`, (error) => {
            if (error) {
                return null;
            }
        })
    } else {
        return null;
    }
}

const checkAdmin = async (req) => {
    let resp;
    await User.findOne({ _id: req.auth.userId }).then((user) => {
        // console.log(req.auth.userId);
        //console.log(user);
        if (user.role == "admin") {
            console.log('yes');
            resp = 1;
        } else {
            resp = 0;
        }
    }).catch((error) => { console.log(error); })
    return resp
}
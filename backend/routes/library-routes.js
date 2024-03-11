const db = require('../controllers/database/db-library')
const captcha = require('../controllers/reCaptcha')

const checkInput = (input) => /^[\w\s.-]*$/i.test(input)

module.exports = function (app) {
  app
    .route('/library/api/books')
    .get(function (req, res) {
      db.getAllBooks((err, books) => {
        if (err) return res.jons(err)
        res.json(
          books.map((book) =>
            Object.assign({}, book.toObject(), {
              commentcount: book.comments.length,
            })
          )
        )
      })
    })

    .post(async function (req, res) {
      const isNotBot = await captcha.verify(req.body)
      if (!isNotBot.success)
        return res.json({
          error: `Désolé, nous n'avons pas pu vérifier que vous n'êtes pas un robot. Veuillez réessayer.`,
        })

      const title = req.body.title
      if (!title) return res.json({ error: 'missing required field title' })

      if (!checkInput(title))
        return res.json({
          error: `Entrée Invalide, certains caractères ne sont pas autorisés.`,
        })

      db.addBook(title, (err, book) => {
        const newBook = Object.fromEntries(
          Object.entries(book).filter(([key, value]) => key !== 'comments')
        )
        err ? res.json(err) : res.json(newBook)
      })
    })

    .delete(async function (req, res) {
      const isNotBot = await captcha.verify(req.body)
      if (!isNotBot.success)
        return res.json({
          error: `Désolé, nous n'avons pas pu vérifier que vous n'êtes pas un robot. Veuillez réessayer.`,
        })
      db.deleteAllBooks((err, result) =>
        err ? res.json(err) : res.json(result)
      )
    })

  app
    .route('/library/api/books/:id')
    .get(function (req, res) {
      const bookId = req.params.id
      if (!bookId) return res.send('missing required book id')
      db.getBook(bookId, (err, book) => {
        err
          ? res.send(err)
          : res.json(
              Object.assign({}, book, { commentcount: book.comments.length })
            )
      })
    })

    .post(async function (req, res) {
      const isNotBot = await captcha.verify(req.body)
      if (!isNotBot.success)
        return res.json({
          error: `Désolé, nous n'avons pas pu vérifier que vous n'êtes pas un robot. Veuillez réessayer.`,
        })

      const bookId = req.params.id
      const comment = req.body.comment

      if (!bookId || bookId === 'null')
        return res.json({ error: 'missing required book id' })
      if (!comment || comment === '')
        return res.json({ error: 'missing required field comment' })

      if (!checkInput(bookId) || !checkInput(comment))
        return res.json({
          error: `Entrée Invalide, certains caractères ne sont pas autorisés.`,
        })

      db.addCommentToBook(bookId, comment, (err, book) => {
        err
          ? res.json({ error: err })
          : res.json(
              Object.assign({}, book, { commentcount: book.comments.length })
            )
      })
    })

    .delete(async function (req, res) {
      const isNotBot = await captcha.verify(req.body)
      if (!isNotBot.success)
        return res.json({
          error: `Désolé, nous n'avons pas pu vérifier que vous n'êtes pas un robot. Veuillez réessayer.`,
        })
      const bookId = req.params.id
      if (!bookId) return res.send('missing required book id')
      db.deleteOneBook(bookId, (err, result) => {
        err ? res.json(err) : res.json(result)
      })
    })
}

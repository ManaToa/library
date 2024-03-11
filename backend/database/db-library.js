const mongoose = require('mongoose')

mongoose.connect(process.env.MANGO_URI)

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  comments: [String],
})

const Book = mongoose.model('Book', bookSchema)

const addBook = (title, done) => {
  const book = new Book({ title: title })
  book
    .save()
    .then((book) => done(null, book.toObject()))
    .catch((err) => done({ error: 'Could not add book', title: title }, err))
}

const deleteAllBooks = (done) => {
  Book.deleteMany({})
    .then((res) => done(null, 'complete delete successful'))
    .catch((err) => done({ error: 'Could not delete books' }, err))
}

const getAllBooks = (done) => {
  Book.find({})
    .then((books) => done(null, books))
    .catch((err) => done({ error: 'Could not fetch books' }, err))
}

const getBook = (id, done) => {
  Book.findById(id)
    .then((book) => done(null, book.toObject()))
    .catch((err) => done('no book exists', err))
}

const addCommentToBook = (id, comment, done) => {
  Book.findByIdAndUpdate(id, { $push: { comments: comment } }, { new: true })
    .then((book) => done(null, book.toObject()))
    .catch((err) => done('This book does not exist', err))
}

const deleteOneBook = (id, done) => {
  Book.deleteOne({ _id: id })
    .then((result) => {
      if (result.deletedCount === 0) return done('no book exists', null)
      done(null, 'delete successful')
    })
    .catch((err) => done('no book exists', err))
}

module.exports = {
  addBook: addBook,
  deleteAllBooks: deleteAllBooks,
  getAllBooks: getAllBooks,
  getBook: getBook,
  addCommentToBook: addCommentToBook,
  deleteOneBook: deleteOneBook,
}

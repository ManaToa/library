import { useEffect, useState } from 'react'
import { BASE_URL } from '.'
import { DELETErequest, GETrequest } from '../../utils/requests'
import TitleModule from './title'
import { BookModuleProps } from './create-book'
import BookListItem from './book-list-item'
import ExButton from './button'
import { showServerResponse } from './functions'
import { getRecaptchaToken } from '../../utils/reCaptcha'

export interface BookTypes {
  _id: string
  title: string
  comments: string[]
  __v: number
}

export default function BookList({ updateServerResponse }: BookModuleProps) {
  const [bookList, setBookList] = useState<BookTypes[]>([])
  const [selectedBook, setSelectedBook] = useState<string>('')

  async function fetchAllBooks() {
    const url = `${BASE_URL}/api/books`
    const books = await GETrequest(url)
    setBookList(books)
  }

  async function handleDeleteAllBooks() {
    showServerResponse()
    const stuff = {
      gRecaptchaResponse: await getRecaptchaToken(),
    }

    try {
      const url = `${BASE_URL}/api/books`
      const response = await DELETErequest(url, stuff)
      updateServerResponse(JSON.stringify(response, null, 2))
    } catch (error) {
      updateServerResponse('Une erreur est survenue')
    }
  }

  useEffect(() => {
    fetchAllBooks()
  }, [bookList])

  return (
    <div>
      <TitleModule title={'Liste des livres'} method={'get'} endpoint={'/api/books'} />
      <div className='mb-5'>
        {bookList?.length > 0 ? (
          bookList.map((book, i) => (
            <BookListItem
              key={i}
              {...book}
              selected={selectedBook}
              updateSelectedBook={setSelectedBook}
              updateServerResponse={updateServerResponse}
            />
          ))
        ) : (
          <p>Aucun livre à afficher</p>
        )}
      </div>
      {bookList?.length > 0 && (
        <ExButton execute={handleDeleteAllBooks} label={'Supprimer tous les livres'} />
      )}
    </div>
  )
}

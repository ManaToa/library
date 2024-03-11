import { useState } from 'react'
import ExButton from './button'
import TitleModule from './title'
import UserInput from './user-input'
import { BookModuleProps } from './create-book'
import { getRecaptchaToken } from '../../utils/reCaptcha'
import { BASE_URL } from '.'
import { POSTrequest } from '../../utils/requests'
import { showServerResponse } from './functions'

export default function CreateComment({ updateServerResponse }: BookModuleProps) {
  const [bookId, setBookId] = useState<string>('')
  const [comment, setComment] = useState<string>('')

  async function handleCreateComment() {
    showServerResponse()

    const stuff = {
      comment: comment,
      gRecaptchaResponse: await getRecaptchaToken(),
    }

    try {
      const url = `${BASE_URL}/api/books/${bookId || null}`
      const response = await POSTrequest(url, stuff)

      updateServerResponse(JSON.stringify(response, null, 2))

      if (response.error) return

      setBookId('')
      setComment('')
    } catch (error) {
      updateServerResponse('Une erreur est survenue')
    }
  }

  return (
    <div>
      <TitleModule
        title={'Ajouter un commentaire'}
        method={'post'}
        endpoint={'/api/books/{bookid}'}
      />
      <div className='flex flex-wrap justify-between my-2'>
        <UserInput placeholder={`Bookid *`} updateValue={setBookId} value={bookId} />
        <UserInput placeholder={`Commentaire *`} updateValue={setComment} value={comment} />
      </div>
      <ExButton execute={handleCreateComment} label={`Ajouter`} />
    </div>
  )
}

import { useState } from 'react'
import ExButton from './button'
import TitleModule from './title'
import UserInput from './user-input'
import { showServerResponse } from './functions'
import { getRecaptchaToken } from '../../utils/reCaptcha'
import { BASE_URL } from '.'
import { POSTrequest } from '../../utils/requests'

export interface BookModuleProps {
  updateServerResponse: React.Dispatch<React.SetStateAction<string>>
}

export default function CreateBook({ updateServerResponse }: BookModuleProps) {
  const [bookTitle, setBooktitle] = useState<string>('')

  async function handleCreateBook() {
    showServerResponse()

    const stuff = {
      title: bookTitle,
      gRecaptchaResponse: await getRecaptchaToken(),
    }

    try {
      const url = `${BASE_URL}/api/books`
      const response = await POSTrequest(url, stuff)
      updateServerResponse(JSON.stringify(response, null, 2))

      if (response.error) return

      setBooktitle('')
    } catch (error) {
      updateServerResponse('Une Erreur est survenue')
    }
  }

  return (
    <div>
      <TitleModule title={'Créer un livre'} method={'post'} endpoint={'/api/books'} />
      <div className='flex flex-col md:flex-row items-center md:justify-between md:w-[21.5rem] lg:w-[20.5rem] xl:w-[17.5rem] 2xl:w-[19rem] my-2'>
        <UserInput placeholder={`Titre *`} updateValue={setBooktitle} value={bookTitle} />
        <ExButton execute={handleCreateBook} label={`Créer`} />
      </div>
    </div>
  )
}

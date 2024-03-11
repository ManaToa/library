import { BASE_URL } from '.'
import { getRecaptchaToken } from '../../utils/reCaptcha'
import { DELETErequest } from '../../utils/requests'
import { showServerResponse } from './functions'
import { BookTypes } from './book-list'

interface BookItemProps extends BookTypes {
  selected: string
  updateSelectedBook: React.Dispatch<React.SetStateAction<string>>
  updateServerResponse: React.Dispatch<React.SetStateAction<string>>
}

export default function BookListItem({
  _id,
  title,
  comments,
  selected,
  updateSelectedBook,
  updateServerResponse,
}: BookItemProps) {
  async function handleDeleteBook() {
    showServerResponse()
    const stuff = {
      gRecaptchaResponse: await getRecaptchaToken(),
    }

    try {
      const url = `${BASE_URL}/api/books/${_id}`
      const response = await DELETErequest(url, stuff)
      updateServerResponse(JSON.stringify(response, null, 2))
    } catch (error) {
      updateServerResponse('Une erreur est survenue')
    }
  }

  return (
    <div
      className='bg-ligthColorHover rounded-md py-1 px-3 mb-1 hover:bg-ligthColorAlt cursor-pointer'
      onClick={() => updateSelectedBook(_id)}
    >
      {title}{' '}
      {selected === _id && (
        <>
          <span className='font-bold ml-2'>id:</span>({_id})
          <div className='mt-3'>
            {comments?.length > 0 ? (
              <>
                <p className='font-bold'>Commentaires:</p>
                <ul className='list-decimal'>
                  {comments.map((comment, i) => (
                    <li className='ml-8' key={i}>
                      {comment}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p>Pas de commentaires</p>
            )}
            <button
              className='bg-darkColor text-lightColor p-1 rounded-sm my-2 hover:bg-mainColor text-sm font-bold uppercase'
              onClick={() => handleDeleteBook()}
            >
              Supprimer le livre
            </button>
          </div>
        </>
      )}
    </div>
  )
}

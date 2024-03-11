import { useState, useEffect } from 'react'
import { initRecaptcha } from '../../utils/reCaptcha'
import BoxContainer from './box-container'
import ServerResponse from './server-response'
import CreateBook from './create-book'
import CreateComment from './createComment'
import BookList from './book-list'

export const BASE_URL = `/library`

export default function Library() {
  const [serverResult, setServerResult] = useState<string>('')

  useEffect(() => {
    initRecaptcha()
  }, [])

  return (
    <div className='w-[13.5rem] md:w-[33rem] xl:w-[29rem] 2xl:w-[35rem]'>
      <BoxContainer children={<CreateBook updateServerResponse={setServerResult} />} />
      <BoxContainer children={<CreateComment updateServerResponse={setServerResult} />} />
      <BoxContainer children={<BookList updateServerResponse={setServerResult} />} />
      <BoxContainer children={<ServerResponse response={serverResult} />} />
    </div>
  )
}

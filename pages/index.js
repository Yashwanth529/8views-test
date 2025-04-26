
import Head from 'next/head'
import Image from 'next/image'
import Signup from '../components/pages/SignUp'

export default function Index() {
  return (
    <div>
      <Head>
        <title>Sign Up - Your Website</title>
        <meta name="description" content="Sign up for an account on our website" />
      </Head>

     
      <Signup />
    </div>
  )
}

import React, { useEffect, useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { PrimeReactProvider } from 'primereact/api';
import '../node_modules/bootstrap/scss/bootstrap.scss';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import 'primeicons/primeicons.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RecoilRoot } from 'recoil';

import '../styles/style.css';


function MyApp({ Component, pageProps }) {

  const httpLink = createHttpLink({
    uri: process.env.NEXT_PUBLIC_SERVER_URL,
  });
  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
  });

  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(true)
  }, [])

  if (!show) { return null }

  if (typeof window == "undefined") {
    return null
  } else {
    return (
      <ApolloProvider client={client}>
        <RecoilRoot>
          <PrimeReactProvider>
            <Component {...pageProps} />
          </PrimeReactProvider>
        </RecoilRoot>
      </ApolloProvider>
    );
  }
}
export default MyApp;

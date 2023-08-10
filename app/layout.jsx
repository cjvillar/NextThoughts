import "@styles/globals.css";
import Nav from "@components/Nav";
import Provider from "@components/Provider";
import Head from 'next/head';

export const meadata = {
  title: "Thoughts",
  Description: "Thoughts and Stuff, IDK just learning",
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <Head>
      <link rel="icon" href="/assets/icons/favicon.svg" type="image/svg+xml" />
      </Head>
      <body>
        <Provider>
        <div className="main">
          <div className="gradient" />
        </div>
        <main className="app">
          <Nav />
          {children}
        </main>
        </Provider>
      </body>
    </html>
  );
};

export default RootLayout;

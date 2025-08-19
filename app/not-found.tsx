import { Metadata } from 'next';
import css from './Home.module.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page not found',
  description:
    'Page notSorry, but the page you requested was not found. Check the address or return to the main page. faund',
  openGraph: {
    title: ' Page not found',
    description:
      'Sorry, but the page you requested was not found. Check the address or return to the main page.',
    url: 'https://08-zustand-livid.vercel.app/not-found',
    siteName: 'NoteHub',
    images: {
      url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
      width: 1200,
      height: 630,
      alt: 'White sheet of paper centered with white text NoteHub on blue-green background',
    },
  },
};

const NotFound = () => {
  return (
    <div>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>Sorry, the page you are looking for does not exist.</p>
      <div className={css.butto_wrapper}>
        <Link href="/" className={css.button}>
          Go back home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
import { Button, Box } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {

  const fetchImages = async () => {
    const images = await api.get("images");
    return images.data;
  }
 
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages);

  const formattedData = useMemo(() => {
    // TODO FORMAT AND FLAT DATA ARRAY
    
      const images = data?.pages.map(page => page.data).flat();
      return images;
  }, [status]);

  // TODO RENDER LOADING SCREEN

  // TODO RENDER ERROR SCREEN

  return (
    <>
      <Header />
      {
        isLoading? (
          <Loading />
        ) : (
          <Box maxW={1120} px={20} mx="auto" my={20}>
            <CardList cards={formattedData} />
            {/* TODO RENDER LOAD MORE BUTTON IF DATA HAS NEXT PAGE */}
        </Box>
        ) 
      }
    </>
  );
}

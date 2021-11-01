import { Button, Box, Flex } from '@chakra-ui/react';
import { useMemo } from 'react';
import { useInfiniteQuery } from 'react-query';

import { Header } from '../components/Header';
import { CardList } from '../components/CardList';
import { api } from '../services/api';
import { Loading } from '../components/Loading';
import { Error } from '../components/Error';

export default function Home(): JSX.Element {

  const fetchImages = async (param = null) => {
      const {pageParam} = param;
      const response = await api.get("/api/images", {params: {after: pageParam}});
      
      return response.data;
  }
 
  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery('images', fetchImages, {
    getNextPageParam: (lastPage, pages) => {
      return  pages[pages.length -1].after || null;
      }
    }
  );

  const formattedData = useMemo(() => {
      const images = data?.pages.map(page => page.data).flat();
      return images;

  }, [data]);

  return (
    <>
      {
        isLoading? (
          <Loading />
        ) : isError ? (
          <Error />
        ) : ( 
          <>
          <Header />
          <Box maxW={1120} px={20} mx="auto" my={20}>
            <CardList cards={formattedData} />
            {
              hasNextPage &&
                <Flex mt="1rem">
                  <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>{isFetchingNextPage ? "Carregando..." : "Carregar mais"}</Button>
                </Flex> 
            }
          </Box>
          </>
        ) 
      }
    </>
  );
}

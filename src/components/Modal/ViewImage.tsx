import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Image,
  Link,
} from '@chakra-ui/react';

interface ModalViewImageProps {
  isOpen: boolean;
  onClose: () => void;
  imgUrl: string;
}

export function ModalViewImage({
  isOpen,
  onClose,
  imgUrl,
}: ModalViewImageProps): JSX.Element {
  return (
    <>
      <Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay>
          <ModalContent mx="auto" my="auto" maxW="870px" >
            <ModalBody m="0" p="0" background="pGray.800">
              <Image m="0" objectFit="contain" src={imgUrl} />
            </ModalBody>
            <ModalFooter 
              borderBottomLeftRadius="5px" 
              borderBottomEndRadius="5px"  
              display="flex" 
              justifyContent="flex-start" 
              background="pGray.800" p=".3rem">
                <Link href={imgUrl} color="pGray.50" fontSize=".8rem" isExternal>Abrir Original</Link>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  )
}

import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

type ImageProps = {
  title: string | unknown;
  description: string | unknown;
  url: string;
};

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();
  const formValidations = {
    image: {
      required: "Arquivo obrigatório",
      validate: {
        lessThan10MB: file => file[0].size < 10485760 || "O arquivo deve ser menor que 10MB",
        acceptedFormats: file => {
          const regexImageExtension = new RegExp("^image\/(jpeg|gif|png)");
          if (regexImageExtension.test(file[0].type)){ 
            return true
          } else {
            return "Somente são aceitos arquivos PNG, JPEG e GIF"
          } 
        } 
      }
    },
    title: {
      minLength: {
        value: 2,
        message: "Mínimo de 2 caracteres"
      },
      maxLength: {
        value: 20,
        message: "Máximo de 20 caracteres"
      },
      required: "Título obrigatório"
    },
    description: {
      maxLength: {
        value: 65,
        message: "Máximo de 65 caracteres"
      },
      required: "Descrição obrigatória"
    },
  };

  const queryClient = useQueryClient();
  const mutation = useMutation( async(imageData : ImageProps) => {

    const requestImageData = {
      url: imageUrl,
      title: imageData.title,
      description: imageData.description
    }
    const response =  await api.post("/api/images", requestImageData);
    return response;
   },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("images");
      }
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setError,
    trigger,
  } = useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {

      if(!imageUrl) {
        toast({
          title: "Imagem não adicionada",
          description: "É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.",
          status: "error"
        })
        return;
      }
      await mutation.mutateAsync(data as ImageProps);

      toast({
        title: "Imagem cadastrada",
        description: "Sua imagem foi cadastrada com sucesso.",
        status: "success"
      })
    } catch {
      toast({
        title: "Falha no cadastro",
        description: "Ocorreu um erro ao tentar cadastrar a sua imagem.",
        status: "error"
      })
    } finally {
      reset();
      closeModal();
    }
  };

  return (
    
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          name="image"
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          {...register("image", {...formValidations.image})}
          error={errors.image}
        />

        <TextInput
          placeholder="Título da imagem..."
          name="title"
          {...register("title", {...formValidations.title})}
          error={errors.title}
        />

        <TextInput
          name="description"
          placeholder="Descrição da imagem..."
          {...register("description", {...formValidations.description})}
          error={errors.description}
        />
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}

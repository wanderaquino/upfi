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

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();
  const formValidations = {
    image: {
      required: "Arquivo obrigatório",
      validate: {
        lessThan10MB: file => file[0].size < 10485760 || "O arquivo deve ser menor que 10MB",
        acceptedFormats: file =>  file[0].type === "image/jpeg" || "Imagem diferente"
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
  const mutation = useMutation( async (imageData : {image: string, title: string, description: string}) => {

    const requestImageData = {
      url: imageUrl,
      title: imageData.title,
      description: imageData.description
    }
     return await api.post("images", requestImageData) },
    {
      onSuccess: (data, variables, context) => {
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
      // TODO SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
      if(!imageUrl) {
        toast({
          title: "Imagem não adicionada",
          description: "É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro.",
          status: "error"
        })
        return;
      }
      await mutation.mutateAsync(data as any);
      // TODO EXECUTE ASYNC MUTATION
      // TODO SHOW SUCCESS TOAST
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
      // TODO CLEAN FORM, STATES AND CLOSE MODAL
      reset();
      closeModal();
      setImageUrl("");
      setLocalImageUrl("");
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
          name="imageDescription"
          placeholder="Descrição da imagem..."
          {...register("imageDescription", {...formValidations.description})}
          error={errors.imageDescription}
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

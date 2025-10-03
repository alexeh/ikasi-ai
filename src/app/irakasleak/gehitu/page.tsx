'use client';

import * as React from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';
import { useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

const documentSchema = z.object({
  title: z.string().min(1, 'Izenburua beharrezkoa da.'),
  content: z.string().min(1, 'Edukia beharrezkoa da.'),
  language: z.enum(['euskera', 'gaztelania'], {
    required_error: 'Hizkuntza aukeratu behar duzu.',
  }),
});

type DocumentFormValues = z.infer<typeof documentSchema>;

export default function GehituDokumentuaPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DocumentFormValues>({
    resolver: zodResolver(documentSchema),
  });

  const selectedLanguage = watch('language');

  const onSubmit: SubmitHandler<DocumentFormValues> = async (data) => {
    setIsLoading(true);
    
    const collectionRef = collection(firestore, 'readingDocuments');

    addDoc(collectionRef, data)
      .then(() => {
        toast({
          title: 'Dokumentua gordeta!',
          description: `"${data.title}" dokumentua ondo gorde da.`,
        });
        router.push(data.language === 'euskera' ? '/euskera/irakurketa' : '/gaztelania/lectura');
      })
      .catch((serverError) => {
        const permissionError = new FirestorePermissionError({
          path: collectionRef.path,
          operation: 'create',
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permissionError);
        
        toast({
            variant: "destructive",
            title: "Errore bat gertatu da",
            description: "Ezin izan da dokumentua gorde. Saiatu berriro.",
        });
        console.error('Error adding document:', serverError);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="container py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Gehitu dokumentu berria</CardTitle>
          <CardDescription>
            Bete formularioa irakurgai berri bat sortzeko.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Izenburua</Label>
              <Input
                id="title"
                {...register('title')}
                disabled={isLoading}
                placeholder="Dokumentuaren izenburua..."
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Edukia</Label>
              <Textarea
                id="content"
                {...register('content')}
                disabled={isLoading}
                placeholder="Idatzi edo itsatsi hemen testu osoa..."
                rows={15}
              />
              {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Hizkuntza</Label>
              <RadioGroup
                value={selectedLanguage}
                onValueChange={(value: 'euskera' | 'gaztelania') => setValue('language', value)}
                className="flex gap-4"
                disabled={isLoading}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="euskera" id="lang-euskera" />
                  <Label htmlFor="lang-euskera">Euskera</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="gaztelania" id="lang-gaztelania" />
                  <Label htmlFor="lang-gaztelania">Gaztelania</Label>
                </div>
              </RadioGroup>
              {errors.language && <p className="text-sm text-destructive">{errors.language.message}</p>}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="animate-spin" /> : 'Gorde dokumentua'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

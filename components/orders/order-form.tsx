'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthState } from '@/lib/auth/hooks';
import { useCreateOrder } from '@/lib/orders/hooks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const orderSchema = z.object({
  nome: z.string().min(2, 'Nome minimo 2 caratteri'),
  email: z.string().email('Email non valida'),
  telefono: z.string().min(10, 'Telefono non valido'),
  messaggio: z.string().optional(),
});

type OrderFormData = z.infer<typeof orderSchema>;

interface OrderFormProps {
  quoteId?: string;
}

export function OrderForm({ quoteId }: OrderFormProps) {
  const { user } = useAuthState();
  const createOrder = useCreateOrder();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      nome: user?.name || '',
      email: user?.email || '',
    },
  });

  const onSubmit = async (data: OrderFormData) => {
    setIsSubmitting(true);
    try {
      await createOrder.mutateAsync({
        userId: user?.id || null,
        orderData: {
          ...data,
          quoteId,
        },
      });
      toast.success('Richiesta inviata con successo! Ti contatteremo presto.');
      reset();
    } catch (error) {
      toast.error('Errore nell\'invio della richiesta');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Richiedi Contatto</CardTitle>
        <CardDescription>
          Compila il form per essere contattato da un nostro consulente
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome e Cognome</Label>
              <Input
                id="nome"
                {...register('nome')}
                disabled={isSubmitting}
              />
              {errors.nome && (
                <p className="text-sm text-destructive">{errors.nome.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefono">Telefono</Label>
            <Input
              id="telefono"
              type="tel"
              {...register('telefono')}
              disabled={isSubmitting}
            />
            {errors.telefono && (
              <p className="text-sm text-destructive">{errors.telefono.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="messaggio">Messaggio (opzionale)</Label>
            <Textarea
              id="messaggio"
              {...register('messaggio')}
              disabled={isSubmitting}
              rows={4}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Invio in corso...' : 'Invia Richiesta'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}


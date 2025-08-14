"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { shippingAdressTable } from "@/db/schema";
import { useCreateShippingAdress } from "@/hooks/mutations/use-create-shipping-address";
import { useUpdateCartShippingAdress } from "@/hooks/mutations/use-update-cart-shipping-adress";
import { useUserAdresses } from "@/hooks/queries/use-user-adresses";

const formSchema = z.object({
  email: z.email("E-mail inválido"),
  fullName: z.string().min(1, "Nome completo é obrigatório"),
  cpf: z.string().min(14, "CPF inválido"),
  phone: z.string().min(15, "Celular inválido"),
  zipCode: z.string().min(9, "CEP inválido"),
  adress: z.string().min(1, "Endereço é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
});

type FormValues = z.infer<typeof formSchema>;

interface AdressesProps {
  shippingAdresses: (typeof shippingAdressTable.$inferSelect)[];
  defaultShippingAdressId: string | null;
}

const Addresses = ({
  shippingAdresses,
  defaultShippingAdressId,
}: AdressesProps) => {
  const [selectedAdress, setSelectedAdress] = useState<string | null>(
    defaultShippingAdressId || null,
  );
  const createShippingAdressMutation = useCreateShippingAdress();
  const updateCartShippingAdressMutation = useUpdateCartShippingAdress();
  const { data: adresses, isLoading } = useUserAdresses({
    initialData: shippingAdresses,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
      cpf: "",
      phone: "",
      zipCode: "",
      adress: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const newAdress = await createShippingAdressMutation.mutateAsync(values);
      toast.success("Endereço criado com sucesso!");
      form.reset();
      setSelectedAdress(newAdress.id);
      await updateCartShippingAdressMutation.mutateAsync({
        shippingAdressId: newAdress.id,
      });
      toast.success("Endereço vinculado ao carrinho!");
    } catch (error) {
      toast.error("Erro ao criar endereço. Tente novamente.");
      console.error(error);
    }
  };
  const handleGoToPayment = async () => {
    if (!selectedAdress || selectedAdress === "add_new") return;

    try {
      await updateCartShippingAdressMutation.mutateAsync({
        shippingAdressId: selectedAdress,
      });
      toast.success("Endereço selecionado para entrega!", {
        position: "top-center",
      });
    } catch (error) {
      toast.error("Erro ao selecionar endereço. Tente novamente.");
      console.error(error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identificação</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center">
            <p>Carregando endereços...</p>
          </div>
        ) : (
          <RadioGroup value={selectedAdress} onValueChange={setSelectedAdress}>
            {adresses?.length === 0 && (
              <div className="py-4 text-center">
                <p className="text-muted-foreground">
                  Você ainda não possui endereços cadastrados.
                </p>
              </div>
            )}
            {adresses?.map((adres) => (
              <Card key={adres.id}>
                <CardContent>
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value={adres.id} id={adres.id} />
                    <div className="flex-1">
                      <Label htmlFor={adres.id} className="cursor-pointer">
                        <div>
                          <p className="text-sm">
                            {adres.recipientName} • {adres.street},{" "}
                            {adres.number}
                            {adres.complement && `, ${adres.complement}`},{" "}
                            {adres.neighborhood}, {adres.city} - {adres.state} •
                            CEP: {adres.zipCode}
                          </p>
                        </div>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="add_new" id="add_new" />
                  <Label htmlFor="add_new">Adicionar novo endereço</Label>
                </div>
              </CardContent>
            </Card>
          </RadioGroup>
        )}

        {selectedAdress && selectedAdress !== "add_new" && (
          <div className="mt-4">
            <Button
              onClick={handleGoToPayment}
              className="w-full"
              disabled={updateCartShippingAdressMutation.isPending}
            >
              {updateCartShippingAdressMutation.isPending
                ? "Processando..."
                : "Ir para pagamento"}
            </Button>
          </div>
        )}

        {selectedAdress === "add_new" && (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-4 space-y-4"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite seu nome completo"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <PatternFormat
                          format="###.###.###-##"
                          placeholder="000.000.000-00"
                          customInput={Input}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Celular</FormLabel>
                      <FormControl>
                        <PatternFormat
                          format="(##) #####-####"
                          placeholder="(11) 99999-9999"
                          customInput={Input}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <PatternFormat
                          format="#####-###"
                          placeholder="00000-000"
                          customInput={Input}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="adress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu endereço" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o número" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Apto, bloco, etc. (opcional)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="neighborhood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bairro</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o bairro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite a cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o estado" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={
                  createShippingAdressMutation.isPending ||
                  updateCartShippingAdressMutation.isPending
                }
              >
                {createShippingAdressMutation.isPending ||
                updateCartShippingAdressMutation.isPending
                  ? "Salvando..."
                  : "Salvar endereço"}
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
};

export default Addresses;

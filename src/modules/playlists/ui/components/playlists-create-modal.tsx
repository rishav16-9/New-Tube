import { z } from "zod";
import { toast } from "sonner";
import { trpc } from "@/trpc/client";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResponsiveModal } from "@/components/responsive-modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface PlaylistCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(1),
});
export const PlaylistCreateModal = ({
  open,
  onOpenChange,
}: PlaylistCreateModalProps) => {
  const utils = trpc.useUtils();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createPlaylists.mutate(values);
  };

  const createPlaylists = trpc.playlists.create.useMutation({
    onSuccess: () => {
      toast.success("Playlist created");
      utils.playlists.getMany.invalidate();
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Something went wrong");
    },
  });
  return (
    <ResponsiveModal
      title="Create playlist"
      open={open}
      onOpenChange={onOpenChange}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="My favoirate videos" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={createPlaylists.isPending}>
              Create
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};

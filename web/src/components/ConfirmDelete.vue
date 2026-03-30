<script setup lang="ts">
import { defineComponent, ref } from "vue";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { Button } from "./ui/button";

const deleteDialogOpen = ref(false);

const props = defineProps({
  confirmDeleteLabel: {
    type: Function,
    required: true,
    default: () => {},
  },
  description: String,
});

defineComponent({
  name: "ConfirmDelete",
})

const handleDelete = () => {
  props.confirmDeleteLabel()
  deleteDialogOpen.value = false
}

</script>

<template>
  <Dialog v-model:open="deleteDialogOpen">
    <DialogTrigger as-child>
      <Button class="cursor-pointer" variant="destructive" size="sm"> Excluir </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirmar exclusão</DialogTitle>
        <DialogDescription>
          {{ props.description }}
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <DialogClose as-child>
          <Button class="cursor-pointer" type="button" variant="outline"> Cancelar </Button>
        </DialogClose>
        <Button class="cursor-pointer" @click="handleDelete"> Excluir </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

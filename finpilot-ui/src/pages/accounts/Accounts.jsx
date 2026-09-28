import { useState } from "react";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { Plus, Search } from "lucide-react";

import useAccounts from "@/hooks/useAccounts";

import AccountsTable from "@/components/accounts/AccountsTable";
import AddAccountDialog from "@/components/accounts/AddAccountDialog";
import EditAccountDialog from "@/components/accounts/EditAccountDialog";
import DeleteAccountDialog from "@/components/accounts/DeleteAccountDialog";

import {
  createAccount,
  updateAccount,
  deleteAccount,
} from "@/services/accountService";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Accounts() {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
  } = useAccounts();

  const [search, setSearch] = useState("");

  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedAccount, setSelectedAccount] = useState(null);

  // =========================================================
  // CREATE ACCOUNT
  // =========================================================

  const createMutation = useMutation({
    mutationFn: createAccount,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });

      setAddOpen(false);
    },

    onError: (error) => {
      console.error(
        "Failed to create account:",
        error
      );
    },
  });

  // =========================================================
  // UPDATE ACCOUNT
  // =========================================================

  const updateMutation = useMutation({
    mutationFn: updateAccount,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });

      setEditOpen(false);
      setSelectedAccount(null);
    },

    onError: (error) => {
      console.error(
        "Failed to update account:",
        error
      );
    },
  });

  // =========================================================
  // DELETE ACCOUNT
  // =========================================================

  const deleteMutation = useMutation({
    mutationFn: deleteAccount,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });

      setDeleteOpen(false);
      setSelectedAccount(null);
    },

    onError: (error) => {
      console.error(
        "Failed to delete account:",
        error
      );
    },
  });

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredAccounts =
    data?.filter((account) =>
      account.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    ) || [];

  // =========================================================
  // ADD ACCOUNT
  // =========================================================

  const handleAddAccount = () => {
    setAddOpen(true);
  };

  const handleCreateAccount = (formData) => {
    createMutation.mutate(formData);
  };

  // =========================================================
  // EDIT ACCOUNT
  // =========================================================

  const handleEditAccount = (account) => {
    setSelectedAccount(account);
    setEditOpen(true);
  };

  const handleUpdateAccount = (formData) => {
    if (!selectedAccount?.id) {
      return;
    }

    updateMutation.mutate({
      id: selectedAccount.id,
      data: formData,
    });
  };

  // =========================================================
  // DELETE ACCOUNT
  // =========================================================

  const handleDeleteAccount = (account) => {
    setSelectedAccount(account);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedAccount?.id) {
      return;
    }

    deleteMutation.mutate(selectedAccount.id);
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (isLoading) {
    return (
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold">
            Accounts
          </h1>

          <p className="text-slate-500">
            Loading your accounts...
          </p>
        </div>

        <Card>
          <CardContent className="p-6">

            <div className="space-y-4">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-14 animate-pulse rounded-xl bg-slate-200"
                />
              ))}

            </div>

          </CardContent>
        </Card>

      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (isError) {
    return (
      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-bold">
            Accounts
          </h1>

          <p className="text-red-500 mt-2">
            Failed to load accounts.
          </p>
        </div>

      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex items-center justify-between">

        <div>

          <h1 className="text-3xl font-bold">
            Accounts
          </h1>

          <p className="text-slate-500">
            Manage all your bank accounts
          </p>

        </div>

        <Button
          onClick={handleAddAccount}
          disabled={createMutation.isPending}
        >
          <Plus className="mr-2 h-4 w-4" />

          Add Account
        </Button>

      </div>

      {/* SEARCH */}

      <Card>

        <CardContent className="p-4">

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-3 text-slate-400"
            />

            <Input
              placeholder="Search account..."
              className="pl-10"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </CardContent>

      </Card>

      {/* TABLE */}

      <Card>

        <CardContent className="p-0">

          <AccountsTable
            accounts={filteredAccounts}
            onEdit={handleEditAccount}
            onDelete={handleDeleteAccount}
          />

        </CardContent>

      </Card>

      {/* ADD ACCOUNT DIALOG */}

      <AddAccountDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSubmit={handleCreateAccount}
        isSaving={createMutation.isPending}
      />

      {/* EDIT ACCOUNT DIALOG */}

      <EditAccountDialog
        open={editOpen}
        onOpenChange={(open) => {
          setEditOpen(open);

          if (!open) {
            setSelectedAccount(null);
          }
        }}
        account={selectedAccount}
        onSubmit={handleUpdateAccount}
        isSaving={updateMutation.isPending}
      />

      {/* DELETE ACCOUNT DIALOG */}

      <DeleteAccountDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);

          if (!open) {
            setSelectedAccount(null);
          }
        }}
        account={selectedAccount}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
      />

    </div>
  );
}
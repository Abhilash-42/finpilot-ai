import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export default function AccountsTable({
  accounts,
  onEdit,
  onDelete,
}) {
  if (!accounts?.length) {
    return (
      <div className="py-12 text-center text-slate-500">
        No accounts found.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Account</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Currency</TableHead>
          <TableHead className="text-right">
            Balance
          </TableHead>
          <TableHead className="text-center">
            Actions
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {accounts.map((account) => (
          <TableRow key={account.id}>
            <TableCell className="font-medium">
              {account.name}
            </TableCell>

            <TableCell>
              {account.account_type}
            </TableCell>

            <TableCell>
              {account.currency}
            </TableCell>

            <TableCell className="text-right font-semibold">
              ₹
              {Number(account.balance).toLocaleString("en-IN")}
            </TableCell>

            <TableCell className="text-center">
              <div className="flex justify-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => onEdit(account)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => onDelete(account)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

import React, { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, Search, CheckCheck, CircleDashed, Clock, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

// Types for campaign data
type Status = "active" | "paused" | "completed" | "draft";
type Platform = "Google" | "Facebook" | "Instagram" | "TikTok" | "Twitter";

interface Campaign {
  id: string;
  name: string;
  platform: Platform;
  status: Status;
  budget: string;
  spent: string;
  impressions: string;
  clicks: string;
  ctr: string;
  startDate: string;
  endDate: string;
}

// Sample campaigns data
const campaigns: Campaign[] = [
  {
    id: "1",
    name: "Summer Sale Promotion",
    platform: "Google",
    status: "active",
    budget: "$1,000",
    spent: "$750",
    impressions: "45,000",
    clicks: "2,300",
    ctr: "5.1%",
    startDate: "2025-04-10",
    endDate: "2025-05-10",
  },
  {
    id: "2",
    name: "Brand Awareness",
    platform: "Facebook",
    status: "active",
    budget: "$1,500",
    spent: "$900",
    impressions: "65,000",
    clicks: "3,100",
    ctr: "4.8%",
    startDate: "2025-04-05",
    endDate: "2025-05-05",
  },
  {
    id: "3",
    name: "Product Showcase",
    platform: "Instagram",
    status: "paused",
    budget: "$800",
    spent: "$400",
    impressions: "30,000",
    clicks: "1,200",
    ctr: "4.0%",
    startDate: "2025-03-20",
    endDate: "2025-04-20",
  },
  {
    id: "4",
    name: "Holiday Promotion",
    platform: "TikTok",
    status: "draft",
    budget: "$1,200",
    spent: "$0",
    impressions: "0",
    clicks: "0",
    ctr: "0%",
    startDate: "2025-05-15",
    endDate: "2025-06-15",
  },
  {
    id: "5",
    name: "Spring Collection",
    platform: "Facebook",
    status: "completed",
    budget: "$2,000",
    spent: "$2,000",
    impressions: "120,000",
    clicks: "7,500",
    ctr: "6.3%",
    startDate: "2025-02-15",
    endDate: "2025-03-15",
  },
  {
    id: "6",
    name: "Customer Retention",
    platform: "Google",
    status: "active",
    budget: "$1,000",
    spent: "$650",
    impressions: "50,000",
    clicks: "2,800",
    ctr: "5.6%",
    startDate: "2025-04-01",
    endDate: "2025-05-01",
  },
  {
    id: "7",
    name: "Black Friday Deals",
    platform: "Twitter",
    status: "draft",
    budget: "$3,000",
    spent: "$0",
    impressions: "0",
    clicks: "0",
    ctr: "0%",
    startDate: "2025-11-15",
    endDate: "2025-11-30",
  },
];

// Status badge component
const StatusBadge = ({ status }: { status: Status }) => {
  const statusProps = {
    active: {
      variant: "default" as const,
      icon: CheckCheck,
      label: "Active",
    },
    paused: {
      variant: "secondary" as const,
      icon: CircleDashed,
      label: "Paused",
    },
    completed: {
      variant: "outline" as const,
      icon: CheckCheck,
      label: "Completed",
    },
    draft: {
      variant: "outline" as const,
      icon: Clock,
      label: "Draft",
    },
  };

  const { variant, icon: Icon, label } = statusProps[status];

  return (
    <Badge variant={variant} className="flex items-center gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  );
};

const CampaignsPage = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<Campaign>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="hover:bg-transparent p-0"
          >
            Campaign
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <Link to={`/campaigns/launch/${row.original.id}`} className="font-medium hover:underline">
          {row.getValue("name")}
        </Link>
      ),
    },
    {
      accessorKey: "platform",
      header: "Platform",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    {
      accessorKey: "budget",
      header: "Budget",
    },
    {
      accessorKey: "spent",
      header: "Spent",
    },
    {
      accessorKey: "impressions",
      header: "Impressions",
    },
    {
      accessorKey: "clicks",
      header: "Clicks",
    },
    {
      accessorKey: "ctr",
      header: "CTR",
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const campaign = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="19" cy="12" r="1"></circle>
                  <circle cx="5" cy="12" r="1"></circle>
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: campaigns,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground">
            Manage and track your advertising campaigns
          </p>
        </div>
        <Link to="/campaigns/launch/new">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Campaigns</CardTitle>
              <CardDescription>
                All your running ad campaigns across platforms
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 w-64">
              <Input
                placeholder="Search campaigns..."
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="max-w-sm"
              />
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Showing {table.getFilteredRowModel().rows.length} of{" "}
              {campaigns.length} campaigns
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignsPage;

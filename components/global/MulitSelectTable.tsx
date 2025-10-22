"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "../ui/skeleton";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createAxiosInstance } from "@/lib/axios";
import { useParentContext } from "@/contexts/ParentContext";
import { ChevronDown, Edit, Filter, Trash } from "lucide-react";
import { Can } from "../Can";
import useSWR from "swr";

interface ComponentProps {
  columns: ColumnDef<any>[];
  indexUrl: string;
  filterUrl?: string;
  deleteUrl: string;
  searchableColumn: string;

  // For Edit modal
  idFeildForEditStateSetter?: React.Dispatch<
    React.SetStateAction<number | null>
  >;
  editModelOpenerStateSetter?:
    | React.Dispatch<React.SetStateAction<boolean>>
    | VoidFunction;

  // For Show modal
  idFeildForShowStateSetter?: React.Dispatch<
    React.SetStateAction<number | null>
  >;
  showModelOpenerStateSetter?:
    | React.Dispatch<React.SetStateAction<boolean>>
    | VoidFunction;

  selectedRowsIdsStateSetter?: React.Dispatch<React.SetStateAction<{}>>;

  // Injected element
  injectedElement?: React.ReactNode;

  // Filters List.
  filtersList?: string[];

  deleteBtnPermission?: string;

  editBtnPermission?: string;

  viewPermission?: string;

  loadingStateSetter?: React.Dispatch<React.SetStateAction<boolean>>;
}

const DataTableDemo: React.FC<ComponentProps> = ({
  columns,
  indexUrl,
  filterUrl,
  deleteUrl,
  searchableColumn,
  idFeildForEditStateSetter,
  editModelOpenerStateSetter,
  idFeildForShowStateSetter,
  showModelOpenerStateSetter,
  selectedRowsIdsStateSetter,
  injectedElement,
  filtersList,
  deleteBtnPermission,
  editBtnPermission,
  viewPermission,
  loadingStateSetter,

}) => {
  const { reqForToastAndSetMessage, axiosInstance, reloadFlag } = useParentContext();

  const [loading, setLoading] = React.useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState<any[]>([]);

  const [filters, setFilters] = React.useState<Record<string, string>>({});

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    setLoading(true);
    axiosInstance
      .post(filterUrl, filters)
      .then((response: any) => {
        setData(response.data.data);
        setLoading(false);
      })
      .catch((error: any) => {
        reqForToastAndSetMessage(error.response.data.message);
        setData([]);
        setLoading(false);
      });
  };

  // Fetch table data
  const fetchTableData = () => {
    setLoading(true);
    loadingStateSetter?.(true);
    axiosInstance
      .get(indexUrl)
      .then((res: any) => {
        console.log(res.data.data);
        setData(res.data.data);
      })
      .catch((err: any) => {
        console.log(err);
        reqForToastAndSetMessage(
          err.response?.data?.message || "Failed to fetch data"
        );
      })
      .finally(() => {setLoading(false); loadingStateSetter?.(false);});
  };

  // Delete selected rows
  const handleDelete = () => {
    const ids = Object.keys(rowSelection).map(Number);
    axiosInstance
      .post(deleteUrl, { ids })
      .then((res: any) => {
        reqForToastAndSetMessage(res.data.message);
        fetchTableData();
      })
      .catch((err: any) =>
        reqForToastAndSetMessage(err.response?.data?.message || "Delete failed")
      );
  };

  React.useEffect(() => {
      fetchTableData();
      console.log("Table data reloaded");
  }, [reloadFlag]);

  // Sync selected row id for edit
  React.useEffect(() => {
    if (idFeildForEditStateSetter) {
      const selectedIds = Object.keys(rowSelection);
      selectedIds.length === 1
        ? idFeildForEditStateSetter(Number(selectedIds[0]))
        : idFeildForEditStateSetter(null);
    }

    if (selectedRowsIdsStateSetter) selectedRowsIdsStateSetter(rowSelection);
  }, [rowSelection]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => row.id.toString(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="flex justify-between items-center py-4">
        <Input
          placeholder={`Search By ${searchableColumn}`}
          value={
            (table.getColumn(searchableColumn)?.getFilterValue() as string) ??
            ""
          }
          onChange={(e) =>
            table.getColumn(searchableColumn)?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />

        <div className="flex flex-row items-center gap-2">
          {injectedElement &&
            Object.keys(rowSelection).length == 1 &&
            injectedElement}

          {Object.keys(rowSelection).length === 1 &&
            editModelOpenerStateSetter && (
              <Can permission={editBtnPermission ?? "ok"}>
                <Button
                  onClick={() => editModelOpenerStateSetter(true)}
                  variant="outline"
                >
                  <Edit />
                </Button>
              </Can>
            )}

          {Object.keys(rowSelection).length >= 1 && (
            <Can permission={deleteBtnPermission ?? "ok"}>
              <Button onClick={handleDelete} variant="outline">
                <Trash color="red" />
              </Button>
            </Can>
          )}

          {/* Filter Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <Filter />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 max-h-[350px] overflow-auto">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="leading-none font-medium">Dimensions</h4>
                  <p className="text-muted-foreground text-sm">
                    Filter Projects.
                  </p>
                </div>
                <div className="grid gap-2">
                  {filtersList?.map((filter, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-3 items-center gap-4"
                    >
                      <Label htmlFor={filter}>{filter}</Label>
                      <Input
                        id={filter}
                        name={filter}
                        className="col-span-2 h-8"
                        onChange={(e) =>
                          handleFilterChange(e.target.name, e.target.value)
                        }
                      />
                    </div>
                  ))}
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Button onClick={applyFilters}>Apply</Button>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Column visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((col) => col.getCanHide())
                .map((col) => {
                  const visibleColumns = table
                    .getAllColumns()
                    .filter((c) => c.getCanHide() && c.getIsVisible());

                  const maxVisible = 8;
                  return (
                    <DropdownMenuCheckboxItem
                      key={col.id}
                      className="capitalize"
                      checked={col.getIsVisible()}
                      onCheckedChange={(value) => {
                        if (value && visibleColumns.length >= maxVisible) {
                          return;
                        }
                        col.toggleVisibility(!!value);
                      }}
                    >
                      {col.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.slice(0, 8).map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading
              ? // Skeleton rows
                Array.from({ length: 10 }).map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {columns.slice(0, 8).map((col, colIndex) => (
                      <TableCell key={colIndex}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer"
                    onClick={(e) => {
                      const target = e.target as HTMLElement;
                      if (
                        target.closest("input[type='checkbox']") ||
                        target.closest("button") ||
                        target.closest("label") ||
                        target.closest("svg")
                      )
                        return;

                      if (idFeildForShowStateSetter)
                        idFeildForShowStateSetter(Number(row.id));
                      if (showModelOpenerStateSetter)
                        showModelOpenerStateSetter(true);
                    }}
                  >
                    {row
                      .getVisibleCells()
                      .slice(0, 8)
                      .map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination info */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
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
    </div>
  );
};

export default DataTableDemo;

"use client";

import * as React from "react";
import {
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
import { useParentContext } from "@/contexts/ParentContext";
import { ChevronDown, Edit, Filter, Search, Trash } from "lucide-react";
import { Can } from "../Can";
import { DeleteButtonMessage } from "@/constants/ConfirmationModelsTexts";
import {
  DELETE_BUTTON_PROVIDER_ID,
  SUBMIT_BUTTON_PROVIDER_ID,
} from "@/config/System";
import { AxiosError, AxiosResponse } from "axios";
import { DataTableInterface } from "@/interfaces/Interfaces";
import { useEffect } from "react";
import StringHelper from "@/helpers/StringHelpers/StringHelper";

const DataTableDemo: React.FC<DataTableInterface> = ({
  columns,
  indexUrl,
  deleteUrl,
  searchableColumn,
  idFeildForEditStateSetter,
  editModelOpenerStateSetter,
  idFeildForShowStateSetter,
  showModelOpenerStateSetter,
  selectedRowsIdsStateSetter,
  injectedElement,
  injectedElementForOneSelectedItem,
  filtersList,
  deleteBtnPermission,
  editBtnPermission,
  viewPermission,
}) => {
  const {
    reqForToastAndSetMessage,
    reloadFlag,
    reqForConfirmationModelFunc,
    requestHandler,
  } = useParentContext();

  const [loading, setLoading] = React.useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState<any[]>([]);
  const [searchInput, setSearchInput] = React.useState<string>("");

  const [filters, setFilters] = React.useState<Record<string, string>>({});

  const [page, setPage] = React.useState(1);
  const [canNext, setCanNext] = React.useState<boolean>(false);
  const [canPrev, setCanPrev] = React.useState<boolean>(false);

  let searchTimer: NodeJS.Timeout | null = null;

  const TABLE_FILTER_KEY = `table_filters_${indexUrl}`;

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    setPage(1);
    // Save to localStorage
    localStorage.setItem(TABLE_FILTER_KEY, JSON.stringify(filters));
    handleFetch();
  };

  const clearFilters = () => {
    setFilters({});
    setPage(1);
    localStorage.removeItem(TABLE_FILTER_KEY); // remove saved filters
    handleFetch();
  };

  const fetchTableData = () => {
    setLoading(true);
    requestHandler()
      .get(indexUrl)
      .then((response: AxiosResponse<any, any, any>) => {
        setData(response.data.data);
      })
      .catch((err: AxiosError<any, any>) => {
        reqForToastAndSetMessage(
          err.response?.data?.message || "Failed to fetch data",
        );

        if (err.response?.data.data) setData(err.response?.data.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDelete = () => {
    const ids = Object.keys(rowSelection).map(Number);
    requestHandler()
      .post(deleteUrl, { ids })
      .then((res: any) => {
        reqForToastAndSetMessage(res.data.message);
        fetchTableData();
      })
      .catch((err: any) =>
        reqForToastAndSetMessage(
          err.response?.data?.message || "Delete failed",
        ),
      );
    setRowSelection({});
  };

  const handleSearch = () => {
    setPage(1);
    handleFetch();
  };

  const getUrl = (): string => {
    const params = new URLSearchParams();

    if (searchInput) {
      params.append("search", searchInput);
    }

    for (const key in filters) {
      if (filters[key] !== undefined && filters[key] !== null) {
        params.append(key, String(filters[key]));
      }
    }

    params.append("page", String(page));

    return `${indexUrl}?${params.toString()}`;
  };

  useEffect(() => {
    // Load saved filters from localStorage
    const savedFilters = localStorage.getItem(TABLE_FILTER_KEY);
    if (savedFilters) {
      setFilters(JSON.parse(savedFilters));
    }
  }, []);

  const handleFetch = () => {
    setLoading(true);
    requestHandler()
      .get(getUrl())
      .then((response: AxiosResponse<any, any>) => {
        if (response.data.data.data) {
          setData(response.data.data.data);
        } else {
          setData(response.data.data);
        }

        if (response.data.data.next_page_url) setCanNext(true);
        else setCanNext(false);

        if (response.data.data.prev_page_url) setCanPrev(true);
        else setCanPrev(false);
        setRowSelection({});
      })
      .catch((error: AxiosError<any, any>) => {
        if (error.response?.data.data) setData(error.response.data.data);
        reqForToastAndSetMessage(
          error.response?.data.message || "Failed to fetch data",
          "error"
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
    resetSearchTimer();
  };

  const resetSearchTimer = () => {
    if (searchTimer) clearTimeout(searchTimer);

    searchTimer = setTimeout(handleFetch, 3000);
  };

  const onNext = () => {
    setPage(page + 1);
    handleFetch();
  };

  const onPrev = () => {
    setPage(page - 1);
    handleFetch();
  };

  // fetch data
  useEffect(() => {
    handleFetch();
  }, [page, reloadFlag]);

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
    <div className="w-full min-h-[420px] relative">
      {/* Toolbar */}
      <div className="flex justify-between items-center py-4">
        <div className="flex flex-row gap-2 w-1/3">
          <Input
            placeholder={`Search By ${searchableColumn}`}
            value={searchInput}
            onChange={handleSearchInputChange}
            className="max-w-sm"
            type="search"
          />
          <Button variant={"secondary"} onClick={handleSearch} title="Search">
            <Search />
          </Button>
        </div>

        <div className="flex flex-row items-center gap-2">
          {injectedElement &&
            Object.keys(rowSelection).length >= 1 &&
            injectedElement}

          {injectedElementForOneSelectedItem &&
            Object.keys(rowSelection).length == 1 &&
            injectedElementForOneSelectedItem}

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

          {deleteUrl && Object.keys(rowSelection).length >= 1 && (
            <Can permission={deleteBtnPermission ?? "ok"}>
              <Button
                id={DELETE_BUTTON_PROVIDER_ID}
                onClick={() => {
                  reqForConfirmationModelFunc(
                    DeleteButtonMessage,
                    handleDelete,
                  );
                }}
                variant="outline"
              >
                <Trash color="red" />
              </Button>
            </Can>
          )}

          {/* Filter Popover */}
          {filtersList && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Filter />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 max-h-[350px] overflow-auto">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="leading-none font-medium">Filters</h4>
                    {/* <p className="text-muted-foreground text-sm">
                      Filter Projects.
                    </p> */}
                  </div>
                  <div className="grid gap-2">
                    {filtersList?.map((filter, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-3 items-center gap-4"
                      >
                        <Label htmlFor={filter}>
                          {StringHelper.normalize(filter)}
                        </Label>
                        <Input
                          id={filter}
                          name={filter}
                          className="col-span-2 h-8"
                          value={filters[filter] || ""}
                          onChange={(e) =>
                            handleFilterChange(e.target.name, e.target.value)
                          }
                        />
                      </div>
                    ))}
                    <div className="grid grid-cols-2 items-center gap-4">
                      <Button
                        id={SUBMIT_BUTTON_PROVIDER_ID}
                        onClick={applyFilters}
                      >
                        Apply
                      </Button>
                      <Button onClick={clearFilters}>Clear</Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

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
          <TableHeader className="bg-primary">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.slice(0, 8).map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {!loading &&
              // ?
              //   Array.from({ length: 10 }).map((_, rowIndex) => (
              //     <TableRow key={rowIndex}>
              //       {columns.slice(0, 8).map((col, colIndex) => (
              //         <TableCell key={colIndex}>
              //           <Skeleton className="h-4 w-full" />
              //         </TableCell>
              //       ))}
              //     </TableRow>
              //   ))
              // :

              table.getRowModel().rows.length >= 1 &&
              table.getRowModel().rows.map((row) => (
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
                    .map((cell) => {
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      );
                    })}
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {loading && (
          <div className="flex items-center justify-end space-x-2 relative top-20 h-[310px] py-4 w-full">
            <Skeleton className="h-[310px] w-full -top-20 absolute rounded-none bg-gray-500" />
          </div>
        )}

        {!loading && table.getRowModel().rows.length == 0 && (
          <div className="flex flex-row items-center justify-center h-[310px] text-gray-400 border-none">
            No Records
          </div>
        )}
      </div>

      {/* Pagination info */}
      <div className="flex items-center justify-end space-x-2 py-4 absolute -bottom-13 w-full">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPrev}
            disabled={!canPrev}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onNext}
            disabled={!canNext}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTableDemo;

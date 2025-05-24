"use client"
import type React from "react"

import { useState } from "react"
import { Filter, Search as SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Search } from "@/components/ui/search"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function NavbarSearch() {
  const [query, setSearchQuery] = useState("")

  const filter_items = [
    { key: "inStock", label: "In Stock" },
    { key: "freeShipping", label: "Free Shipping" },
    { key: "onSale", label: "On Sale" },
    { key: "topRated", label: "Top Rated" },
  ]

  const [filters, setFilters] = useState({
    inStock: false,
    freeShipping: false,
    onSale: false,
    topRated: false,
  })

  const handleFilterChange = (filterName: keyof typeof filters) => {
    setFilters({
      ...filters,
      [filterName]: !filters[filterName],
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Search query:", query)
    console.log("Filters:", filters)
  }


  return (
    <div className="container mx-auto h-16 flex items-center justify-between px-4">

      <form onSubmit={handleSearch} className="relative flex-1 max-w-md mx-4">
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Search
            type="text"
            placeholder="Search..."
            className="py-5 pl-9 pr-16"
            value={query}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="cursor-pointer absolute right-1 rounded-full flex items-center gap-1 h-8 px-3 border border-input"
              >
                <Filter className="h-3.5 w-3.5" />
                <span className="text-xs">Filters</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4" align="end">
              <div className="space-y-4">
                <h3 className="font-medium text-sm">Filter Options</h3>
                <div className="grid gap-2">
                  {filter_items.map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={key}
                        checked={filters[key as keyof typeof filters]}
                        onCheckedChange={() => handleFilterChange(key as keyof typeof filters)}
                      />
                      <Label htmlFor={key}>{label}</Label>
                    </div>
                  ))}

                </div>
                <Button type="submit" size="sm" className="w-full mt-2">
                  Apply Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </form>
    </div>
  )
}

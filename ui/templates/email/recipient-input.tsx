"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { X } from "lucide-react"

export interface RecipientInputProps {
  label: string
  value: string[]
  onChange: (v: string[]) => void
  suggestions?: string[]
  placeholder?: string
}

export function RecipientInput({ label, value, onChange, suggestions = [], placeholder }: RecipientInputProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const addRecipient = (email: string) => {
    const trimmed = email.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
    }
    setInputValue("")
    setOpen(false)
  }

  const removeRecipient = (email: string) => {
    onChange(value.filter((v) => v !== email))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault()
      addRecipient(inputValue)
    }
    if (e.key === "Backspace" && !inputValue && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  const filtered = suggestions.filter(
    (s) => s.toLowerCase().includes(inputValue.toLowerCase()) && !value.includes(s)
  )

  return (
    <div className="flex items-start gap-2 py-1">
      <Label className="w-8 shrink-0 pt-2 text-xs text-muted-foreground">{label}</Label>
      <div className="flex flex-1 flex-wrap items-center gap-1 rounded-md border border-input px-2 py-1 focus-within:ring-1 focus-within:ring-ring">
        {value.map((email) => (
          <Badge key={email} variant="secondary" className="h-5 gap-1 px-1.5 text-xs">
            {email}
            <button
              type="button"
              onClick={() => removeRecipient(email)}
              className="ml-0.5 rounded-sm hover:text-foreground"
              aria-label={`Remove ${email}`}
            >
              <X className="h-2.5 w-2.5" />
            </button>
          </Badge>
        ))}
        <Popover open={open && filtered.length > 0} onOpenChange={setOpen}>
          <PopoverTrigger
            nativeButton={false}
            render={(props) => (
              <div {...props} className="min-w-[120px] flex-1">
                <input
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value)
                    setOpen(e.target.value.length > 0)
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={value.length === 0 ? (placeholder ?? label) : ""}
                />
              </div>
            )}
          />
          <PopoverContent className="w-64 p-0" align="start">
            <Command>
              <CommandList>
                <CommandEmpty>Press Enter to add</CommandEmpty>
                <CommandGroup>
                  {filtered.map((s) => (
                    <CommandItem key={s} onSelect={() => addRecipient(s)}>
                      {s}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}

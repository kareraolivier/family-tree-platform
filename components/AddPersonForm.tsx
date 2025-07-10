"use client"

import type React from "react"

import { useState } from "react"
import type { Person } from "../types/family"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { UserPlus } from "lucide-react"

interface AddPersonFormProps {
  isOpen: boolean
  onClose: () => void
  onAddChild: (parentIds: string[], childData: Omit<Person, "id" | "parentIds">) => void
  onAddSpouse: (personId: string, spouseData: Omit<Person, "id" | "spouseId">) => void
  selectedPersonId?: string
  mode: "child" | "spouse"
  people: Record<string, Person>
}

export function AddPersonForm({
  isOpen,
  onClose,
  onAddChild,
  onAddSpouse,
  selectedPersonId,
  mode,
  people,
}: AddPersonFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    profilePicture: "",
    dateOfBirth: "",
    dateOfDeath: "",
    isDeceased: false,
    gender: "male" as Person["gender"],
    occupation: "",
    bio: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPersonId) return

    const personData = {
      ...formData,
      childrenIds: [],
      spouseId: undefined,
    }

    if (mode === "child") {
      const selectedPerson = people[selectedPersonId]
      const parentIds = selectedPerson.spouseId ? [selectedPersonId, selectedPerson.spouseId] : [selectedPersonId]
      onAddChild(parentIds, personData)
    } else {
      onAddSpouse(selectedPersonId, personData)
    }

    // Reset form
    setFormData({
      name: "",
      profilePicture: "",
      dateOfBirth: "",
      dateOfDeath: "",
      isDeceased: false,
      gender: "male",
      occupation: "",
      bio: "",
    })

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="w-5 h-5 mr-2" />
            Add {mode === "child" ? "Child" : "Spouse"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="profilePicture">Profile Picture URL</Label>
            <Input
              id="profilePicture"
              value={formData.profilePicture}
              onChange={(e) => setFormData((prev) => ({ ...prev, profilePicture: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value as Person["gender"] }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isDeceased"
              checked={formData.isDeceased}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isDeceased: checked }))}
            />
            <Label htmlFor="isDeceased">Deceased</Label>
          </div>

          {formData.isDeceased && (
            <div>
              <Label htmlFor="dateOfDeath">Date of Death</Label>
              <Input
                id="dateOfDeath"
                type="date"
                value={formData.dateOfDeath}
                onChange={(e) => setFormData((prev) => ({ ...prev, dateOfDeath: e.target.value }))}
              />
            </div>
          )}

          <div>
            <Label htmlFor="occupation">Occupation</Label>
            <Input
              id="occupation"
              value={formData.occupation}
              onChange={(e) => setFormData((prev) => ({ ...prev, occupation: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="bio">Biography</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add {mode === "child" ? "Child" : "Spouse"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

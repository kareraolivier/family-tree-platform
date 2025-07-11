"use client";

import type { Person } from "../types/family";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Skull } from "lucide-react";

interface PersonCardProps {
  person: Person;
  onClick: () => void;
  isSelected?: boolean;
  allPeople?: Record<string, Person>; // Add this line
}

export function PersonCard({
  person,
  onClick,
  isSelected = false,
  allPeople,
}: PersonCardProps) {
  return (
    <Card
      className={`relative cursor-pointer transition-all hover:shadow-lg ${
        isSelected ? "ring-2 ring-blue-500" : ""
      } ${person.isDeceased ? "opacity-75" : ""}`}
      onClick={onClick}
    >
      <div className="p-4 text-center">
        <div className="relative mb-3">
          <img
            src={person.profilePicture || "/placeholder.svg?height=80&width=80"}
            alt={person.name}
            className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-gray-200"
          />
          {person.isDeceased && (
            <div className="absolute -top-1 -right-1 bg-gray-800 rounded-full p-1">
              <Skull className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        <h3 className="font-semibold text-sm mb-1">{person.name}</h3>

        {person.dateOfBirth && (
          <div className="flex items-center justify-center text-xs text-gray-600 mb-1">
            <Calendar className="w-3 h-3 mr-1" />
            {new Date(person.dateOfBirth).getFullYear()}
            {person.isDeceased && person.dateOfDeath && (
              <span> - {new Date(person.dateOfDeath).getFullYear()}</span>
            )}
          </div>
        )}

        {person.occupation && (
          <Badge variant="secondary" className="text-xs">
            {person.occupation}
          </Badge>
        )}

        {person.spouseId && allPeople?.[person.spouseId] && (
          <div className="text-xs text-gray-600 mt-1">
            ♥ {allPeople[person.spouseId].name}
          </div>
        )}

        {person.isDeceased && (
          <Badge variant="destructive" className="text-xs mt-1">
            Deceased
          </Badge>
        )}
      </div>
    </Card>
  );
}

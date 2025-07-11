"use client";

import { useState, useMemo } from "react";
import type { Person, FamilyTreeData } from "../types/family";
import { PersonCard } from "./PersonCard";
import { PersonModal } from "./PersonModal";
import { AddPersonForm } from "./AddPersonForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Baby, Users } from "lucide-react";

interface FamilyTreeProps {
  familyData: FamilyTreeData;
  onUpdatePerson: (id: string, updates: Partial<Person>) => void;
  onAddChild: (
    parentIds: string[],
    childData: Omit<Person, "id" | "parentIds">
  ) => void;
  onAddSpouse: (
    personId: string,
    spouseData: Omit<Person, "id" | "spouseId">
  ) => void;
}

interface Generation {
  level: number;
  people: Person[];
  couples: Array<{ person1: Person; person2: Person }>;
}

export function FamilyTree({
  familyData,
  onUpdatePerson,
  onAddChild,
  onAddSpouse,
}: FamilyTreeProps) {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormMode, setAddFormMode] = useState<"child" | "spouse">("child");
  const [selectedPersonId, setSelectedPersonId] = useState<string>("");

  // Organize people by generations
  const generations = useMemo(() => {
    const getPersonLevel = (
      personId: string,
      visited: Set<string> = new Set()
    ): number => {
      // 1️⃣ Bail out if the reference is missing
      const person = familyData.people[personId];
      if (!person) return 0;

      // 2️⃣ Prevent infinite loops on circular refs
      if (visited.has(personId)) return 0;
      visited.add(personId);

      // 3️⃣ No parents ⇒ founder level
      if (!person.parentIds || person.parentIds.length === 0) return 0;

      // 4️⃣ Recursively inspect parents (ignore missing parents safely)
      const parentLevels = person.parentIds.map((pid) =>
        getPersonLevel(pid, visited)
      );
      return Math.max(...parentLevels) + 1;
    };

    const levelMap = new Map<number, Person[]>();

    Object.values(familyData.people).forEach((person) => {
      const level = getPersonLevel(person.id);
      if (!levelMap.has(level)) {
        levelMap.set(level, []);
      }
      levelMap.get(level)!.push(person);
    });

    const generationsArray: Generation[] = [];

    Array.from(levelMap.entries())
      .sort(([a], [b]) => a - b)
      .forEach(([level, people]) => {
        const couples: Array<{ person1: Person; person2: Person }> = [];
        const singles: Person[] = [];
        const processed = new Set<string>();

        people.forEach((person) => {
          if (processed.has(person.id)) return;

          if (
            person.spouseId &&
            !processed.has(person.spouseId) &&
            people.find((p) => p.id === person.spouseId)
          ) {
            const spouse = people.find((p) => p.id === person.spouseId)!;
            couples.push({ person1: person, person2: spouse });
            processed.add(person.id);
            processed.add(spouse.id);
          } else {
            singles.push(person);
            processed.add(person.id);
          }
        });

        generationsArray.push({
          level,
          people: singles,
          couples,
        });
      });

    return generationsArray;
  }, [familyData]);

  const getGenerationLabel = (level: number) => {
    const labels = [
      "Founders",
      "1st Generation",
      "2nd Generation",
      "3rd Generation",
      "4th Generation",
      "5th Generation",
      "6th Generation",
    ];
    return labels[level] || `${level}th Generation`;
  };

  const renderCouple = (couple: { person1: Person; person2: Person }) => (
    <div
      key={`${couple.person1.id}-${couple.person2.id}`}
      className="flex flex-col items-center"
    >
      <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border-2 border-pink-200 shadow-sm">
        <div className="text-center">
          <PersonCard
            person={couple.person1}
            onClick={() => setSelectedPerson(couple.person1)}
            isSelected={selectedPerson?.id === couple.person1.id}
            allPeople={familyData.people}
          />
        </div>

        <div className="flex flex-col items-center">
          <Heart className="w-6 h-6 text-pink-500 mb-2" />
          <div className="text-xs text-gray-500">Married</div>
        </div>

        <div className="text-center">
          <PersonCard
            person={couple.person2}
            onClick={() => setSelectedPerson(couple.person2)}
            isSelected={selectedPerson?.id === couple.person2.id}
            allPeople={familyData.people}
          />
        </div>
      </div>

      {/* Action buttons for the couple */}
      <div className="flex justify-center mt-3 space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSelectedPersonId(couple.person1.id);
            setAddFormMode("child");
            setShowAddForm(true);
          }}
        >
          <Baby className="w-3 h-3 mr-1" />
          Add Child
        </Button>
      </div>
    </div>
  );

  const renderSinglePerson = (person: Person) => (
    <div key={person.id} className="flex flex-col items-center">
      <PersonCard
        person={person}
        onClick={() => setSelectedPerson(person)}
        isSelected={selectedPerson?.id === person.id}
        allPeople={familyData.people}
      />

      {/* Action buttons */}
      <div className="flex justify-center mt-3 space-x-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSelectedPersonId(person.id);
            setAddFormMode("child");
            setShowAddForm(true);
          }}
        >
          <Baby className="w-3 h-3 mr-1" />
          Child
        </Button>
        {!person.spouseId && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedPersonId(person.id);
              setAddFormMode("spouse");
              setShowAddForm(true);
            }}
          >
            <Heart className="w-3 h-3 mr-1" />
            Spouse
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-8">
      {generations.map((generation) => (
        <div key={generation.level} className="space-y-4">
          {/* Generation Header */}
          <div className="flex items-center justify-center space-x-3">
            <div className="h-px bg-gray-300 flex-1"></div>
            <Badge
              variant="outline"
              className="px-4 py-2 text-lg font-semibold"
            >
              <Users className="w-4 h-4 mr-2" />
              {getGenerationLabel(generation.level)}
            </Badge>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>

          {/* Generation Members */}
          <div className="flex flex-wrap justify-center gap-8">
            {/* Render couples */}
            {generation.couples.map((couple) => renderCouple(couple))}

            {/* Render single people */}
            {generation.people.map((person) => renderSinglePerson(person))}
          </div>

          {/* Generation Stats */}
          <div className="text-center text-sm text-gray-500">
            {generation.couples.length > 0 && (
              <span>
                {generation.couples.length} couple
                {generation.couples.length !== 1 ? "s" : ""}
              </span>
            )}
            {generation.couples.length > 0 && generation.people.length > 0 && (
              <span> • </span>
            )}
            {generation.people.length > 0 && (
              <span>
                {generation.people.length} individual
                {generation.people.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      ))}

      <PersonModal
        person={selectedPerson}
        isOpen={!!selectedPerson}
        onClose={() => setSelectedPerson(null)}
        onUpdate={onUpdatePerson}
        allPeople={familyData.people}
      />

      <AddPersonForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onAddChild={onAddChild}
        onAddSpouse={onAddSpouse}
        selectedPersonId={selectedPersonId}
        mode={addFormMode}
        people={familyData.people}
      />
    </div>
  );
}
